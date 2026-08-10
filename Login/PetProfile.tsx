import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../assets/css/PetProfileStyles';

export default function PetProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/Login/DogProfile.jpg')}
          style={styles.petImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.back}>
          <Ionicons name="chevron-back" size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.more}>
          <Ionicons name="ellipsis-vertical" size={26} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.slider}>
          <View style={styles.sliderActive} />
          <View style={styles.sliderDot} />
          <View style={styles.sliderDot} />
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={require('../assets/Login/DogWatermark.jpg')}
          style={styles.watermark}
          resizeMode="contain"
        />

        <View style={styles.innerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.petName}>Max, 4 years old</Text>
            <Ionicons
              name="create-outline"
              size={22}
              color="#16444A"
            />
          </View>

          <View style={styles.infoContainer}>
            <PetInfo title="Sex" value="Male" />
            <PetInfo title="Weight" value="34 kg" />
            <PetInfo title="Color" value="Brown" />
            <PetInfo title="Breed" value="Golden Retriever" />
            <PetInfo title="Food Type" value="Mixed of Wet and Dry" />
            <PetInfo title="Vitamins" value="N/A" />
            <PetInfo title="Medicine" value="N/A" />

            <View style={styles.row}>
              <Text style={styles.label}>Vaccine History</Text>
              <TouchableOpacity>
                <Text style={styles.link}>View image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PetInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}