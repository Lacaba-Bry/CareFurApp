import { authorizeBooking, AccessError } from './bookingAccess.ts';

/** The supplied boarding access code, not the caller-supplied booking ID, is the authority. */
export async function authorizeOwnerChat(req: Request, body: any) {
  const code = String(body?.accessCode ?? '').trim().toUpperCase();
  const bookingId = String(body?.bookingId ?? '').trim();
  if (!bookingId) throw new AccessError('Booking ID is required.', 400);
  if (!code) throw new AccessError('Enter the boarding code assigned to your account.', 403);

  const context = await authorizeBooking(req, code);
  if (context.booking.id !== bookingId) {
    throw new AccessError('That boarding code does not belong to this stay.', 403);
  }
  if ((context.access.access_type ?? 'owner') !== 'owner') {
    throw new AccessError('Shared viewers cannot use Message Stay.', 403);
  }
  // Older owner invitations can have owner_id=NULL and redeemed_at=NULL.
  // The SHA-256 code + exact confirmed email must match; a different non-null owner ID is denied
  // inside authorizeBooking. Do not make redemption a prerequisite for an owner invitation.
  if (['cancelled', 'canceled', 'no_show'].includes(String(context.booking.status).toLowerCase())) {
    throw new AccessError('This boarding stay is no longer available for messaging.', 403);
  }
  return context;
}

/** Only create a missing auth-linked user row; never overwrite a staff/admin role. */
export async function ensureChatUser(admin: any, user: any) {
  const { data: existing, error: readError } = await admin.from('users')
    .select('id').eq('id', user.id).maybeSingle();
  if (readError) throw readError;
  if (existing) return;

  const { error: insertError } = await admin.from('users').insert({
    id: user.id,
    full_name: String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pet Owner'),
    email: user.email || null,
    role: 'owner',
  });
  // Another concurrent request may have created this user.
  if (insertError && insertError.code !== '23505') throw insertError;
}

export async function getOrCreateConversation(admin: any, bookingId: string, user: any) {
  const select = 'id,booking_id,owner_id,owner_email';
  const found = await admin.from('conversations').select(select)
    .eq('booking_id', bookingId).maybeSingle();
  if (found.error) throw found.error;
  if (found.data) return found.data;

  await ensureChatUser(admin, user);
  const created = await admin.from('conversations').insert({
    booking_id: bookingId,
    owner_id: user.id,
    owner_email: user.email,
  }).select(select).single();

  if (!created.error) return created.data;
  if (created.error.code === '23505') {
    const retry = await admin.from('conversations').select(select).eq('booking_id', bookingId).single();
    if (retry.error) throw retry.error;
    return retry.data;
  }
  throw created.error;
}
