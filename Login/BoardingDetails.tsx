import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import styles from '../assets/css/BoardingDetailsStyles';

export default function BoardingDetails({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
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

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Boarding</Text>
            <Text style={styles.title}>Details</Text>
          </View>
        </View>

        <View style={styles.petCard}>
          <Image
            source={require('../assets/Login/DogProfile.jpg')}
            style={styles.petImage}
          />

          <View style={styles.petInfo}>
            <Text style={styles.petName}>Sachi</Text>

            <View style={styles.petDescription}>
              <View style={styles.petDetail}>
                <View style={styles.dot} />
                <Text style={styles.petText}>Dog</Text>
              </View>

              <View style={styles.petDetail}>
                <View style={styles.dot} />
                <Text style={styles.petText}>Shih-Poo</Text>
              </View>

              <View style={styles.petDetail}>
                <View style={styles.dot} />
                <Text style={styles.petText}>Female</Text>
              </View>
            </View>
          </View>

          <Ionicons
            name="chevron-down"
            size={22}
            color="#111"
          />
        </View>

        <View style={styles.topCards}>
          <View style={styles.smallCard}>
            <Text style={styles.orangeHeader}>
              Room Number
            </Text>

            <View style={styles.smallCardBody}>
              <Text style={styles.bigValue}>01</Text>
            </View>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.orangeHeader}>
              Package
            </Text>

            <View style={styles.smallCardBody}>
              <Text style={styles.bigValue}>Deluxe</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainRow}>
          <View style={styles.feedingCard}>
            <Text style={styles.blueHeader}>
              Feeding Instructions
            </Text>

            <View style={styles.cardContent}>
              <Text style={styles.label}>Dry Food</Text>
              <Text style={styles.description}>
                • 2 scoops - 8:00 AM
              </Text>
              <Text style={styles.description}>
                • 2 scoops - 8:00 PM
              </Text>

              <Text style={styles.label}>Wet Food</Text>
              <Text style={styles.description}>
                • Aozi Chicken
              </Text>
              <Text style={styles.description}>
                • Lunch only
              </Text>

              <Text style={styles.label}>Medication</Text>
              <Text style={styles.description}>
                • None
              </Text>

              <Text style={styles.label}>Allergies</Text>
              <Text style={styles.description}>
                • Chicken
              </Text>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.specialCard}>
              <Text style={styles.blueHeader}>
                Special Notes
              </Text>

              <View style={styles.cardContent}>
                <Text style={styles.description}>
                  • Sleeps with blanket
                </Text>
                <Text style={styles.description}>
                  • Needs slow feeding
                </Text>
                <Text style={styles.description}>
                  • Separate from other dogs
                </Text>
              </View>
            </View>

            <View style={styles.staffCard}>
              <Text style={styles.blueHeader}>
                Assigned Staff
              </Text>

              <View style={styles.cardContent}>
                <Text style={styles.description}>
                  10 to 15 - Bryan
                </Text>
                <Text style={styles.description}>
                  16 to 26 - Arshley
                </Text>
              </View>
            </View>

            <View style={styles.daysCard}>
              <Text style={styles.blueHeader}>
                Remaining Days
              </Text>

              <View style={styles.daysBody}>
                <Text style={styles.daysText}>
                  6 DAYS
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              Check-in
            </Text>

            <Text style={styles.dateHeaderText}>
              Check-out
            </Text>
          </View>

          <View style={styles.dateBody}>
            <Text style={styles.dateText}>
              July 10, 2026
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#111"
            />

            <Text style={styles.dateText}>
              July 26, 2026
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'Home',
            })
          }
        >
          <Ionicons name="home" size={23} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'Pets',
            })
          }
        >
          <Ionicons name="paw" size={23} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'Camera',
            })
          }
        >
          <Ionicons name="camera" size={23} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'Care',
            })
          }
        >
          <Ionicons
            name="nutrition"
            size={23}
            color="#FFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            navigation.navigate('MainTabs', {
              screen: 'Profile',
            })
          }
        >
          <Ionicons name="person" size={23} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}