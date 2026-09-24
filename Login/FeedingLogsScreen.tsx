import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/FeedingStyles';

type Pet = {
  id: string;
  name?: string | null;
  species?: string | null;
  breed?: string | null;
  photo_url?: string | null;
};

type Booking = {
  id: string;
  status?: string | null;
};

type FeedingSchedule = {
  id: string;
  booking_id: string;
  scheduled_at: string;
  feeding_method?: string | null;
  compartment_number?: number | null;
  portion_grams?: number | null;
  instructions?: string | null;
  status?: string | null;
};

type FeedingLog = {
  id: string;
  booking_id: string;
  schedule_id?: string | null;
  feeder_device_id?: string | null;
  feeding_method?: string | null;
  compartment_number?: number | null;
  served_weight_grams?: number | null;
  remaining_weight_grams?: number | null;
  result?: 'success' | 'partial' | 'failed' | 'skipped' | string | null;
  completed_at?: string | null;
  notes?: string | null;
  created_at?: string | null;
};

type FilterType = 'all' | 'completed' | 'upcoming';

export default function FeedingLogsScreen({ route }: any) {
  const params = route?.params ?? {};
  const accessCode = params.accessCode ?? '';

  const [booking, setBooking] = useState<Booking | null>(params.booking ?? null);
  const [pet, setPet] = useState<Pet | null>(params.pet ?? null);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>(params.feedingSchedules ?? []);
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logNotice, setLogNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setLogNotice(null);
      let currentBooking = booking;

      if (accessCode) {
        const { data, error: verifyError } = await supabase.functions.invoke('verify-booking-code', {
          body: { code: accessCode },
        });
        if (verifyError) throw new Error(verifyError.message || 'Unable to load feeding information.');
        if (data?.error) throw new Error(data.error);
        if (data?.booking) {
          currentBooking = data.booking;
          setBooking(data.booking);
        }
        if (data?.pet) setPet(data.pet);
        setSchedules(data?.feedingSchedules ?? []);
      }

      if (!currentBooking?.id) throw new Error('No active booking was found.');

      const { data: logData, error: logError } = await supabase
        .from('feeding_logs')
        .select('id,booking_id,schedule_id,feeder_device_id,feeding_method,compartment_number,served_weight_grams,remaining_weight_grams,result,completed_at,notes,created_at')
        .eq('booking_id', currentBooking.id)
        .order('completed_at', { ascending: false });

      if (logError) {
        console.warn('Feeding logs query warning:', logError);
        setLogs([]);
        setLogNotice('Schedules loaded, but verification records are not available with the current database permissions.');
      } else {
        setLogs(logData ?? []);
      }
    } catch (err: any) {
      console.error('Feeding load error:', err);
      setError(err?.message || 'Unable to load feeding information.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessCode, booking?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const logBySchedule = useMemo(() => {
    const map = new Map<string, FeedingLog>();
    logs.forEach((log) => { if (log.schedule_id) map.set(log.schedule_id, log); });
    return map;
  }, [logs]);

  const entries = useMemo(() => {
    const sorted = [...schedules].sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
    const filtered = sorted.filter((schedule) => {
      const hasLog = logBySchedule.has(schedule.id);
      if (filter === 'completed') return schedule.status === 'completed' || hasLog;
      if (filter === 'upcoming') return schedule.status === 'pending' && !hasLog;
      return true;
    });

    const grouped: { key: string; label: string; items: FeedingSchedule[] }[] = [];
    for (const schedule of filtered) {
      const date = new Date(schedule.scheduled_at);
      const key = dateKey(date);
      let group = grouped.find((g) => g.key === key);
      if (!group) {
        group = { key, label: formatDayHeading(date), items: [] };
        grouped.push(group);
      }
      group.items.push(schedule);
    }
    return grouped;
  }, [schedules, filter, logBySchedule]);

  const completedCount = schedules.filter((s) => s.status === 'completed' || logBySchedule.has(s.id)).length;
  const upcomingCount = schedules.filter((s) => s.status === 'pending' && !logBySchedule.has(s.id)).length;
  const verifiedCount = logs.filter((log) => Boolean(log.result)).length;
  const petImage = pet?.photo_url ? { uri: pet.photo_url } : require('../assets/Login/DogProfile.jpg');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Feeding Activity</Text>
            <Text style={styles.pageSubtitle}>Schedules, completion status, and dispensing verification.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="nutrition" size={21} color={colors.primary} />
          </View>
        </View>

        <View style={styles.petCard}>
          <Image source={petImage} style={styles.petImage} />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet?.name || 'Your Pet'}</Text>
            <Text style={styles.petMeta}>{[capitalize(pet?.species), pet?.breed].filter(Boolean).join(' • ') || 'Current boarding stay'}</Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressValue}>{completedCount}/{schedules.length || 0}</Text>
            <Text style={styles.progressLabel}>done</Text>
          </View>
        </View>

        <View style={styles.summaryStrip}>
          <Summary icon="checkmark-circle" value={completedCount} label="Completed" color={colors.success} />
          <View style={styles.summaryDivider} />
          <Summary icon="time" value={upcomingCount} label="Upcoming" color={colors.warning} />
          <View style={styles.summaryDivider} />
          <Summary icon="shield-checkmark" value={verifiedCount} label="Verified" color={colors.primary} />
        </View>

        {error ? <Notice type="error" text={error} /> : null}
        {logNotice ? <Notice type="info" text={logNotice} /> : null}

        <View style={styles.filterRow}>
          <Filter label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <Filter label="Completed" active={filter === 'completed'} onPress={() => setFilter('completed')} />
          <Filter label="Upcoming" active={filter === 'upcoming'} onPress={() => setFilter('upcoming')} />
        </View>

        {loading && schedules.length === 0 ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading feeding activity...</Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Ionicons name="restaurant-outline" size={28} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>No feeding activity</Text>
            <Text style={styles.emptyText}>There are no feeding records in this view yet.</Text>
          </View>
        ) : (
          entries.map((group) => (
            <View key={group.key} style={styles.daySection}>
              <View style={styles.dayHeadingRow}>
                <Text style={styles.dayHeading}>{group.label}</Text>
                <Text style={styles.dayCount}>{group.items.length} meal{group.items.length === 1 ? '' : 's'}</Text>
              </View>
              {group.items.map((schedule) => (
                <FeedingCard key={schedule.id} schedule={schedule} log={logBySchedule.get(schedule.id)} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FeedingCard({ schedule, log }: { schedule: FeedingSchedule; log?: FeedingLog }) {
  const complete = schedule.status === 'completed' || Boolean(log);
  const result = log?.result ?? (complete ? 'completed' : schedule.status ?? 'pending');
  const tone = getResultTone(result);
  const scheduled = new Date(schedule.scheduled_at);
  const served = log?.served_weight_grams;
  const remaining = log?.remaining_weight_grams;
  const method = capitalize(log?.feeding_method || schedule.feeding_method || 'automatic');

  return (
    <View style={styles.logCard}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, { backgroundColor: tone.color }]} />
        <View style={styles.timelineLine} />
      </View>

      <View style={styles.logContent}>
        <View style={styles.logTop}>
          <View>
            <Text style={styles.time}>{formatTime(scheduled)}</Text>
            <Text style={styles.methodLine}>{method}{schedule.compartment_number ? ` • Chamber ${schedule.compartment_number}` : ''}</Text>
          </View>
          <View style={[styles.resultBadge, { backgroundColor: tone.bg }]}>
            <View style={[styles.resultDot, { backgroundColor: tone.color }]} />
            <Text style={[styles.resultText, { color: tone.color }]}>{capitalize(result)}</Text>
          </View>
        </View>

        <View style={styles.mealFacts}>
          <Fact icon="scale-outline" label="Scheduled" value={schedule.portion_grams != null ? `${schedule.portion_grams} g` : 'Not set'} />
          <Fact icon="checkmark-done-outline" label="Served" value={served != null ? `${served} g` : '—'} />
          <Fact icon="analytics-outline" label="Remaining" value={remaining != null ? `${remaining} g` : '—'} />
        </View>

        {log ? (
          <View style={styles.verificationBar}>
            <Ionicons name="shield-checkmark-outline" size={17} color={tone.color} />
            <View style={styles.verificationTextWrap}>
              <Text style={styles.verificationTitle}>Dispensing verification</Text>
              <Text style={styles.verificationBody}>
                {result === 'success' ? 'Feeding was verified successfully.' : `Verification result: ${capitalize(result)}.`}
                {log.completed_at ? ` ${formatCompletion(log.completed_at)}` : ''}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.pendingBar}>
            <Ionicons name="time-outline" size={16} color={colors.warning} />
            <Text style={styles.pendingText}>Waiting for the scheduled feeding or verification result.</Text>
          </View>
        )}

        {schedule.instructions || log?.notes ? (
          <View style={styles.notesRow}>
            <Ionicons name="document-text-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.notesText}>{log?.notes || schedule.instructions}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function Fact({ icon, label, value }: any) {
  return (
    <View style={styles.factItem}>
      <Ionicons name={icon} size={15} color={colors.primary} />
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function Summary({ icon, value, label, color }: any) {
  return (
    <View style={styles.summaryItem}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function Filter({ label, active, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Notice({ type, text }: { type: 'error' | 'info'; text: string }) {
  return (
    <View style={[styles.notice, type === 'error' ? styles.noticeError : styles.noticeInfo]}>
      <Ionicons name={type === 'error' ? 'alert-circle-outline' : 'information-circle-outline'} size={18} color={type === 'error' ? colors.danger : colors.primary} />
      <Text style={[styles.noticeText, { color: type === 'error' ? colors.danger : colors.primary }]}>{text}</Text>
    </View>
  );
}

function getResultTone(result: string) {
  const r = result.toLowerCase();
  if (r === 'success' || r === 'completed') return { color: colors.success, bg: colors.successSoft };
  if (r === 'failed') return { color: colors.danger, bg: colors.dangerSoft };
  if (r === 'partial' || r === 'pending') return { color: colors.warning, bg: colors.warningSoft };
  return { color: colors.textSecondary, bg: '#EFF3F2' };
}

function formatTime(date: Date) { return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); }
function formatCompletion(value: string) { const d = new Date(value); return Number.isNaN(d.getTime()) ? '' : `Completed ${formatTime(d)}.`; }
function dateKey(date: Date) { return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; }
function formatDayHeading(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dateKey(date) === dateKey(today)) return 'Today';
  if (dateKey(date) === dateKey(yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
function capitalize(value?: string | null) { if (!value) return ''; return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('_', ' '); }
