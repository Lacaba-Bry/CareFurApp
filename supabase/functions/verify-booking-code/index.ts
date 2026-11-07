import {authorizeBooking,cors,handleError,json} from '../_shared/bookingAccess.ts';
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const body=await req.json();
    const {admin,user,access,booking}=await authorizeBooking(req,body?.code);
    const [petResult,roomResult,schedulesResult,extensionResult]=await Promise.all([
      admin.from('pets').select('id,name,species,breed,sex,birth_date,weight_kg,allergies,medical_notes,feeding_notes,photo_url').eq('id',booking.pet_id).maybeSingle(),
      admin.from('rooms').select('id,room_number,room_name,capacity,status').eq('id',booking.room_id).maybeSingle(),
      admin.from('feeding_schedules').select('id,booking_id,scheduled_at,feeding_method,compartment_number,portion_grams,instructions,status').eq('booking_id',booking.id).order('scheduled_at',{ascending:true}).limit(150),
      admin.from('boarding_extension_requests').select('status').eq('booking_id',booking.id).order('created_at',{ascending:false}).limit(1).maybeSingle(),
    ]);
    for(const r of [petResult,roomResult,schedulesResult,extensionResult])if(r.error)throw r.error;
    if(access.access_type === 'shared' && !access.redeemed_by_user_id){
      const {error:redeemError}=await admin.from('booking_access').update({redeemed_by_user_id:user.id,redeemed_at:new Date().toISOString()}).eq('id',access.id).is('redeemed_by_user_id',null);
      if(redeemError)throw redeemError;
    }
    return json({booking,pet:petResult.data,room:roomResult.data,feedingSchedules:schedulesResult.data??[],
      latestExtensionStatus:extensionResult.data?.status??null,
      access:{id:access.id,ownerId:access.owner_id,invitedEmail:access.invited_email,expiresAt:access.expires_at,redeemedAt:access.redeemed_at,accessType:access.access_type ?? 'owner'}});
  }catch(error){return handleError(error);}
});
