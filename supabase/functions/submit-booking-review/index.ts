import {cors,json,handleError,AccessError} from '../_shared/bookingAccess.ts';
import {createClient} from 'npm:@supabase/supabase-js@2';
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try{
  const token=req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if(!token)throw new AccessError('Sign in to review a stay',401);
  const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!url||!key)throw new AccessError('Server not configured',500);
  const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:auth,error:authError}=await admin.auth.getUser(token);
  if(authError||!auth.user?.email)throw new AccessError('Sign in again',401);
  const email=auth.user.email.trim().toLowerCase();
  const {bookingId,rating,comment}=await req.json();
  if(typeof bookingId!=='string'||!Number.isInteger(rating)||rating<1||rating>5)
    throw new AccessError('Invalid booking or rating',400);
  if(typeof comment!=='string'||comment.trim().length<10||comment.trim().length>1500)
    throw new AccessError('Enter 10 to 1500 characters',400);
  const {data:booking,error:bookingError}=await admin.from('bookings')
    .select('id,pet_id,status,actual_check_out_at').eq('id',bookingId).maybeSingle();
  if(bookingError)throw bookingError;
  if(!booking||booking.status!=='checked_out'||!booking.actual_check_out_at)
    throw new AccessError('Reviews are available after checkout',403);
  const {data:owner,error:ownerError}=await admin.from('owners').select('id').ilike('email',email).maybeSingle();
  if(ownerError)throw ownerError;
  if(!owner)throw new AccessError('This booking is not linked to your customer email',403);
  const {data:link,error:linkError}=await admin.from('pet_owner_links').select('id').eq('owner_id',owner.id).eq('pet_id',booking.pet_id).limit(1);
  if(linkError)throw linkError;
  if(!link?.length)throw new AccessError('This booking is not linked to your customer email',403);
  const {error:insertError}=await admin.from('boarding_reviews')
    .insert({booking_id:booking.id,owner_id:owner.id,rating,comment:comment.trim(),status:'approved'});
  if(insertError){if(insertError.code==='23505')throw new AccessError('This stay already has a review',409);throw insertError;}
  return json({status:'published'});
 }catch(error){return handleError(error);}
});
