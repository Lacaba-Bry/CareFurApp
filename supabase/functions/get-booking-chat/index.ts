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
    const { bookingId, accessCode } = await req.json();
    if (!bookingId) throw new Error('bookingId is required.');

    const access = await authorizeStay({ admin, supabaseUrl, anonKey, authHeader, bookingId, accessCode });

    let { data: conversation, error: convError } = await admin
      .from('conversations')
      .select('id,booking_id,owner_id,owner_email')
      .eq('booking_id', bookingId)
      .maybeSingle();
    if (convError) throw convError;

    if (!conversation) {
      const ownerId = access.user?.id ?? null;
      const ownerEmail = access.user?.email ?? access.invitedEmail ?? null;

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

      const created = await admin
        .from('conversations')
        .insert({ booking_id: bookingId, owner_id: ownerId, owner_email: ownerEmail })
        .select('id,booking_id,owner_id,owner_email')
        .single();
      if (created.error) throw created.error;
      conversation = created.data;
    }

    const { data: messages, error: msgError } = await admin
      .from('messages')
      .select('id,conversation_id,sender_user_id,sender_type,sender_name,message,read_at,created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
    if (msgError) throw msgError;

    const { data: booking } = await admin
      .from('bookings')
      .select('id,pet:pets(id,name),room:rooms(id,room_number)')
      .eq('id', bookingId)
      .single();

    return json({
      accessType: access.user ? 'account' : 'guest',
      messages: messages || [],
      pet: booking?.pet ?? null,
      room: booking?.room ?? null,
    });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Unable to load chat.' }, 500);
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
