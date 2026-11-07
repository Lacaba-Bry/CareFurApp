import { cors, json, handleError, AccessError } from '../_shared/bookingAccess.ts';
import { authorizeOwnerChat, getOrCreateConversation } from '../_shared/ownerChat.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json().catch(() => { throw new AccessError('Invalid request body', 400); });
    const { admin, user, booking } = await authorizeOwnerChat(req, body);
    const conversation = await getOrCreateConversation(admin, booking.id, user);

    const messagesResult = await admin.from('messages')
      .select('id,conversation_id,sender_user_id,sender_type,sender_name,message,read_at,created_at')
      .eq('conversation_id', conversation.id).order('created_at', { ascending: true }).limit(500);
    if (messagesResult.error) throw messagesResult.error;

    const [pet, room] = await Promise.all([
      admin.from('pets').select('id,name').eq('id', booking.pet_id).maybeSingle(),
      admin.from('rooms').select('id,room_number').eq('id', booking.room_id).maybeSingle(),
    ]);
    if (pet.error) throw pet.error;
    if (room.error) throw room.error;

    return json({
      accessType: 'account',
      messages: messagesResult.data ?? [],
      pet: pet.data ?? null,
      room: room.data ?? null,
    });
  } catch (error) {
    return handleError(error);
  }
});
