import React, { useCallback, useState } from 'react';
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
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/PetsStyles';

type Pet = {
  id?: string | null;
  name?: string | null;
  species?: string | null;
  breed?: string | null;
  sex?: 'male' | 'female' | 'unknown' | null;
  birth_date?: string | null;
  weight_kg?: number | string | null;
  allergies?: string | null;
  medical_notes?: string | null;
  feeding_notes?: string | null;
  photo_url?: string | null;
};

type Booking = {
  id?: string | null;
  status?: string | null;
  check_in_at?: string | null;
  expected_check_out_at?: string | null;
  actual_check_out_at?: string | null;
};

export default function Pets({ navigation, route }: any) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const params = route?.params ?? {};
  const accessCode = params.accessCode ?? '';

  const [pet, setPet] = useState<Pet | null>(params.pet ?? null);
  const [booking, setBooking] = useState<Booking | null>(params.booking ?? null);
  const [loading, setLoading] = useState(!params.pet);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPet = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      if (!accessCode) {
        if (!pet) setError('No active boarding pet was found.');
        return;
      }

      const { data, error: functionError } = await supabase.functions.invoke(
        'verify-booking-code',
        { body: { code: accessCode } }
      );

      if (functionError) throw functionError;
      if (!data || data.error) throw new Error(data?.error || 'Unable to load boarding data.');
      if (!data.pet) throw new Error('No pet is connected to this boarding stay.');

      setPet(data.pet);
      setBooking(data.booking ?? null);
    } catch (err: any) {
      console.error('Pets load error:', err);
      setError(err?.message || 'Unable to load your pet.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessCode]);

  useFocusEffect(
    useCallback(() => {
      loadPet();
    }, [loadPet])
  );

  if (!fontsLoaded) return null;

  const petImage = pet?.photo_url?.trim()
    ? { uri: pet.photo_url }
    : require('../assets/Login/DogProfile.jpg');

  const weight =
    pet?.weight_kg === null || pet?.weight_kg === undefined || pet?.weight_kg === ''
      ? 'Weight not set'
      : `${pet.weight_kg} kg`;

  const status = getStatus(booking?.status);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Pets</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadPet(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <Text style={styles.sectionTitle}>Your Pet</Text>
        <Text style={styles.sectionSubtitle}>View your pet and current boarding status</Text>

        {loading && !pet ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading your pet...</Text>
          </View>
        ) : null}

        {!loading && error && !pet ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="paw-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No pet found</Text>
            <Text style={styles.emptyDescription}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadPet()}>
              <Ionicons name="refresh" size={17} color="#FFF" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {pet ? (
          <TouchableOpacity
            style={styles.petCard}
            activeOpacity={0.84}
            onPress={() =>
              navigation.navigate('PetProfile', {
                pet,
                booking,
                accessCode,
              })
            }
          >
            <Image source={petImage} style={styles.petImage} resizeMode="cover" />

            <View style={styles.petDetails}>
              <View style={styles.petTopRow}>
                <Text style={styles.petName} numberOfLines={1}>{pet.name || 'Pet'}</Text>
                <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
              </View>

              <View style={styles.petInfoRow}>
                <View style={styles.infoItem}>
                  <Ionicons
                    name={pet.sex === 'female' ? 'female' : pet.sex === 'male' ? 'male' : 'help-circle-outline'}
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {pet.sex === 'female' ? 'Female' : pet.sex === 'male' ? 'Male' : 'Unknown'}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Ionicons name="scale-outline" size={18} color={colors.primary} />
                  <Text style={styles.infoText}>{weight}</Text>
                </View>
              </View>

              {(pet.breed || pet.species) ? (
                <View style={styles.breedRow}>
                  <Ionicons name="paw-outline" size={15} color={colors.textMuted} />
                  <Text style={styles.breedText} numberOfLines={1}>{pet.breed || pet.species}</Text>
                </View>
              ) : null}

              <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
                <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
                <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
              </View>

              {booking?.check_in_at ? (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>{formatDate(booking.check_in_at)}</Text>
                </View>
              ) : null}

              <View style={styles.profileLinkRow}>
                <Text style={styles.profileLinkText}>View Pet Profile</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatus(status?: string | null) {
  switch (status) {
    case 'checked_in':
      return { text: 'Currently checked in', color: colors.success, background: colors.successSoft, dot: '#41AE5D' };
    case 'pending':
      return { text: 'Upcoming stay', color: colors.warning, background: colors.warningSoft, dot: '#E7A72E' };
    case 'checked_out':
      return { text: 'Checked out', color: '#607477', background: '#EDF2F2', dot: '#829496' };
    case 'cancelled':
      return { text: 'Cancelled', color: colors.danger, background: colors.dangerSoft, dot: '#D45C5C' };
    default:
      return { text: 'Boarding active', color: colors.success, background: colors.successSoft, dot: '#41AE5D' };
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
