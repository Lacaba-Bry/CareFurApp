import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../lib/supabase';

import styles from '../assets/css/ProfileScreenStyles';

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

type UserProfile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AccessData = {
  id?: string | null;
  ownerId?: string | null;
  invitedEmail?: string | null;
  expiresAt?: string | null;
  redeemedAt?: string | null;
};

export default function ProfileScreen({
  navigation,
  route,
}: any) {
  const routeParams =
    route?.params ?? {};

  const access: AccessData | null =
    routeParams.access ?? null;

  const passedOwnerEmail =
    routeParams.ownerEmail ??
    routeParams.invitedEmail ??
    access?.invitedEmail ??
    null;

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [authEmail, setAuthEmail] =
    useState<string | null>(null);

  const [authName, setAuthName] =
    useState<string | null>(null);

  const [isGuest, setIsGuest] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: sessionData,
          error: sessionError,
        } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            'Profile session error:',
            sessionError
          );
        }

        const session =
          sessionData.session;

        // =====================================================
        // GUEST
        // =====================================================

        if (!session?.user) {
          setIsGuest(true);
          setProfile(null);
          return;
        }

        setIsGuest(false);

        setAuthEmail(
          session.user.email ??
          null
        );

        setAuthName(
          session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          null
        );

        // =====================================================
        // FETCH PUBLIC.USERS PROFILE
        // =====================================================

        const {
          data,
          error,
        } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            email,
            phone,
            avatar_url,
            role,
            created_at,
            updated_at
          `)
          .eq(
            'id',
            session.user.id
          )
          .maybeSingle();

        if (error) {
          console.error(
            'Profile fetch error:',
            error
          );

          setError(
            error.message ||
            'Unable to load your profile.'
          );

          return;
        }

        if (!data) {
          console.log(
            'No public.users profile found. Using Auth fallback.'
          );

          setProfile(null);

          setError(null);

          return;
        }

        setProfile(data);
      } catch (err: any) {
        console.error(
          'Profile load error:',
          err
        );

        setError(
          err?.message ||
          'Unable to load profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const displayName =
    useMemo(() => {
      if (isGuest) {
        return (
          getDisplayNameFromEmail(
            passedOwnerEmail
          ) || 'Guest'
        );
      }

      return (
        profile?.full_name ||
        authName ||
        getDisplayNameFromEmail(
          profile?.email ||
          authEmail
        ) ||
        'Pet Owner'
      );
    }, [
      isGuest,
      profile,
      authName,
      authEmail,
      passedOwnerEmail,
    ]);

  const displayEmail =
    isGuest
      ? passedOwnerEmail ||
        'Guest access'
      : profile?.email ||
        authEmail ||
        '';

  const profileImageSource =
    profile?.avatar_url
      ? {
          uri:
            profile.avatar_url,
        }
      : require(
          '../assets/Login/Logo.jpg'
        );

  // ============================================================
  // LOGOUT
  // ============================================================

  const logoutUser = async () => {
    try {
      setLoggingOut(true);

      await AsyncStorage.removeItem(
        BOARDING_CODE_STORAGE_KEY
      );

      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      if (
        sessionData.session
      ) {
        const {
          error,
        } =
          await supabase.auth.signOut();

        if (error) {
          if (
            Platform.OS ===
            'web'
          ) {
            window.alert(
              `Logout Failed: ${error.message}`
            );
          } else {
            Alert.alert(
              'Logout Failed',
              error.message
            );
          }

          return;
        }
      }

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Welcome',
          },
        ],
      });
    } catch (err) {
      console.error(
        'Logout error:',
        err
      );

      if (
        Platform.OS === 'web'
      ) {
        window.alert(
          'Something went wrong while logging out.'
        );
      } else {
        Alert.alert(
          'Error',
          'Something went wrong while logging out.'
        );
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    const actionText =
      isGuest
        ? 'Exit Guest Mode'
        : 'Log Out';

    const message =
      isGuest
        ? 'Are you sure you want to leave guest access?'
        : 'Are you sure you want to log out?';

    if (
      Platform.OS ===
      'web'
    ) {
      const confirmed =
        window.confirm(
          message
        );

      if (confirmed) {
        logoutUser();
      }

      return;
    }

    Alert.alert(
      actionText,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: actionText,
          style: 'destructive',
          onPress: logoutUser,
        },
      ]
    );
  };

  const requireAccount = (
    action:
      () => void
  ) => {
    if (!isGuest) {
      action();
      return;
    }

    const message =
      'This feature is available for registered owner accounts. Please sign up or log in to use it.';

    if (
      Platform.OS ===
      'web'
    ) {
      window.alert(
        message
      );
    } else {
      Alert.alert(
        'Owner Account Required',
        message
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems:
              'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#16444A"
          />

          <Text
            style={{
              marginTop: 10,
              color: '#16444A',
            }}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View
        style={styles.content}
      >
        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        {/* PROFILE INFORMATION */}

        <View
          style={styles.profileRow}
        >
          <Image
            source={
              profileImageSource
            }
            style={
              styles.profileImage
            }
            resizeMode="cover"
          />

          <View
            style={
              styles.profileInfo
            }
          >
            <Text
              style={styles.name}
            >
              {displayName}
            </Text>

            <Text
              style={{
                marginTop: 4,
                color: '#687879',
                fontSize: 12,
              }}
            >
              {displayEmail}
            </Text>

            {isGuest ? (
              <Text
                style={{
                  marginTop: 4,
                  color: '#D06435',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                Guest Access
              </Text>
            ) : null}
          </View>
        </View>

        {/* ERROR */}

        {error ? (
          <Text
            style={{
              color: '#D06435',
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* TITLE */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Information
        </Text>

        {/* MENU CARD */}

        <View
          style={styles.menuCard}
        >
          <MenuItem
            icon="create-outline"
            title={
              isGuest
                ? 'Create / Login Account'
                : 'Edit Profile'
            }
            onPress={() => {
              if (isGuest) {
                navigation.navigate(
                  'Welcome'
                );

                return;
              }

              navigation.navigate(
                'EditProfile'
              );
            }}
          />

          <MenuItem
            icon="paw"
            title="Pets"
            onPress={() =>
              navigation.navigate(
                'Pets',
                {
                  pet:
                    routeParams.pet ??
                    null,

                  booking:
                    routeParams.booking ??
                    null,
                }
              )
            }
          />

          <MenuItem
            icon="calendar-outline"
            title="Boarding History"
            onPress={() =>
              requireAccount(
                () =>
                  navigation.navigate(
                    'BookingHistory'
                  )
              )
            }
          />

          <View
            style={
              styles.notificationRow
            }
          >
            <View
              style={styles.menuLeft}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#16444A"
              />

              <Text
                style={
                  styles.notificationText
                }
              >
                Notification
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={
                setNotifications
              }
              trackColor={{
                false: '#C8CECD',
                true: '#9DD5D7',
              }}
              thumbColor={
                notifications
                  ? '#16444A'
                  : '#FFFFFF'
              }
            />
          </View>

          <TouchableOpacity
            style={
              styles.logoutRow
            }
            activeOpacity={0.7}
            disabled={loggingOut}
            onPress={handleLogout}
          >
            <View
              style={styles.menuLeft}
            >
              <Ionicons
                name={
                  isGuest
                    ? 'exit-outline'
                    : 'log-out-outline'
                }
                size={24}
                color="#D06435"
              />

              <Text
                style={
                  styles.logoutText
                }
              >
                {loggingOut
                  ? isGuest
                    ? 'Exiting...'
                    : 'Logging Out...'
                  : isGuest
                  ? 'Exit Guest Mode'
                  : 'Log Out'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#D06435"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >['name'];

  title: string;

  onPress?:
    () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={styles.menuLeft}
      >
        <Ionicons
          name={icon}
          size={24}
          color="#16444A"
        />

        <Text
          style={
            styles.menuText
          }
        >
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="#111"
      />
    </TouchableOpacity>
  );
}

function getDisplayNameFromEmail(
  email?:
    string |
    null
) {
  if (!email) {
    return '';
  }

  const localPart =
    email
      .split('@')[0]
      .replace(
        /[._-]+/g,
        ' '
      )
      .trim();

  if (!localPart) {
    return '';
  }

  return localPart
    .split(' ')
    .filter(Boolean)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1)
    )
    .join(' ');
}