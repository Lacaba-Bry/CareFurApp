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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/BoardingDetailsStyles';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';

type Booking = {
  id: string;
  booking_code?: string | null;
  status?: string | null;
  check_in_at?: string | null;
  expected_check_out_at?: string | null;
  actual_check_out_at?: string | null;
  special_instructions?: string | null;
};

type Pet = {
  id: string;
  name?: string | null;
  species?: string | null;
  breed?: string | null;
  sex?: string | null;
  photo_url?: string | null;
  feeding_notes?: string | null;
};

type Room = {
  id: string;
  room_number?: string | null;
  room_name?: string | null;
  capacity?: number | null;
  status?: string | null;
};

type FeedingSchedule = {
  id: string;
  scheduled_at: string;
  feeding_method?: string | null;
  compartment_number?: number | null;
  portion_grams?: number | null;
  instructions?: string | null;
  status?: string | null;
};

export default function BoardingDetails({ navigation, route }: any) {
  const params = route?.params ?? {};
  const [booking, setBooking] = useState<Booking | null>(params.booking ?? null);
  const [pet, setPet] = useState<Pet | null>(params.pet ?? null);
  const [room, setRoom] = useState<Room | null>(params.room ?? null);
  const [feedings, setFeedings] = useState<FeedingSchedule[]>(params.feedingSchedules ?? []);
  const [loading, setLoading] = useState(!params.booking);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const code = params.accessCode || await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
      if (!code) throw new Error('No active boarding access code was found.');

      const { data, error: functionError } = await supabase.functions.invoke('verify-booking-code', { body: { code } });
      if (functionError) throw new Error(functionError.message || 'Unable to load boarding details.');
      if (data?.error) throw new Error(data.error);
      if (!data?.booking) throw new Error('Boarding information could not be found.');

      setBooking(data.booking);
      setPet(data.pet ?? null);
      setRoom(data.room ?? null);
      setFeedings(data.feedingSchedules ?? []);
    } catch (err: any) {
      console.error('BoardingDetails error:', err);
      setError(err?.message || 'Unable to load boarding details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.accessCode]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const sortedFeedings = useMemo(
    () => [...feedings].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()),
    [feedings]
  );

  const todaysFeedings = useMemo(() => {
    const today = new Date();
    return sortedFeedings.filter((feeding) => isSameDay(new Date(feeding.scheduled_at), today));
  }, [sortedFeedings]);

  const displayFeedings = todaysFeedings.length ? todaysFeedings : sortedFeedings.slice(0, 6);

  const petImage = pet?.photo_url ? { uri: pet.photo_url } : require('../assets/Login/DogProfile.jpg');
  const remainingDays = booking?.expected_check_out_at
    ? Math.max(0, Math.ceil((new Date(booking.expected_check_out_at).getTime() - Date.now()) / 86400000))
    : 0;
  const statusTone = getStatusTone(booking?.status);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color={colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Boarding Details</Text>
          <Text style={styles.headerSubtitle}>Current stay overview</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

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
        {loading && !booking ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading boarding details...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.notice}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
                <Text style={styles.noticeText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.heroCard}>
              <Image source={petImage} style={styles.petImage} />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet?.name || 'Your Pet'}</Text>
                <Text style={styles.petMeta}>{[capitalize(pet?.species), pet?.breed, capitalize(pet?.sex)].filter(Boolean).join(' • ') || 'Pet'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusTone.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusTone.color }]} />
                  <Text style={[styles.statusText, { color: statusTone.color }]}>{statusTone.label}</Text>
                </View>
              </View>
              <View style={styles.daysPill}>
                <Text style={styles.daysValue}>{remainingDays}</Text>
                <Text style={styles.daysLabel}>days left</Text>
              </View>
            </View>

            <View style={styles.stayCard}>
              <View style={styles.roomHeaderRow}>
                <View style={styles.roomIcon}><Ionicons name="home" size={18} color={colors.primary} /></View>
                <View style={styles.roomTextWrap}>
                  <Text style={styles.roomLabel}>Assigned room</Text>
                  <Text style={styles.roomValue}>{room?.room_number || '—'}{room?.room_name ? ` • ${room.room_name}` : ''}</Text>
                </View>
              </View>

              <View style={styles.stayDivider} />

              <View style={styles.dateTimeline}>
                <StayDate icon="log-in-outline" label="Check-in" value={formatDate(booking?.check_in_at)} />
                <View style={styles.timelineConnector}><View style={styles.timelineLine} /></View>
                <StayDate icon="log-out-outline" label="Check-out" value={formatDate(booking?.actual_check_out_at || booking?.expected_check_out_at)} />
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>{todaysFeedings.length ? "Today's Feeding Plan" : 'Feeding Plan'}</Text>
                <Text style={styles.sectionSubtitle}>{todaysFeedings.length ? 'Meals scheduled for today.' : 'Upcoming meals for this stay.'}</Text>
              </View>
              <View style={styles.countPill}><Text style={styles.countText}>{displayFeedings.length}</Text></View>
            </View>

            <View style={styles.feedingCard}>
              {displayFeedings.length === 0 ? (
                <View style={styles.emptyInline}>
                  <Ionicons name="restaurant-outline" size={24} color={colors.primary} />
                  <Text style={styles.emptyInlineText}>No feeding schedule has been added yet.</Text>
                </View>
              ) : (
                displayFeedings.map((feeding, index) => (
                  <View key={feeding.id} style={[styles.feedingRow, index < displayFeedings.length - 1 && styles.rowBorder]}>
                    <View style={styles.feedingTimeWrap}>
                      <Text style={styles.feedingTimeText}>{formatTime(feeding.scheduled_at)}</Text>
                      <Text style={styles.feedingDate}>{formatShortDate(feeding.scheduled_at)}</Text>
                    </View>
                    <View style={styles.feedingInfo}>
                      <Text style={styles.feedingMethod}>{capitalize(feeding.feeding_method || 'automatic')}</Text>
                      <Text style={styles.feedingMeta}>
                        {feeding.portion_grams != null ? `${feeding.portion_grams} g` : 'Portion not set'}
                        {feeding.compartment_number ? ` • Chamber ${feeding.compartment_number}` : ''}
                      </Text>
                      {feeding.instructions ? <Text style={styles.feedingNote} numberOfLines={2}>{feeding.instructions}</Text> : null}
                    </View>
                    <StatusChip status={feeding.status || 'pending'} />
                  </View>
                ))
              )}
            </View>

            <Text style={styles.sectionTitle}>Care Notes</Text>
            <Text style={styles.sectionSubtitle}>Instructions provided for this boarding stay.</Text>
            <View style={styles.notesCard}>
              <NoteRow icon="document-text-outline" label="Special instructions" value={booking?.special_instructions || 'No special instructions'} />
              <View style={styles.rowBorder} />
              <NoteRow icon="nutrition-outline" label="Feeding notes" value={pet?.feeding_notes || 'No feeding notes'} />
            </View>

            <View style={styles.bookingCodeCard}>
              <View style={styles.bookingCodeIcon}><Ionicons name="shield-checkmark" size={19} color={colors.primary} /></View>
              <View style={styles.bookingCodeText}>
                <Text style={styles.bookingCodeLabel}>Booking reference</Text>
                <Text style={styles.bookingCodeValue} numberOfLines={1}>{booking?.booking_code || booking?.id || '—'}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StayDate({ icon, label, value }: any) {
  return (
    <View style={styles.stayDateItem}>
      <View style={styles.stayDateIcon}><Ionicons name={icon} size={16} color={colors.primary} /></View>
      <Text style={styles.stayDateLabel}>{label}</Text>
      <Text style={styles.stayDateValue}>{value}</Text>
    </View>
  );
}

function StatusChip({ status }: { status: string }) {
  const done = status === 'completed';
  const missed = status === 'missed' || status === 'cancelled';
  const color = done ? colors.success : missed ? colors.danger : colors.warning;
  const bg = done ? colors.successSoft : missed ? colors.dangerSoft : colors.warningSoft;
  return (
    <View style={[styles.smallStatus, { backgroundColor: bg }]}>
      <Text style={[styles.smallStatusText, { color }]}>{capitalize(status)}</Text>
    </View>
  );
}

function NoteRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}><Ionicons name={icon} size={18} color={colors.primary} /></View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function getStatusTone(status?: string | null) {
  if (status === 'checked_in') return { label: 'Checked in', color: colors.success, bg: colors.successSoft };
  if (status === 'checked_out') return { label: 'Checked out', color: colors.textSecondary, bg: '#EEF2F1' };
  if (status === 'cancelled') return { label: 'Cancelled', color: colors.danger, bg: colors.dangerSoft };
  return { label: 'Upcoming stay', color: colors.warning, bg: colors.warningSoft };
}
function formatDate(value?: string | null) { if (!value) return '—'; const d = new Date(value); if (Number.isNaN(d.getTime())) return '—'; return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function formatShortDate(value: string) { const d = new Date(value); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function formatTime(value: string) { const d = new Date(value); return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); }
function capitalize(value?: string | null) { if (!value) return ''; return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('_', ' '); }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
