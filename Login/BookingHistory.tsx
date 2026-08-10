import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import styles from '../assets/css/BookingHistoryStyles';

export default function BookingHistory({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#16444A"
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Boarding</Text>
          <Text style={styles.title}>History</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HistoryCard
          name="Bear"
          color="#2B6D73"
          room="Room 01"
          checkIn="01/01/01"
          time="03:03 PM"
          checkOut="02/02/02"
        />

        <HistoryCard
          name="Nikki"
          color="#D06435"
          room="Room 02"
          checkIn="01/01/01"
          time="03:03 PM"
          checkOut="02/02/02"
        />

        <HistoryCard
          name="Sarah"
          color="#B4A276"
          room="Room 03"
          checkIn="01/01/01"
          time="03:03 PM"
          checkOut="02/02/02"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryCard({
  name,
  color,
  room,
  checkIn,
  time,
  checkOut,
}: {
  name: string;
  color: string;
  room: string;
  checkIn: string;
  time: string;
  checkOut: string;
}) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.cardHeader,
          { backgroundColor: color },
        ]}
      >
        <Text style={styles.petName}>
          {name}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <HistoryRow
          label="Room:"
          value={room}
        />

        <HistoryRow
          label="Checked in date:"
          value={checkIn}
        />

        <HistoryRow
          label="Time:"
          value={time}
        />

        <HistoryRow
          label="Checked out Date:"
          value={checkOut}
        />
      </View>
    </View>
  );
}

function HistoryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}