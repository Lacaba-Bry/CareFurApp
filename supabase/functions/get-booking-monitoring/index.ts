// Customer monitoring endpoint. Deploy separately; never ship the service-role key in the app.
// A valid, unexpired, unrevoked booking access code is required on EVERY call.
import {authorizeBooking,cors as headers,handleError,json as response} from '../_shared/bookingAccess.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  try {
    const { code } = await req.json();
    const {admin:db,booking} = await authorizeBooking(req,code);
    const now = Date.now();
    const active = booking.status === 'checked_in' && !booking.actual_check_out_at &&
      Number.isFinite(Date.parse(booking.check_in_at)) && now >= Date.parse(booking.check_in_at) &&
      Number.isFinite(Date.parse(booking.expected_check_out_at)) && now < Date.parse(booking.expected_check_out_at);
    // Feeding history belongs to this booking only, regardless of room changes.
    const { data: feedingLogs, error: logError } = await db.from('feeding_logs')
      .select('id,booking_id,schedule_id,feeding_method,served_weight_grams,remaining_weight_grams,result,completed_at,notes')
      .eq('booking_id', booking.id).order('completed_at', { ascending: false }).limit(80);
    if (logError) throw logError;
    const { data: schedules, error: scheduleError } = await db.from('feeding_schedules')
      .select('id,booking_id,scheduled_at,feeding_method,compartment_number,portion_grams,instructions,status')
      .eq('booking_id', booking.id).order('scheduled_at', { ascending: true }).limit(120);
    if (scheduleError) throw scheduleError;
    let feeder = null, camera = null, foodState = null, foodEvents: unknown[] = [];
    // No live monitoring for a completed, pending, or expired booking.
    if (active && booking.room_id) {
      const { data: assignments, error: assignmentError } = await db.from('room_devices')
        .select('device_id').eq('room_id', booking.room_id).is('unassigned_at', null);
      if (assignmentError) throw assignmentError;
      const ids = [...new Set((assignments ?? []).map(x => x.device_id).filter(Boolean))];
      if (ids.length) {
        const { data: devices, error: deviceError } = await db.from('devices')
          .select('id,device_code,device_name,device_type,status,last_seen_at').in('id', ids);
        if (deviceError) throw deviceError;
        feeder = (devices ?? []).find(d => d.device_type === 'feeder' && d.status === 'active') ?? null;
        camera = (devices ?? []).find(d => d.device_type === 'camera' && d.status === 'active') ?? null;
        if (feeder) {
          const [stateResult, eventResult] = await Promise.all([
            db.from('feeder_food_state').select('device_code,weight_estimate_g,state,updated_at')
              .eq('device_code', feeder.device_code).maybeSingle(),
            db.from('feeder_food_events').select('id,device_code,event_type,weight_estimate_g,weight_change_g,message,created_at')
              .eq('device_code', feeder.device_code)
              .gte('created_at', booking.check_in_at)
              .lte('created_at', booking.expected_check_out_at)
              .order('created_at', { ascending: false }).limit(20),
          ]);
          if (stateResult.error) throw stateResult.error;
          if (eventResult.error) throw eventResult.error;
          foodState = stateResult.data;
          foodEvents = eventResult.data ?? [];
        }
      }
    }
    return response({ active, bookingId: booking.id, feedingSchedules: schedules ?? [], feedingLogs: feedingLogs ?? [],
      feeder, camera, foodState, foodEvents });
  } catch (err) {
    console.error('get-booking-monitoring failure', err);
    return handleError(err);
  }
});
