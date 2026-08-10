import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import styles from '../assets/css/FeedingStyles';

export default function FeedingLogsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="#111" />
        </TouchableOpacity>

        <Text style={styles.title}>Feeding Logs</Text>

        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.petCard}>
        <View style={styles.petTopRow}>
          <Image
            source={require('../assets/Login/Logo.jpg')}
            style={styles.petImage}
          />

          <View style={styles.petInfo}>
            <Text style={styles.petName}>Sachi</Text>

            <View style={styles.infoRow}>
              <Text style={styles.info}>🐾 Dog</Text>
              <Text style={styles.infoDot}>●</Text>
              <Text style={styles.info}>Shih-Poo</Text>
              <Text style={styles.infoDot}>●</Text>
              <Text style={styles.info}>Female</Text>
            </View>
          </View>

          <Ionicons
            name="chevron-down"
            size={22}
            color="#111"
          />
        </View>

        <View style={styles.mealsInsideCard}>
          <Text style={styles.mealsTitle}>🍽 Meals Today</Text>

          <View style={styles.mealStatus}>
            <Text style={styles.completed}>✓ Breakfast</Text>
            <Text style={styles.completed}>✓ Lunch</Text>
            <Text style={styles.pending}>⌛ Dinner</Text>
          </View>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.date}>Today, July 19, 2026</Text>

        <Ionicons
          name="calendar-outline"
          size={20}
          color="#111"
        />
      </View>

      <View style={styles.filter}>
        <TouchableOpacity style={styles.filterActive}>
          <Text style={styles.filterActiveText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <Text style={styles.filterText}>Scheduled</Text>
        </TouchableOpacity>
      </View>

      <FoodLog
        color="#C9B47C"
        time="8:00 PM — Dinner"
        status="⌛"
        compact
      />

      <FoodLog
        color="#F49B7D"
        time="3:00 PM — Lunch"
        status="✓"
        items={[
          'Dry Food:    2 scoops (Holistic Adult)',
          'Wet Food:    Aozi Chicken (150 g)',
          'Water:       Refilled',
          'Fed By:      Staff - Bryan',
        ]}
      />

      <FoodLog
        color="#55B8C5"
        time="9:00 AM — Breakfast"
        status="✓"
        items={[
          'Dry Food:    2 scoops (Holistic Adult)',
          'Wet Food:    Aozi Chicken (150 g)',
          'Water:       Refilled',
          'Fed By:      Staff - Bryan',
        ]}
      />
    </SafeAreaView>
  );
}

function FoodLog({
  color,
  time,
  status,
  items,
  compact = false,
}: {
  color: string;
  time: string;
  status: string;
  items?: string[];
  compact?: boolean;
}) {
  return (
    <View style={[styles.log, { backgroundColor: color }]}>
      <View style={styles.logHeader}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {!compact && (
        <>
          {items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.bullet} />
              <Text style={styles.item}>{item}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.photoBtn}>
            <Text style={styles.photoText}>
              View Feeding Photo →
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}