import { createClient } from 'npm:@supabase/supabase-js@2';

// This endpoint is used by Expo Web and native. Preflight is handled here.
// Deploy with verify_jwt=false; this function verifies the Supabase JWT itself.
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};
const send = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });
class ClientError extends Error {
  constructor(message: string, public status = 403) { super(message); }
}
async function hashCode(code: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
const cleanEmail = (value: unknown) => String(value ?? '').trim().toLowerCase();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers });
  if (req.method !== 'POST') return send({ error: 'Method not allowed.' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) throw new ClientError('Server configuration is incomplete.', 500);
    const admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const token = req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new ClientError('Please sign in first.', 401);
    const { data: auth, error: authError } = await admin.auth.getUser(token);
    const user = auth?.user;
    if (authError || !user?.id || !user.email) throw new ClientError('Session expired. Please sign in again.', 401);
    if (!user.email_confirmed_at) throw new ClientError('Confirm your email first.', 403);
    let body: any;
    try { body = await req.json(); } catch { throw new ClientError('Invalid request.', 400); }
    const code = String(body?.code ?? '').trim().toUpperCase();
    const days = Number(body?.days);
    const reason = body?.reason ?? '';
    if (!/^[A-Z0-9]{8}$/.test(code)) throw new ClientError('Enter a valid boarding access code.', 400);
    if (!Number.isInteger(days) || days < 1 || days > 3) throw new ClientError('Select 1, 2, or 3 extra days.', 400);
    if (typeof reason !== 'string' || reason.length > 500) throw new ClientError('Reason must be 500 characters or fewer.', 400);

    const { data: access, error: accessError } = await admin.from('booking_access')
      .select('id,booking_id,invited_email,access_type,expires_at,revoked_at,redeemed_at,redeemed_by_user_id')
      .eq('access_code_hash', await hashCode(code)).maybeSingle();
    if (accessError) throw accessError;
    if (!access || cleanEmail(access.invited_email) !== cleanEmail(user.email))
      throw new ClientError('This code is not assigned to your signed-in email.', 403);
    if (access.access_type === 'shared') throw new ClientError('Only the primary owner can request an extension.', 403);
    if (access.revoked_at || !access.expires_at || Date.parse(access.expires_at) <= Date.now())
      throw new ClientError('Your boarding access has expired or been revoked.', 403);
    if (!access.redeemed_at || access.redeemed_by_user_id !== user.id)
      throw new ClientError('Please redeem your boarding code again before requesting an extension.', 403);

    const { data: booking, error: bookingError } = await admin.from('bookings')
      .select('id,pet_id,room_id,status,check_in_at,expected_check_out_at,actual_check_out_at')
      .eq('id', access.booking_id).maybeSingle();
    if (bookingError) throw bookingError;
    if (!booking || booking.status !== 'checked_in' || booking.actual_check_out_at)
      throw new ClientError('Only an active checked-in stay can be extended.', 403);
    const checkOut = Date.parse(booking.expected_check_out_at);
    if (!Number.isFinite(checkOut) || checkOut <= Date.now())
      throw new ClientError('This stay has already reached checkout.', 403);

    // The extension table uses public.owners.id, not auth.users.id.
    const { data: owners, error: ownerError } = await admin.from('owners')
      .select('id').ilike('email', cleanEmail(user.email)).limit(2);
    if (ownerError) throw ownerError;
    if (!owners || owners.length !== 1)
      throw new ClientError('A unique customer owner profile could not be found. Please contact CareFur staff.', 403);
    const ownerId = owners[0].id;

    // Refuse duplicate pending requests; database partial unique index also protects races.
    const { data: pending, error: pendingError } = await admin.from('boarding_extension_requests')
      .select('id').eq('booking_id', booking.id).eq('status', 'pending').limit(1);
    if (pendingError) throw pendingError;
    if (pending?.length) throw new ClientError('An extension request is already awaiting staff approval.', 409);

    const requestedDate = new Date(checkOut + days * 86400000).toISOString();
    const { error: insertError } = await admin.from('boarding_extension_requests').insert({
      booking_id: booking.id,
      owner_id: ownerId,
      requested_checkout_at: requestedDate,
      reason: reason.trim() || null,
      status: 'pending',
    });
    if (insertError?.code === '23505') throw new ClientError('An extension request is already pending.', 409);
    if (insertError) throw insertError;
    return send({ success: true, status: 'pending', requested_checkout_at: requestedDate });
  } catch (error) {
    if (error instanceof ClientError) return send({ error: error.message }, error.status);
    console.error('request-booking-extension failed', error);
    return send({ error: 'Unable to submit extension. Please contact CareFur staff.' }, 500);
  }
});
