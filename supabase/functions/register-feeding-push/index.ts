import { createClient } from 'npm:@supabase/supabase-js@2';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: cors });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return json({ error: 'Server not configured' }, 500);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const jwt = req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jwt) return json({ error: 'Please sign in' }, 401);
  const { data: auth, error: authError } = await db.auth.getUser(jwt);
  if (authError || !auth.user?.id) return json({ error: 'Invalid session' }, 401);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const token = String(body.token ?? '');
  if (token.length > 256 || !/^(ExpoPushToken|ExponentPushToken)\[[A-Za-z0-9_-]+\]$/.test(token))
    return json({ error: 'Invalid Expo push token' }, 400);
  if (body.action === 'unregister') {
    const { error } = await db.from('carefur_feeding_push_tokens').delete()
      .eq('expo_push_token', token).eq('auth_user_id', auth.user.id);
    if (error) return json({ error: 'Could not disable notifications' }, 500);
    return json({ success: true });
  }
  if (body.action !== 'register' || !['android','ios'].includes(body.platform))
    return json({ error: 'Invalid registration' }, 400);
  const { error } = await db.from('carefur_feeding_push_tokens').upsert({
    expo_push_token: token, auth_user_id: auth.user.id,
    platform: body.platform, updated_at: new Date().toISOString(),
  }, { onConflict: 'expo_push_token' });
  if (error) { console.error('Push registration:', error.message); return json({ error: 'Could not enable notifications' }, 500); }
  return json({ success: true });
});
