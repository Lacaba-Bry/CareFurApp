import {authorizeBooking,cors,handleError,json,AccessError} from '../_shared/bookingAccess.ts';
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const {code,days,reason}=await req.json();
    const {admin,email,booking,access}=await authorizeBooking(req,code);
    if(access.access_type === 'shared')throw new AccessError('Only a pet owner can request an extension',403);
    if(booking.status!=='checked_in' || booking.actual_check_out_at)
      throw new AccessError('Extensions require an active checked-in boarding stay',403);
    const count=Number(days);
    if(!Number.isInteger(count)||count<1||count>30)throw new AccessError('Choose 1 to 30 extra days',400);
    if(typeof reason!=='string'||reason.length>500)throw new AccessError('Reason is too long',400);
    const scheduled=Date.parse(booking.expected_check_out_at);
    if(!Number.isFinite(scheduled)||scheduled<=Date.now())throw new AccessError('Booking checkout has passed',403);
    const {data:owner,error:ownerError}=await admin.from('owners').select('id').ilike('email',email).maybeSingle();
    if(ownerError)throw ownerError;
    if(!owner)throw new AccessError('Your customer profile is not linked to this email',403);
    const {data:link,error:linkError}=await admin.from('pet_owner_links').select('id').eq('owner_id',owner.id).eq('pet_id',booking.pet_id).limit(1);
    if(linkError)throw linkError;
    if(!link?.length)throw new AccessError('The pet is not linked to your owner record',403);
    const {data:prior,error:priorError}=await admin.from('boarding_extension_requests').select('id').eq('booking_id',booking.id).eq('status','pending').limit(1);
    if(priorError)throw priorError;
    if(prior?.length)throw new AccessError('An extension request is already pending',409);
    const requested=new Date(scheduled+count*86400000).toISOString();
    const {error:insertError}=await admin.from('boarding_extension_requests').insert({
      booking_id:booking.id, owner_id:owner.id, requested_checkout_at:requested,
      reason:reason.trim()||null,status:'pending'
    });
    if(insertError){ if(insertError.code==='23505')throw new AccessError('An extension request is already pending',409);throw insertError; }
    return json({status:'pending',requested_checkout_at:requested});
  }catch(error){return handleError(error);}
});
