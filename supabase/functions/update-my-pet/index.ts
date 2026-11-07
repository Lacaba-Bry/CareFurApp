import {createClient} from 'npm:@supabase/supabase-js@2';
import {cors,json,handleError,AccessError} from '../_shared/bookingAccess.ts';
const fields=['name','species','breed','sex','weight_kg','birth_date','allergies','medical_notes','feeding_notes','photo_url'];
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try{
  const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!url||!key)throw new AccessError('Server unavailable',500);
  const bearer=req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if(!bearer)throw new AccessError('Please sign in',401);
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:auth,error:authError}=await db.auth.getUser(bearer);
  const user=auth?.user;
  if(authError||!user?.email||!user.email_confirmed_at)throw new AccessError('Confirmed owner sign-in required',403);
  const {petId,updates}=await req.json();
  if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(String(petId)))throw new AccessError('Invalid pet',400);
  if(!updates||typeof updates!=='object'||Array.isArray(updates))throw new AccessError('Invalid fields',400);
  const normalized=user.email.trim().toLowerCase();
  const {data:owners,error:ownerError}=await db.from('owners').select('id').ilike('email',normalized).limit(20);
  if(ownerError)throw ownerError;
  const ids=(owners??[]).map((x:any)=>x.id);
  if(!ids.length)throw new AccessError('Only the pet owner can edit this profile',403);
  const {data:links,error:linkError}=await db.from('pet_owner_links').select('id').eq('pet_id',petId).in('owner_id',ids).limit(1);
  if(linkError)throw linkError;
  if(!links?.length)throw new AccessError('Only the linked pet owner can edit',403);
  const update:Record<string,any>={};
  for(const key of fields)if(Object.prototype.hasOwnProperty.call(updates,key))update[key]=updates[key];
  if(!Object.keys(update).length)throw new AccessError('No changes provided',400);
  if('name'in update&&(!String(update.name??'').trim()||String(update.name).length>100))throw new AccessError('Invalid name',400);
  if('species'in update&&(!String(update.species??'').trim()||String(update.species).length>60))throw new AccessError('Invalid species',400);
  for(const field of ['breed','allergies','medical_notes','feeding_notes'])if(typeof update[field]==='string'&&update[field].length>2000)throw new AccessError('Field is too long',400);
  if('weight_kg'in update&&update.weight_kg!=null&&(!Number.isFinite(Number(update.weight_kg))||Number(update.weight_kg)<=0))throw new AccessError('Invalid weight',400);
  // Photo paths can only be changed by a separately authenticated upload workflow. Never trust arbitrary URLs.
  delete update.photo_url;
  update.updated_at=new Date().toISOString();
  const {data:pet,error:saveError}=await db.from('pets').update(update).eq('id',petId).select('id,name,species,breed,sex,birth_date,weight_kg,allergies,medical_notes,feeding_notes,photo_url').single();
  if(saveError)throw saveError;
  return json({pet});
 }catch(error){return handleError(error);}
});
