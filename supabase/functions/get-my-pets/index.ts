import {cors, json, handleError, AccessError} from '../_shared/bookingAccess.ts';
import {createClient} from 'npm:@supabase/supabase-js@2';
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return json({error:'Method not allowed'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if(!url||!key)throw new AccessError('Server is not configured',500);
    const token=req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if(!token)throw new AccessError('Please sign in',401);
    const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data,error}=await admin.auth.getUser(token);
    const user=data?.user;
    if(error||!user?.email||!user.email_confirmed_at)throw new AccessError('Confirm your account email to view pets',403);
    const email=user.email.trim().toLowerCase();
    const {data:owners,error:ownerError}=await admin.from('owners').select('id').ilike('email',email).limit(20);
    if(ownerError)throw ownerError;
    const ownerIds=(owners??[]).map((o:any)=>o.id);
    if(!ownerIds.length)return json({pets:[]});
    const {data:links,error:linkError}=await admin.from('pet_owner_links').select('pet_id').in('owner_id',ownerIds).limit(100);
    if(linkError)throw linkError;
    const ids=[...new Set((links??[]).map((x:any)=>x.pet_id).filter(Boolean))];
    if(!ids.length)return json({pets:[]});
    const {data:pets,error:petError}=await admin.from('pets').select('id,name,species,breed,sex,photo_url,birth_date,weight_kg,allergies,medical_notes,feeding_notes').in('id',ids).limit(100);
    if(petError)throw petError;
    return json({pets:pets??[]});
  }catch(e){return handleError(e);}
});
