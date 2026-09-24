import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/ProfileScreenStyles';

const BOARDING_CODE_STORAGE_KEY = 'boarding_access_code';
const NOTIFICATIONS_STORAGE_KEY = 'carefur_notifications_enabled';

type OwnerProfile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  avatar_url?: string | null;
};

export default function ProfileScreen({ navigation, route }: any) {
  const params = route?.params ?? {};
  const passedOwnerEmail =
    params.ownerEmail ?? params.invitedEmail ?? params.access?.invitedEmail ?? null;

  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authName, setAuthName] = useState<string | null>(null);
  const [authAvatar, setAuthAvatar] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const savedNotificationSetting = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (savedNotificationSetting !== null) {
        setNotifications(savedNotificationSetting === 'true');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData.session?.user;
      if (!user) {
        setIsGuest(true);
        setProfile(null);
        return;
      }

      setIsGuest(false);
      setAuthEmail(user.email ?? null);
      setAuthName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? null);
      setAuthAvatar(user.user_metadata?.avatar_url ?? null);

      // Owner accounts are created in public.owners by SignupScreen.
      const { data: ownerData, error: ownerError } = await supabase
        .from('owners')
        .select('id,full_name,email,phone,notes')
        .eq('id', user.id)
        .maybeSingle();

      if (ownerError) throw ownerError;

      if (ownerData) {
        setProfile(ownerData);
        return;
      }

      // Compatibility fallback for older accounts that may only exist in public.users.
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id,full_name,email,phone,avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) console.warn('users fallback profile warning:', userError);
      setProfile(userData ?? null);
    } catch (err: any) {
      console.error('Profile load error:', err);
      setError(err?.message || 'Unable to load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const displayName = useMemo(() => {
    if (isGuest) return getDisplayNameFromEmail(passedOwnerEmail) || 'Guest';
    return profile?.full_name || authName || getDisplayNameFromEmail(profile?.email || authEmail) || 'Pet Owner';
  }, [isGuest, passedOwnerEmail, profile, authName, authEmail]);

  const displayEmail = isGuest
    ? passedOwnerEmail || 'Guest access'
    : profile?.email || authEmail || '';

  const profileImageSource = authAvatar
    ? { uri: authAvatar }
    : profile?.avatar_url
      ? { uri: profile.avatar_url }
      : require('../assets/Login/Logo.jpg');

  const toggleNotifications = async (value: boolean) => {
    setNotifications(value);
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, String(value));
  };

  const logoutUser = async () => {
    try {
      setLoggingOut(true);
      await AsyncStorage.removeItem(BOARDING_CODE_STORAGE_KEY);
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (err: any) {
      showAlert('Logout failed', err?.message || 'Something went wrong while logging out.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    const actionText = isGuest ? 'Exit Guest Mode' : 'Log Out';
    const message = isGuest ? 'Are you sure you want to leave guest access?' : 'Are you sure you want to log out?';

    if (Platform.OS === 'web') {
      if (window.confirm(message)) logoutUser();
      return;
    }

    Alert.alert(actionText, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: actionText, style: 'destructive', onPress: logoutUser },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your CareFur owner account</Text>
        </View>

        <View style={styles.profileCard}>
          <Image source={profileImageSource} style={styles.profileImage} resizeMode="cover" />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
            {profile?.phone ? (
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={13} color={colors.textSecondary} />
                <Text style={styles.phoneText}>{profile.phone}</Text>
              </View>
            ) : null}
            <View style={[styles.accountBadge, isGuest && styles.guestBadge]}>
              <Text style={[styles.accountBadgeText, isGuest && styles.guestBadgeText]}>
                {isGuest ? 'Guest Access' : 'Owner Account'}
              </Text>
            </View>
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="create-outline"
            title={isGuest ? 'Create / Login Account' : 'Edit Profile'}
            subtitle={isGuest ? 'Use a registered owner account' : 'Name, phone and owner notes'}
            onPress={() => navigation.navigate(isGuest ? 'Welcome' : 'EditProfile')}
          />
          <MenuDivider />
          <MenuItem
            icon="paw-outline"
            title="Pet Profile"
            subtitle="View the pet connected to this stay"
            onPress={() => navigation.navigate('Pets')}
          />
          <MenuDivider />
          <MenuItem
            icon="calendar-outline"
            title="Boarding History"
            subtitle="View previous and current stays"
            onPress={() => navigation.navigate('BookingHistory', { ...params })}
          />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuCard}>
          <View style={styles.notificationRow}>
            <View style={styles.menuIconWrap}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuSubtitle}>Remember this preference on this device</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.disabled, true: colors.primaryMuted }}
              thumbColor={notifications ? colors.primary : '#FFFFFF'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} disabled={loggingOut} onPress={handleLogout}>
          <Ionicons name={isGuest ? 'exit-outline' : 'log-out-outline'} size={20} color={colors.danger} />
          <Text style={styles.logoutText}>
            {loggingOut ? (isGuest ? 'Exiting...' : 'Logging out...') : (isGuest ? 'Exit Guest Mode' : 'Log Out')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuRow} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.menuIconWrap}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text style={styles.menuText}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function MenuDivider() {
  return <View style={styles.menuDivider} />;
}

function getDisplayNameFromEmail(email?: string | null) {
  if (!email) return '';
  const localPart = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return localPart.split(' ').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}: ${message}`);
  else Alert.alert(title, message);
}
