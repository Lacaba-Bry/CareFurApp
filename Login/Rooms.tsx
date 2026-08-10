import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import styles from '../assets/css/RoomsStyles';

export default function Rooms({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  const [page, setPage] = useState(1);

  if (!fontsLoaded) {
    return null;
  }

  const goLeft = () => {
    setPage(page === 1 ? 2 : 1);
  };

  const goRight = () => {
    setPage(page === 1 ? 2 : 1);
  };

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

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Slot</Text>
            <Text style={styles.title}>Availability</Text>
          </View>
        </View>

        {/* DATE */}
        <View style={styles.dateRow}>
          <Text style={styles.dateBold}>19 July, 26</Text>
          <Text style={styles.dateNormal}>Wednesday</Text>

          <Ionicons
            name="chevron-down"
            size={16}
            color="#111"
          />
        </View>

        {/* WEEK */}
        <View style={styles.weekRow}>
          <Day day="S" number="1" />
          <Day day="M" number="2" />
          <Day day="T" number="3" active />
          <Day day="W" number="4" />
          <Day day="TH" number="5" />
          <Day day="F" number="6" />
          <Day day="S" number="7" />
        </View>

        {/* ROOM PAGE */}
        <View style={styles.roomArea}>
          {page === 1 ? (
            <>
              <View style={styles.topRoomRow}>
                <RoomBox
                  title="Room"
                  number="01"
                  color="#F5E96B"
                />

                <RoomBox
                  title="Room"
                  number="02"
                  color="#9BD4E1"
                />

                <RoomBox
                  title="Room"
                  number="03"
                  color="#9BD4E1"
                />

                <RoomBox
                  title="Room"
                  number="04"
                  color="#FFF99B"
                />

                <RoomBox
                  title="Room"
                  number="05"
                  color="#FFF45A"
                />
              </View>

              <View style={styles.playArea}>
                <Text style={styles.playText}>
                  Playing
                </Text>

                <Text style={styles.playText}>
                  Area
                </Text>
              </View>

              <View style={styles.bottomRoomRow}>
                <RoomBox
                  title="Room"
                  number="06"
                  color="#FFFFFF"
                />

                <RoomBox
                  title="Room"
                  number="07"
                  color="#F26352"
                />

                <RoomBox
                  title="Room"
                  number="08"
                  color="#9DD7E2"
                />

                <RoomBox
                  title="Room"
                  number="09"
                  color="#E8825C"
                  occupied
                />

                <RoomBox
                  title="Room"
                  number="10"
                  color="#FFFFFF"
                />
              </View>

              <TouchableOpacity
                style={styles.rightArrow}
                onPress={goRight}
              >
                <Ionicons
                  name="caret-forward"
                  size={34}
                  color="#D06435"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.houseTopRow}>
                <HouseRoom
                  title="Room 01-A"
                />

                <HouseRoom
                  title="Room 02"
                />
              </View>

              <View style={styles.houseBottomRow}>
                <HouseRoom
                  title="Room 03"
                  occupied
                />

                <HouseRoom
                  title="Room 04"
                />

                <HouseRoom
                  title="Room 05"
                />
              </View>

              <TouchableOpacity
                style={styles.leftArrow}
                onPress={goLeft}
              >
                <Ionicons
                  name="caret-back"
                  size={34}
                  color="#D06435"
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* LEGEND */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>LEGEND:</Text>

          <View style={styles.legendRow}>
            <Ionicons
              name="paw"
              size={20}
              color="#111"
            />

            <Text style={styles.legendText}>
              - Occupied
            </Text>
          </View>
        </View>
      </View>

      {/* BOTTOM NAV */}
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
          <Ionicons name="nutrition" size={23} color="#FFF" />
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

function Day({
  day,
  number,
  active = false,
}: {
  day: string;
  number: string;
  active?: boolean;
}) {
  return (
    <View style={styles.dayItem}>
      <Text style={styles.dayText}>{day}</Text>

      <View
        style={[
          styles.dayCircle,
          active && styles.dayCircleActive,
        ]}
      >
        <Text style={styles.dayNumber}>
          {number}
        </Text>
      </View>
    </View>
  );
}

function RoomBox({
  title,
  number,
  color,
  occupied = false,
}: {
  title: string;
  number: string;
  color: string;
  occupied?: boolean;
}) {
  return (
    <View
      style={[
        styles.roomBox,
        { backgroundColor: color },
      ]}
    >
      <Text style={styles.roomTitle}>
        {title}
      </Text>

      <Text style={styles.roomNumber}>
        {number}
      </Text>

      {occupied && (
        <Ionicons
          name="paw"
          size={28}
          color="#111"
          style={styles.occupiedIcon}
        />
      )}
    </View>
  );
}

function HouseRoom({
  title,
  occupied = false,
}: {
  title: string;
  occupied?: boolean;
}) {
  return (
    <View style={styles.houseRoom}>
      <Text style={styles.houseTitle}>
        {title}
      </Text>

      <View style={styles.houseDoor} />
      <View style={styles.houseBed} />

      {occupied && (
        <Ionicons
          name="paw"
          size={28}
          color="#111"
          style={styles.houseOccupied}
        />
      )}
    </View>
  );
}