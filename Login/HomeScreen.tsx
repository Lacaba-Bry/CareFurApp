import React from 'react';

import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles from '../assets/css/HomeScreenStyles';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.hello}>
            Hello,
          </Text>

          <Text style={styles.name}>
            Beia Ann!
          </Text>

          <Text style={styles.subtitle}>
            Check on your pet and see how they're doing
          </Text>
        </View>

        {/* DASHBOARD */}
        <View style={styles.grid}>
          <DashboardCard
            title="Sachi's Profile"
            icon="paw"
            color="#D06435"
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Pets',
              })
            }
          />

          <DashboardCard
            title="Slot Availability"
            icon="calendar"
            color="#14646B"
            onPress={() =>
              navigation.navigate('Rooms')
            }
          />

          <DashboardCard
            title="Message Stay"
            icon="chatbox"
            color="#16444A"
          />

          <DashboardCard
            title="Boarding Details"
            icon="bed"
            color="#B4A276"
            onPress={() =>
              navigation.navigate('BoardingDetails')
            }
          />
        </View>

        {/* LATEST UPDATE HEADER */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.smallTitle}>
            Latest Update
          </Text>

          <View style={styles.mealsTitleRow}>
            <Text style={styles.smallTitle}>
              Meals Today:
            </Text>

            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeText}>
                67%
              </Text>
            </View>
          </View>
        </View>

        {/* LATEST UPDATE */}
        <View style={styles.updateRow}>
          <View style={styles.updateBox}>
            <Text style={styles.time}>
              3:00 PM
            </Text>

            <Text style={styles.food}>
              Sachi was fed Lunch.
            </Text>

            <TouchableOpacity>
              <Text style={styles.view}>
                View Photo →
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.percent}>
              67%
            </Text>

            <Text style={styles.done}>
              DONE
            </Text>
          </View>
        </View>

        {/* FOOD DETAILS */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomTitleRow}>
            <Text style={styles.smallTitle}>
              Food Details:
            </Text>

            <Text style={styles.smallTitle}>
              Next Feeding:
            </Text>
          </View>

          <View style={styles.bottomCards}>
            <View style={styles.foodCard}>
              <Text style={styles.foodTitle}>
                🍚 Wet Food
              </Text>

              <Text style={styles.foodDetail}>
                ▪ 2 scoops
              </Text>

              <Text style={styles.foodTitle}>
                🍗 Dry Food
              </Text>

              <Text style={styles.foodDetail}>
                ▪ 2 scoops
              </Text>
            </View>

            <View style={styles.feedCard}>
              <Text style={styles.dinnerText}>
                Dinner
              </Text>

              <Text style={styles.timeBig}>
                08:00
              </Text>

              <Text style={styles.pmText}>
                PM
              </Text>
            </View>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

function DashboardCard({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: color,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#FFFFFF"
      />

      <Text style={styles.cardText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}