import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';
import styles from '../assets/css/HomeScreenStyles';

/** The regular Home dashboard layout, with boarding-only content safely locked.
 * No protected booking/feeding/camera requests are made in this mode.
 */
export default function NoBoardingHome({ navigation }: any) {
  const [name, setName] = useState('Pet Owner');
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setName(String(data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Pet Owner'));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const enterCode = () => navigation.getParent()?.navigate('Code');
  const dashboardCard = (title: string, icon: any, color: string, onPress: () => void, locked = false) => (
    <TouchableOpacity key={title} accessibilityRole="button" onPress={onPress} activeOpacity={0.85}
      style={[styles.card, { backgroundColor: color, overflow: 'hidden' }]}>
      <Ionicons name={icon} size={23} color="#fff" />
      <Text style={styles.cardText}>{title}</Text>
      {locked && <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(241,245,245,0.79)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 9 }}>
          <Ionicons name="lock-closed" size={22} color={colors.primaryDark} />
        </View>
        <Text style={{ color: colors.primaryDark, fontWeight: '800', fontSize: 12, marginTop: 5 }}>Locked</Text>
      </View>}
    </TouchableOpacity>
  );

  return <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, <Text style={styles.greetingName}>{name}!</Text></Text>
          <Text style={styles.subtitle}>Check on your pet and see how they're doing</Text>
        </View>
        <View style={styles.grid}>
          {dashboardCard("Pet's Profile", 'paw', '#D06435', () => navigation.navigate('Pets'))}
          {dashboardCard('Slot Availability', 'calendar', '#14646B', () => navigation.getParent()?.navigate('PublicRooms'))}
          {dashboardCard('Message Stay', 'chatbox', '#16444A', () => navigation.getParent()?.navigate('GeneralInquiry'))}
          {dashboardCard('Boarding Details', 'bed', '#B4A276', enterCode, true)}
        </View>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.smallTitle}>Latest Update</Text>
          <Text style={styles.smallTitle}>Meals Today: —</Text>
        </View>
        <View style={[styles.updateRow, { minHeight: 150, marginTop: 8 }]}>
          <View style={[styles.updateBox, { width: '67%', minHeight: 135, overflow: 'hidden', justifyContent: 'center' }]}>
            <View style={{ opacity: 0.20 }}>
              <Text style={styles.time}>--:--</Text>
              <Text style={styles.food}>Feeding activity</Text>
            </View>
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
              justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239,244,243,0.65)' }}>
              <Ionicons name="lock-closed" size={25} color={colors.primaryDark}/>
              <Text style={{ color: colors.primaryDark, fontWeight: '800', marginTop: 6 }}>Boarding code required</Text>
            </View>
          </View>
          <View style={[styles.progressCircle, { opacity: 0.38, borderColor: '#99b5b4' }]}>
            <Ionicons name="lock-closed" size={24} color={colors.primaryDark}/>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.bottomTitleRow}><Text style={styles.smallTitle}>Feeding Overview</Text></View>
          <TouchableOpacity accessibilityRole="button" onPress={enterCode} activeOpacity={0.9}
            style={{ backgroundColor: '#edf1f0', borderColor: '#cfdcda', borderWidth: 1, borderRadius: 14,
              minHeight: 165, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <Ionicons name="lock-closed" size={31} color={colors.primaryDark} />
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginTop: 9 }}>Feeding information locked</Text>
            <Text style={{ fontSize: 12, textAlign: 'center', color: colors.textSecondary, marginTop: 5 }}>
              Enter your boarding code to view updates and feeding history.
            </Text>
            <Text style={{ fontSize: 12, marginTop: 12, fontWeight: '800', color: colors.primary }}>Enter Boarding Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
