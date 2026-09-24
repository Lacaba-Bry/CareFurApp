import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/RoomsStyles';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';

type RoomData = {
  id: string;
  room_number?: string | null;
  room_name?: string | null;
  capacity?: number | null;
  status?: string | null;
  occupied?: boolean;
  available?: boolean;
};

export default function Rooms({ navigation }: any) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWing, setSelectedWing] = useState<'A' | 'B'>('A');

  const loadRooms = useCallback(async () => {
    try {
      setError(null);
      const code = await AsyncStorage.getItem(BOARDING_CODE_STORAGE_KEY);
      if (!code) throw new Error('No active boarding access code was found.');

      const { data, error: functionError } = await supabase.functions.invoke('get-room-availability', {
        body: { code, date: getDateKey(selectedDate) },
      });

      if (functionError) throw new Error(functionError.message || 'Unable to load room availability.');
      if (data?.error) throw new Error(data.error);
      setRooms(data?.rooms ?? []);
    } catch (err: any) {
      console.error('Rooms load error:', err);
      setError(err?.message || 'Unable to load room availability.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    loadRooms();
  }, [loadRooms]);

  const availableCount = useMemo(
    () => rooms.filter((room) => room.available === true || (!room.occupied && room.status === 'active')).length,
    [rooms]
  );
  const occupiedCount = useMemo(() => rooms.filter((room) => room.occupied).length, [rooms]);
  const week = useMemo(() => getWeek(selectedDate), [selectedDate]);
  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => naturalRoomSort(a.room_number || '', b.room_number || '')),
    [rooms]
  );

  const midpoint = Math.ceil(sortedRooms.length / 2);
  const wingA = sortedRooms.slice(0, midpoint);
  const wingB = sortedRooms.slice(midpoint);
  const visibleWing = selectedWing === 'A' ? wingA : wingB;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color={colors.primaryDark} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Slot Availability</Text>
          <Text style={styles.headerSubtitle}>Room layout and availability</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadRooms(); }} tintColor={colors.primary} />}
      >
        <View style={styles.dateCard}>
          <TouchableOpacity
            style={[styles.dateArrow, isToday(selectedDate) && styles.dateArrowDisabled]}
            disabled={isToday(selectedDate)}
            onPress={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <Ionicons name="chevron-back" size={18} color={isToday(selectedDate) ? colors.disabled : colors.primary} />
          </TouchableOpacity>
          <View style={styles.dateCenter}>
            <Text style={styles.datePrimary}>{formatLongDate(selectedDate)}</Text>
            <Text style={styles.dateSecondary}>{isToday(selectedDate) ? 'Today' : formatWeekDay(selectedDate)}</Text>
          </View>
          <TouchableOpacity style={styles.dateArrow} onPress={() => setSelectedDate(addDays(selectedDate, 1))}>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {week.map((date) => {
            const active = isSameDay(date, selectedDate);
            const disabled = isPastDate(date);
            return (
              <TouchableOpacity
                key={date.toISOString()}
                disabled={disabled}
                style={[styles.dayPill, active && styles.dayPillActive, disabled && styles.dayPillDisabled]}
                onPress={() => setSelectedDate(startOfDay(date))}
              >
                <Text style={[styles.dayName, active && styles.dayNameActive]}>{formatDayShort(date)}</Text>
                <Text style={[styles.dayNumber, active && styles.dayNumberActive]}>{date.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryStrip}>
          <Summary icon="checkmark-circle" label="Available" value={availableCount} color={colors.success} />
          <View style={styles.summaryDivider} />
          <Summary icon="paw" label="Occupied" value={occupiedCount} color={colors.warning} />
          <View style={styles.summaryDivider} />
          <Summary icon="grid" label="Rooms" value={rooms.length} color={colors.primary} />
        </View>

        <View style={styles.mapHeader}>
          <Text style={styles.sectionTitle}>Room map</Text>
          <Text style={styles.sectionSubtitle}>Switch between both sides of the boarding area. Room numbers stay short and easy to scan.</Text>
          <View style={styles.legendInline}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Available</Text>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
        </View>

        <View style={styles.wingSwitcher}>
          <TouchableOpacity style={[styles.wingSwitchButton, selectedWing === 'A' && styles.wingSwitchButtonActive]} onPress={() => setSelectedWing('A')}>
            <Text style={[styles.wingSwitchText, selectedWing === 'A' && styles.wingSwitchTextActive]}>Side A</Text>
            <Text style={[styles.wingSwitchCount, selectedWing === 'A' && styles.wingSwitchTextActive]}>{wingA.length} rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.wingSwitchButton, selectedWing === 'B' && styles.wingSwitchButtonActive]} onPress={() => setSelectedWing('B')}>
            <Text style={[styles.wingSwitchText, selectedWing === 'B' && styles.wingSwitchTextActive]}>Side B</Text>
            <Text style={[styles.wingSwitchCount, selectedWing === 'B' && styles.wingSwitchTextActive]}>{wingB.length} rooms</Text>
          </TouchableOpacity>
        </View>

        {error ? <View style={styles.noticeCard}><Ionicons name="alert-circle-outline" size={18} color={colors.warning} /><Text style={styles.noticeText}>{error}</Text></View> : null}

        {loading ? (
          <View style={styles.centerState}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.stateText}>Loading rooms...</Text></View>
        ) : sortedRooms.length === 0 ? (
          <View style={styles.emptyCard}><Ionicons name="home-outline" size={36} color={colors.primary} /><Text style={styles.emptyTitle}>No room data</Text><Text style={styles.emptyText}>There is no availability information for this day.</Text></View>
        ) : (
          <View style={styles.floorPlan}>
            <View style={styles.floorTopBar}>
              <Text style={styles.floorSideTitle}>{selectedWing === 'A' ? 'SIDE A' : 'SIDE B'}</Text>
              <View style={styles.floorStatusPill}><Ionicons name="map-outline" size={14} color={colors.primary} /><Text style={styles.floorStatusText}>Boarding floor</Text></View>
            </View>

            <View style={styles.wingGrid}>
              {visibleWing.length > 0
                ? visibleWing.map((room) => <RoomTile key={room.id} room={room} />)
                : <View style={styles.emptyWing}><Text style={styles.emptyWingText}>No rooms assigned to this side yet.</Text></View>}
            </View>

            <View style={styles.centerAisle}>
              <View style={styles.centerAisleIcon}><Ionicons name="paw" size={18} color={colors.primary} /></View>
              <View><Text style={styles.centerAisleText}>PLAYING AREA</Text><Text style={styles.centerAisleSubtext}>Shared activity space</Text></View>
            </View>

            <View style={styles.floorLegendRow}>
              <Ionicons name="paw" size={14} color={colors.warning} />
              <Text style={styles.floorLegendText}>Paw = occupied room</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavButton icon="home-outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} />
        <NavButton icon="paw-outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Pets' })} />
        <NavButton icon="camera-outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Camera' })} />
        <NavButton icon="nutrition-outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Care' })} />
        <NavButton icon="person-outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })} />
      </View>
    </SafeAreaView>
  );
}

function NavButton({ icon, onPress }: any) {
  return <TouchableOpacity style={styles.navButton} onPress={onPress}><Ionicons name={icon} size={22} color={colors.textMuted} /></TouchableOpacity>;
}

function RoomTile({ room }: { room: RoomData }) {
  const active = room.status === 'active';
  const available = room.available === true || (!room.occupied && active);
  const statusColor = !active ? colors.textMuted : available ? colors.success : colors.warning;
  const statusBg = !active ? '#F2F4F3' : available ? colors.successSoft : colors.warningSoft;
  const roomLabel = shortRoomLabel(room.room_number || 'Room');
  const displayName = cleanRoomName(room.room_name, room.room_number);

  return (
    <View style={[styles.roomTile, { borderColor: statusColor }]}>
      <View style={[styles.roomTileStatus, { backgroundColor: statusBg }]}>
        {room.occupied ? <Ionicons name="paw" size={12} color={statusColor} style={{ marginRight: 5 }} /> : <View style={[styles.statusDot, { backgroundColor: statusColor }]} />}
        <Text style={[styles.statusText, { color: statusColor }]}>{!active ? 'Unavailable' : available ? 'Available' : 'Occupied'}</Text>
      </View>
      <View style={styles.roomTileBody}>
        <View style={styles.roomIconWrap}><Ionicons name="bed-outline" size={18} color={colors.primary} /></View>
        <Text style={styles.roomNumber}>{roomLabel}</Text>
        {displayName ? <Text style={styles.roomName} numberOfLines={1}>{displayName}</Text> : null}
        <Text style={styles.capacityText}>{room.capacity || 1} pet{(room.capacity || 1) > 1 ? 's' : ''}</Text>
      </View>
    </View>
  );
}

function Summary({ icon, label, value, color }: any) {
  return <View style={styles.summaryItem}><Ionicons name={icon} size={17} color={color} /><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function shortRoomLabel(value: string) {
  return value.replace(/^ROOM\s*/i, '').replace(/^R[-\s]?/i, 'R-').toUpperCase();
}
function cleanRoomName(name?: string | null, roomNumber?: string | null) {
  if (!name) return '';
  const normalized = name.trim();
  if (!normalized) return '';
  if (roomNumber && normalized.toLowerCase().includes(roomNumber.toLowerCase())) return '';
  if (/^standard room\s*\d*$/i.test(normalized)) return '';
  return normalized;
}
function naturalRoomSort(a: string, b: string) { return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }); }
function startOfDay(date: Date) { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; }
function addDays(date: Date, count: number) { const d = new Date(date); d.setDate(d.getDate() + count); return startOfDay(d); }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isToday(date: Date) { return isSameDay(date, startOfDay(new Date())); }
function isPastDate(date: Date) { return startOfDay(date).getTime() < startOfDay(new Date()).getTime(); }
function getWeek(date: Date) { const day = date.getDay(); const mondayOffset = day === 0 ? -6 : 1 - day; const monday = addDays(date, mondayOffset); return Array.from({ length: 7 }, (_, i) => addDays(monday, i)); }
function getDateKey(date: Date) { const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0'); return `${y}-${m}-${d}`; }
function formatLongDate(date: Date) { return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
function formatWeekDay(date: Date) { return date.toLocaleDateString('en-US', { weekday: 'long' }); }
function formatDayShort(date: Date) { return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1); }
