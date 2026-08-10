import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../lib/supabase';

import styles from '../assets/css/ProfileScreenStyles';

export default function ProfileScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const logoutUser = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        if (Platform.OS === 'web') {
          window.alert(`Logout Failed: ${error.message}`);
        } else {
          Alert.alert(
            'Logout Failed',
            error.message
          );
        }
      }

      /*
        No navigation needed here.

        App.tsx detects that the Supabase
        session is now null and automatically
        switches to WelcomeScreen/Login.
      */
    } catch (error) {
      if (Platform.OS === 'web') {
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
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to log out?'
      );

      if (confirmed) {
        logoutUser();
      }

      return;
    }

    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: logoutUser,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        {/* PROFILE INFORMATION */}
        <View style={styles.profileRow}>
          <Image
            source={require('../assets/Login/Logo.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              Beia Ann
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailValue}>
                  Female
                </Text>

                <Text style={styles.detailLabel}>
                  Sex
                </Text>
              </View>

              <View style={styles.detailBlock}>
                <Text style={styles.detailValue}>
                  23
                </Text>

                <Text style={styles.detailLabel}>
                  Age
                </Text>
              </View>

              <View style={styles.detailBlock}>
                <Text style={styles.detailValue}>
                  04/18/2005
                </Text>

                <Text style={styles.detailLabel}>
                  Birthday
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.sectionTitle}>
          Information
        </Text>

        {/* MENU CARD */}
        <View style={styles.menuCard}>

          {/* EDIT PROFILE */}
          <MenuItem
            icon="create-outline"
            title="Edit Profile"
            onPress={() =>
              navigation.navigate('EditProfile')
            }
          />

          {/* PETS */}
          <MenuItem
            icon="paw"
            title="Pets"
            onPress={() =>
              navigation.navigate('Pets')
            }
          />

          {/* BOARDING HISTORY */}
          <MenuItem
            icon="calendar-outline"
            title="Boarding History"
            onPress={() =>
              navigation.navigate('BookingHistory')
            }
          />

          {/* NOTIFICATION */}
          <View style={styles.notificationRow}>
            <View style={styles.menuLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#16444A"
              />

              <Text style={styles.notificationText}>
                Notification
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
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

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutRow}
            activeOpacity={0.7}
            disabled={loggingOut}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color="#D06435"
              />

              <Text style={styles.logoutText}>
                {loggingOut
                  ? 'Logging Out...'
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
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon}
          size={24}
          color="#16444A"
        />

        <Text style={styles.menuText}>
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