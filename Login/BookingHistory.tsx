import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/BookingHistoryStyles';

type BookingItem = {
  id: string;
  booking_code?: string | null;
  check_in_at?: string | null;
  expected_check_out_at?: string | null;
  actual_check_out_at?: string | null;
  status?: string | null;
  pet?: { id?: string; name?: string | null; breed?: string | null } | null;
  room?: { id?: string; room_number?: string | null; room_name?: string | null } | null;
};

export default function BookingHistory({ navigation, route }: any) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;

      if (!user) {
        // Guest access has only the currently verified booking available.
        const currentBooking = route?.params?.booking;
        if (currentBooking) {
          setBookings([{
            ...currentBooking,
            pet: route?.params?.pet ?? null,
            room: route?.params?.room ?? null,
          }]);
        } else {
          setBookings([]);
        }
        return;
      }

      const { data: accessRows, error: accessError } = await supabase
        .from('booking_access')
        .select('booking_id')
        .eq('owner_id', user.id)
        .is('revoked_at', null);

      if (accessError) throw accessError;
      const bookingIds = [...new Set((accessRows ?? []).map((row: any) => row.booking_id).filter(Boolean))];

      if (!bookingIds.length) {
        const currentBooking = route?.params?.booking;
        setBookings(currentBooking ? [{ ...currentBooking, pet: route?.params?.pet ?? null, room: route?.params?.room ?? null }] : []);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_code,
          check_in_at,
          expected_check_out_at,
          actual_check_out_at,
          status,
          pet:pets(id,name,breed),
          room:rooms(id,room_number,room_name)
        `)
        .in('id', bookingIds)
        .order('check_in_at', { ascending: false });

      if (error) throw error;
      setBookings((data ?? []) as unknown as BookingItem[]);
    } catch (err: any) {
      console.error('Boarding history fetch error:', err);
      setError(err?.message || 'Unable to load boarding history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [route?.params]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Boarding History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadHistory(true)} tintColor={colors.primary} />}
      >
        <Text style={styles.pageHeading}>Your Stays</Text>
        <Text style={styles.pageSubheading}>Current and previous boarding records linked to your owner account.</Text>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading boarding history...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.warning} />
            <Text style={styles.emptyTitle}>Could not load history</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadHistory()}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={30} color={colors.primary} />
            <Text style={styles.emptyTitle}>No boarding history yet</Text>
            <Text style={styles.emptyText}>Your linked boarding stays will appear here.</Text>
          </View>
        ) : (
          bookings.map((booking) => <HistoryCard key={booking.id} booking={booking} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryCard({ booking }: { booking: BookingItem }) {
  const status = getStatus(booking.status);
  const roomText = booking.room?.room_number
    ? `Room ${booking.room.room_number}`
    : booking.room?.room_name || 'Room not assigned';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.petIcon}>
          <Ionicons name="paw" size={20} color={colors.primary} />
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.petName}>{booking.pet?.name || 'Pet'}</Text>
          <Text style={styles.bookingCode}>{booking.booking_code || 'Boarding stay'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />
      <HistoryRow icon="bed-outline" label="Room" value={roomText} />
      <HistoryRow icon="log-in-outline" label="Check-in" value={formatDateTime(booking.check_in_at)} />
      <HistoryRow icon="log-out-outline" label="Check-out" value={formatDateTime(booking.actual_check_out_at || booking.expected_check_out_at)} />
    </View>
  );
}

function HistoryRow({ icon, label, value }: any) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Not provided';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function getStatus(status?: string | null) {
  switch (status) {
    case 'checked_in': return { text: 'Checked in', color: colors.success, background: colors.successSoft };
    case 'checked_out': return { text: 'Completed', color: '#607477', background: '#EDF2F2' };
    case 'cancelled': return { text: 'Cancelled', color: colors.danger, background: colors.dangerSoft };
    default: return { text: 'Upcoming', color: colors.warning, background: colors.warningSoft };
  }
}
