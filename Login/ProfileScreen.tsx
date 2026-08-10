import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles from '../assets/css/ProfileScreenStyles';

export default function ProfileScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        {/* PROFILE */}
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

        {/* INFORMATION TITLE */}
        <Text style={styles.sectionTitle}>
          Information
        </Text>

        {/* MENU */}
        <View style={styles.menuCard}>

          <MenuItem
            icon="create-outline"
            title="Edit Profile"
            onPress={() =>
              navigation.navigate('EditProfile')
            }
          />

          <MenuItem
            icon="paw"
            title="Pets"
            onPress={() =>
              navigation.navigate('Pets')
            }
          />

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
                false: '#CCCCCC',
                true: '#A9D9DA',
              }}
              thumbColor={
                notifications
                  ? '#16444A'
                  : '#FFFFFF'
              }
            />
          </View>

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