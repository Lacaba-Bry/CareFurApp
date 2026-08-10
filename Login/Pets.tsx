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

import styles from '../assets/css/PetsStyles';

export default function Pets({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
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

          <Text style={styles.title}>Pets</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* PET 1 */}
        <PetCard
          name="Nikki"
          image={require('../assets/Login/DogProfile.jpg')}
          gender="female"
          weight="34 kg"
          checkedIn
        />

        {/* PET 2 */}
        <PetCard
          name="Bear"
          image={require('../assets/Login/DogProfile.jpg')}
          gender="male"
          weight="34 kg"
          date="06/06/06"
        />

        {/* PET 3 */}
        <PetCard
          name="Sarah"
          image={require('../assets/Login/DogProfile.jpg')}
          gender="female"
          weight="34 kg"
          date="06/06/06"
        />
      </View>
    </SafeAreaView>
  );
}

function PetCard({
  name,
  image,
  gender,
  weight,
  checkedIn = false,
  date,
}: {
  name: string;
  image: any;
  gender: 'male' | 'female';
  weight: string;
  checkedIn?: boolean;
  date?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.petCard}
      activeOpacity={0.85}
    >
      <Image
        source={image}
        style={styles.petImage}
        resizeMode="cover"
      />

      <View style={styles.petDetails}>
        <Text style={styles.petName}>
          {name}
        </Text>

        <View style={styles.petInfoRow}>
          <Ionicons
            name={gender === 'female' ? 'female' : 'male'}
            size={23}
            color="#111"
          />

          <Text style={styles.weight}>
            {weight}
          </Text>
        </View>

        {checkedIn ? (
          <Text style={styles.checkedIn}>
            Checked in
          </Text>
        ) : (
          <View style={styles.lastCheckedRow}>
            <Text style={styles.lastCheckedLabel}>
              Last Checked in:
            </Text>

            <Text style={styles.lastCheckedDate}>
              {date}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}