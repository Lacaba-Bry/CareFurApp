import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../assets/css/CameraScreenStyles';

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#111" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Live Camera</Text>

          <View style={styles.infoRow}>
            <Text style={styles.info}>🐶 Pet: <Text style={styles.bold}>Sachi</Text></Text>
            <Text style={styles.info}>🏠 Room: <Text style={styles.bold}>A-10</Text></Text>
          </View>
        </View>
      </View>

      <Image
        source={require('../assets/Login/CamSamp.png')}
        style={styles.camera}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.fullscreen}>
        <Ionicons name="scan-outline" size={15} color="#FFF" />
        <Text style={styles.fullText}>Full screen</Text>
      </TouchableOpacity>

      <View style={styles.captureSection}>
        <View style={styles.line} />
        <Text style={styles.captureTitle}>Captured Snapshots:</Text>
        <View style={styles.line} />
        <Text style={styles.count}>5/15</Text>
      </View>

      <View style={styles.snapshotRow}>
        <TouchableOpacity>
          <Ionicons name="caret-back" size={29} color="#D06435" />
        </TouchableOpacity>

        <Image
          source={require('../assets/Login/CamSamp1.png')}
          style={styles.snapshot}
          resizeMode="cover"
        />

        <TouchableOpacity>
          <Ionicons name="caret-forward" size={29} color="#D06435" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.photos}>
        <Text style={styles.photosText}>View All Photos →</Text>
      </TouchableOpacity>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={18} color="#111" />
          <Text style={styles.detailText}>Date: <Text style={styles.bold}>99/99/99</Text></Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={19} color="#111" />
          <Text style={styles.detailText}>Time: <Text style={styles.bold}>03:00 PM</Text></Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="volume-high" size={29} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="videocam" size={31} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}