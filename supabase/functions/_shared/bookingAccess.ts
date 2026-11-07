import { createClient } from 'npm:@supabase/supabase-js@2';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};
export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {status, headers: cors});
export class AccessError extends Error {
  constructor(message: string, public status = 403) { super(message); }
}
export const handleError = (error: unknown) => {
  if (error instanceof AccessError) return json({error: error.message}, error.status);
  console.error('Secure booking function failed', error);
  return json({error:'Unable to process this request'},500);
};
async function hashCode(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
}
export async function authorizeBooking(req: Request, input: unknown) {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new AccessError('Server configuration unavailable', 500);
  const admin = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const bearer = req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) throw new AccessError('Please sign in first',401);
  const {data:authData,error:authError} = await admin.auth.getUser(bearer);
  const user = authData?.user;
  if (authError || !user?.id || !user.email) throw new AccessError('Your login has expired. Sign in again.',401);
  if (!user.email_confirmed_at) throw new AccessError('Confirm your email before using a boarding code',403);
  const email = user.email.trim().toLowerCase();
  // Per-user failed-attempt throttle. This existing table is maintained by the service role.
  const recentWindow=new Date(Date.now()-15*60*1000).toISOString();
  const {count:recentFailures,error:failCountError}=await admin.from('booking_code_redemption_attempts')
    .select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('successful',false).gte('attempted_at',recentWindow);
  if(failCountError)throw failCountError;
  if((recentFailures??0)>=10)throw new AccessError('Too many unsuccessful code attempts. Try again later.',429);
  const badCode=async(message:string,status=403)=>{
    await admin.from('booking_code_redemption_attempts').insert({user_id:user.id,successful:false});
    throw new AccessError(message,status);
  };
  const code = String(input ?? '').trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(code)) await badCode('Invalid boarding access code',400);
  const {data:access,error:accessError} = await admin.from('booking_access')
    .select('id,booking_id,owner_id,invited_email,expires_at,revoked_at,redeemed_at,access_type,redeemed_by_user_id')
    .eq('access_code_hash',await hashCode(code)).maybeSingle();
  if (accessError) throw accessError;
  if (!access || access.revoked_at || !access.expires_at || Date.parse(access.expires_at) <= Date.now()) {
    await badCode('This access code is invalid, expired, or revoked',403);
  }
  // Both requirements are important: the code must belong to THIS login's invitation.
  if (access.invited_email?.trim().toLowerCase() !== email || (access.owner_id && access.owner_id !== user.id) || (access.redeemed_by_user_id && access.redeemed_by_user_id !== user.id)) {
    await badCode('This access code is not assigned to your signed-in email',403);
  }
  if (access.access_type === 'shared' && !user.email_confirmed_at) throw new AccessError('Confirm the invited email to access this stay',403);
  const {data:booking,error:bookingError} = await admin.from('bookings')
    .select('id,booking_code,pet_id,room_id,status,check_in_at,expected_check_out_at,actual_check_out_at,special_instructions')
    .eq('id',access.booking_id).maybeSingle();
  if (bookingError) throw bookingError;
  if (!booking || ['cancelled','no_show'].includes(booking.status)) throw new AccessError('Booking unavailable',403);
  return {admin,user,email,access,booking};
}
