import { cors, json, handleError, AccessError } from '../_shared/bookingAccess.ts';
import { authorizeOwnerChat, ensureChatUser, getOrCreateConversation } from '../_shared/ownerChat.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json().catch(() => { throw new AccessError('Invalid request body', 400); });
    const message = String(body?.message ?? '').trim();
    if (!message || message.length > 6000) throw new AccessError('Message must be between 1 and 6000 characters.', 400);

    const { admin, user, booking } = await authorizeOwnerChat(req, body);
    const conversation = await getOrCreateConversation(admin, booking.id, user);
    await ensureChatUser(admin, user);
    // Preserve the admin's existing sender_type conventions.
    const inserted = await admin.from('messages').insert({
      conversation_id: conversation.id,
      sender_user_id: user.id,
      sender_type: 'customer',
      sender_name: String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pet Owner'),
      message,
    }).select('id,created_at').single();
    if (inserted.error) throw inserted.error;
    return json({ ok: true, message: inserted.data });
  } catch (error) {
    return handleError(error);
  }
});
