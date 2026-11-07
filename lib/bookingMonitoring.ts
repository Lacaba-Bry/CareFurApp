import { supabase } from './supabase';

export type FoodState = { device_code: string; weight_estimate_g: number; state: string; updated_at: string };
export type FoodEvent = { id: number; device_code: string; event_type: string; weight_estimate_g: number; weight_change_g: number | null; message: string; created_at: string };
export type MonitoringDevice = { id: string; device_code: string; device_name: string | null; device_type: string; status: string; last_seen_at: string | null };
export type MonitoringData = {
  active: boolean;
  bookingId: string;
  feedingSchedules: any[];
  feedingLogs: any[];
  feeder: MonitoringDevice | null;
  camera: MonitoringDevice | null;
  foodState: FoodState | null;
  foodEvents: FoodEvent[];
};
export async function getBookingMonitoring(accessCode: string): Promise<MonitoringData> {
  if (!accessCode) throw new Error('Booking access code required');
  const { data, error } = await supabase.functions.invoke('get-booking-monitoring', { body: { code: accessCode } });
  if (error) { let message=error.message || 'Monitoring request failed'; try { const payload=await error.context?.json?.(); if(payload?.error)message=payload.error; }catch{} throw new Error(message); }
  if (!data || data.error) throw new Error(data?.error || 'Monitoring data unavailable');
  return data as MonitoringData;
}
export function foodStateLabel(state: string | undefined) {
  if (state === 'empty') return 'Plate empty';
  if (state === 'food_stable') return 'Food detected';
  if (state === 'possible_eating') return 'Possible eating detected';
  return 'No sensor reading';
}
