import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);
    const authHeader = req.headers.get('Authorization') || '';
    const { bookingId, accessCode, message } = await req.json();
    if (!bookingId) throw new Error('bookingId is required.');
    if (!message || !String(message).trim()) throw new Error('message is required.');

    const access = await authorizeStay({ admin, supabaseUrl, anonKey, authHeader, bookingId, accessCode });

    let { data: conversation, error: convError } = await admin.from('conversations').select('id').eq('booking_id', bookingId).maybeSingle();
    if (convError) throw convError;

    if (access.user) {
      const { data: owner } = await admin.from('owners').select('full_name,email,phone').eq('id', access.user.id).maybeSingle();
      await admin.from('users').upsert({
        id: access.user.id,
        full_name: owner?.full_name || access.user.user_metadata?.full_name || access.user.email?.split('@')[0] || 'Pet Owner',
        email: owner?.email || access.user.email || null,
        phone: owner?.phone || null,
        role: 'owner',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    }

    if (!conversation) {
      const created = await admin.from('conversations').insert({
        booking_id: bookingId,
        owner_id: access.user?.id ?? null,
        owner_email: access.user?.email ?? access.invitedEmail ?? null,
      }).select('id').single();
      if (created.error) throw created.error;
      conversation = created.data;
    }

    const senderName = access.user
      ? access.user.user_metadata?.full_name || access.user.email?.split('@')[0] || 'Pet Owner'
      : 'Guest Owner';

    const inserted = await admin.from('messages').insert({
      conversation_id: conversation.id,
      sender_user_id: access.user?.id ?? null,
      sender_type: access.user ? 'customer' : 'guest',
      sender_name: senderName,
      message: String(message).trim(),
    }).select('id,created_at').single();
    if (inserted.error) throw inserted.error;

    return json({ ok: true, message: inserted.data });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Unable to send message.' }, 500);
  }
});

async function authorizeStay({ admin, supabaseUrl, anonKey, authHeader, bookingId, accessCode }: any) {
  let user: any = null;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const result = await admin.auth.getUser(token);
    user = result.data.user;
  }

  if (user) {
    const now = new Date().toISOString();
    const { data: accessRows } = await admin
      .from('booking_access')
      .select('id,owner_id,invited_email,expires_at,revoked_at')
      .eq('booking_id', bookingId)
      .is('revoked_at', null)
      .gt('expires_at', now);
    const permitted = (accessRows || []).some((row: any) =>
      row.owner_id === user.id || (!!user.email && row.invited_email?.toLowerCase() === user.email.toLowerCase())
    );
    if (permitted) return { user, invitedEmail: user.email };
  }

  if (accessCode) {
    const verify = await fetch(`${supabaseUrl}/functions/v1/verify-booking-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ code: accessCode }),
    });
    const verified = await verify.json();
    if (verify.ok && verified?.booking?.id === bookingId) {
      return { user: null, invitedEmail: verified?.owner?.email || verified?.invitedEmail || null };
    }
  }

  throw new Error('You do not have access to this boarding conversation.');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
