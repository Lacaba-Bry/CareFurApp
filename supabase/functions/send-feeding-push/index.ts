import { createClient } from 'npm:@supabase/supabase-js@2';

// Invoked ONLY by Supabase Database Webhooks for feeding_logs / feeding_schedules.
// Use the X-CareFur-Webhook-Secret header; never place this secret in mobile code.
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});
const matches = (a: string, b: string) => {
  if (!a || !b || a.length !== b.length) return false;
  let different = 0;
  for (let i = 0; i < a.length; i++) different |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return different === 0;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  const configured = Deno.env.get('CAREFUR_FEEDING_WEBHOOK_SECRET') || '';
  if (!configured || !matches(configured, req.headers.get('x-carefur-webhook-secret') || ''))
    return reply({ error: 'Forbidden' }, 403);

  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return reply({ error: 'Missing Supabase configuration' }, 500);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const event = await req.json();
    if (event.type !== 'INSERT' && event.type !== 'UPDATE') return reply({ skipped: true });
    if (event.schema !== 'public' || !['feeding_logs','feeding_schedules'].includes(event.table))
      return reply({ skipped: true });
    const id = event.record?.id;
    if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) return reply({ skipped: true });
    const isSchedule = event.table === 'feeding_schedules';
    let kind = '';
    let record: any = null;
    let bookingId = '';

    if (isSchedule) {
      if (event.type !== 'UPDATE') return reply({ skipped: true });
      const status = String(event.record?.status ?? '').toLowerCase();
      const previous = String(event.old_record?.status ?? '').toLowerCase();
      if (status === previous || !['in_progress','processing','dispensing','completed'].includes(status))
        return reply({ skipped: true });
      const current = await db.from('feeding_schedules')
        .select('id,booking_id,status,scheduled_at').eq('id', id).maybeSingle();
      if (current.error || !current.data || current.data.status !== status) return reply({ skipped: true });
      record = current.data;
      kind = status === 'completed' ? 'done' : 'processing';
      bookingId = record.booking_id;
    } else {
      if (event.type !== 'INSERT') return reply({ skipped: true });
      const current = await db.from('feeding_logs')
        .select('id,booking_id,schedule_id,result,completed_at').eq('id', id).maybeSingle();
      if (current.error || !current.data || current.data.result !== 'success') return reply({ skipped: true });
      record = current.data;
      kind = 'done';
      bookingId = record.booking_id;
    }

    const { data: booking, error: bookingError } = await db.from('bookings')
      .select('id,pet_id,status,actual_check_out_at,check_in_at,expected_check_out_at')
      .eq('id', bookingId).maybeSingle();
    if (bookingError || !booking || booking.status !== 'checked_in' || booking.actual_check_out_at ||
        Date.parse(booking.check_in_at) > Date.now() || Date.parse(booking.expected_check_out_at) <= Date.now())
      return reply({ skipped: true });

    // A confirmation log and an updated completed schedule should not send two pushes.
    const dedupeId = kind === 'done' && !isSchedule && record.schedule_id ? record.schedule_id : id;
    const eventKey = `${booking.id}:${kind}:${dedupeId}`;
    const { data: inserted, error: dedupeError } = await db.from('carefur_feeding_push_events')
      .insert({ event_key: eventKey }).select('event_key').maybeSingle();
    if (dedupeError?.code === '23505') return reply({ skipped: 'already sent' });
    if (dedupeError || !inserted) throw dedupeError || new Error('Deduplication failed');

    // Only currently redeemed customers may receive notifications. No revoked/expired access.
    const { data: access, error: accessError } = await db.from('booking_access')
      .select('redeemed_by_user_id,expires_at,revoked_at,redeemed_at')
      .eq('booking_id', booking.id).not('redeemed_by_user_id','is',null)
      .is('revoked_at',null).not('redeemed_at','is',null);
    if (accessError) throw accessError;
    const userIds = [...new Set((access ?? [])
      .filter(a => !a.expires_at || Date.parse(a.expires_at) > Date.now())
      .map(a => a.redeemed_by_user_id))];
    if (!userIds.length) return reply({ sent: 0 });

    const { data: tokens, error: tokenError } = await db.from('carefur_feeding_push_tokens')
      .select('expo_push_token').in('auth_user_id', userIds);
    if (tokenError) throw tokenError;
    if (!tokens?.length) return reply({ sent: 0 });

    const title = kind === 'processing' ? 'CareFur feeding in progress' : 'CareFur feeding completed';
    const body = kind === 'processing' ? 'Your pet’s scheduled feeding is being prepared.' :
      'Your pet’s scheduled feeding has been marked complete.';
    const messages = tokens.map(row => ({
      to: row.expo_push_token, title, body,
      channelId: 'carefur-feeding', sound: 'default',
      data: { type: 'feeding', bookingId: booking.id },
    }));
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
    if (!response.ok) throw new Error(`Expo push service status ${response.status}`);
    const result = await response.json();
    const tickets = Array.isArray(result.data) ? result.data : [];
    if (tickets.some((ticket: any) => ticket?.status === 'error')) {
      // Expo accepted some messages but rejected others. This is reported for
      // operator review; do not automatically resend all recipients.
      console.warn('Expo rejected one or more push tickets');
    }
    return reply({ sent: messages.length, tickets: tickets.length });
  } catch (error) {
    console.error('Feeding push dispatch failed:', error instanceof Error ? error.message : 'unknown');
    return reply({ error: 'Unable to dispatch feeding push' }, 500);
  }
});
