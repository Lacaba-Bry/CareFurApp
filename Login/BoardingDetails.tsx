import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import { supabase } from '../lib/supabase';

import styles from '../assets/css/BoardingDetailsStyles';

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

// ============================================================
// TYPES
// ============================================================

type Booking = {
  id: string;

  booking_code?: string | null;

  pet_id?: string | null;

  room_id?: string | null;

  status?: string | null;

  check_in_at?: string | null;

  expected_check_out_at?: string | null;

  special_instructions?: string | null;

  package?: string | null;

  package_name?: string | null;

  assigned_staff?: string | null;
};

type Pet = {
  id: string;

  name?: string | null;

  species?: string | null;

  breed?: string | null;

  sex?: string | null;

  photo_url?: string | null;

  feeding_notes?: string | null;
};

type Room = {
  id: string;

  room_number?: string | null;

  room_name?: string | null;

  capacity?: number | null;

  status?: string | null;
};

type FeedingSchedule = {
  id: string;

  booking_id: string;

  scheduled_at: string;

  feeding_method?: string | null;

  compartment_number?: number | null;

  portion_grams?: number | null;

  instructions?: string | null;

  status?: string | null;
};

// ============================================================
// SCREEN
// ============================================================

export default function BoardingDetails({
  navigation,
  route,
}: any) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  const routeParams =
    route?.params ?? {};

  const [booking, setBooking] =
    useState<Booking | null>(
      routeParams.booking ?? null
    );

  const [pet, setPet] =
    useState<Pet | null>(
      routeParams.pet ?? null
    );

  const [room, setRoom] =
    useState<Room | null>(
      routeParams.room ?? null
    );

  const [
    feedingSchedules,
    setFeedingSchedules,
  ] = useState<FeedingSchedule[]>(
    routeParams.feedingSchedules ?? []
  );

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD LATEST BOARDING INFORMATION
  // ============================================================

  const loadBoardingDetails =
    useCallback(async () => {
      try {
        setError(null);

        const savedCode =
          await AsyncStorage.getItem(
            BOARDING_CODE_STORAGE_KEY
          );

        if (!savedCode) {
          return;
        }

        const {
          data,
          error: functionError,
        } =
          await supabase.functions.invoke(
            'verify-booking-code',
            {
              body: {
                code: savedCode,
              },
            }
          );

        if (functionError) {
          console.error(
            'BoardingDetails verify error:',
            functionError
          );

          throw new Error(
            functionError.message ||
              'Unable to load boarding details.'
          );
        }

        if (!data) {
          throw new Error(
            'No response was received from Supabase.'
          );
        }

        if (data.error) {
          throw new Error(
            data.error
          );
        }

        if (!data.booking) {
          throw new Error(
            'Boarding information could not be found.'
          );
        }

        setBooking(
          data.booking
        );

        setPet(
          data.pet ?? null
        );

        setRoom(
          data.room ?? null
        );

        setFeedingSchedules(
          data.feedingSchedules ?? []
        );

        console.log(
          'BOARDING DETAILS LOADED'
        );

        console.log(
          'Booking:',
          data.booking
        );

        console.log(
          'Pet:',
          data.pet
        );

        console.log(
          'Room:',
          data.room
        );

        console.log(
          'Feeding:',
          data.feedingSchedules
        );
      } catch (err: any) {
        console.error(
          'BoardingDetails error:',
          err
        );

        setError(
          err?.message ||
            'Unable to load boarding details.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    if (!booking) {
      setLoading(true);
    }

    loadBoardingDetails();
  }, [loadBoardingDetails]);

  // ============================================================
  // REFRESH
  // ============================================================

  const onRefresh = () => {
    setRefreshing(true);

    loadBoardingDetails();
  };

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const petName =
    pet?.name ||
    'Your Pet';

  const petSpecies =
    capitalize(
      pet?.species ||
        'Pet'
    );

  const petBreed =
    pet?.breed ||
    'Unknown Breed';

  const petSex =
    capitalize(
      pet?.sex ||
        'Unknown'
    );

  const roomNumber =
    room?.room_number ||
    '—';

  const packageName =
    booking?.package_name ||
    booking?.package ||
    '—';

  const checkIn =
    booking?.check_in_at
      ? formatDate(
          booking.check_in_at
        )
      : '—';

  const checkOut =
    booking
      ?.expected_check_out_at
      ? formatDate(
          booking.expected_check_out_at
        )
      : '—';

  const remainingDays =
    booking
      ?.expected_check_out_at
      ? calculateRemainingDays(
          booking.expected_check_out_at
        )
      : 0;

  const specialNotes =
    booking
      ?.special_instructions
      ?.trim() ||
    'No special notes';

  const assignedStaff =
    booking
      ?.assigned_staff
      ?.trim() ||
    'Not assigned';

  // ============================================================
  // PET IMAGE
  // ============================================================

  const petImageSource =
    pet?.photo_url
      ? {
          uri:
            pet.photo_url,
        }
      : require(
          '../assets/Login/DogProfile.jpg'
        );

  // ============================================================
  // FEEDING INFORMATION
  // ============================================================

  const sortedFeedings =
    useMemo(() => {
      return [
        ...feedingSchedules,
      ].sort(
        (a, b) =>
          new Date(
            a.scheduled_at
          ).getTime() -
          new Date(
            b.scheduled_at
          ).getTime()
      );
    }, [
      feedingSchedules,
    ]);

  // ============================================================
  // FONT
  // ============================================================

  if (!fontsLoaded) {
    return null;
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (
    loading &&
    !booking
  ) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={{
            flex: 1,

            alignItems:
              'center',

            justifyContent:
              'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#14646B"
          />

          <Text
            style={{
              marginTop:
                10,

              color:
                '#14646B',
            }}
          >
            Loading boarding
            details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
          />
        }
      >
        <View
          style={
            styles.content
          }
        >
          {/* HEADER */}

          <View
            style={
              styles.header
            }
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={() =>
                navigation.goBack()
              }
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color="#111"
              />
            </TouchableOpacity>

            <View
              style={
                styles.titleContainer
              }
            >
              <Text
                style={
                  styles.title
                }
              >
                Boarding
              </Text>

              <Text
                style={
                  styles.title
                }
              >
                Details
              </Text>
            </View>
          </View>

          {/* ERROR */}

          {error ? (
            <Text
              style={{
                color:
                  '#D06435',

                fontSize:
                  12,

                marginBottom:
                  8,
              }}
            >
              {error}
            </Text>
          ) : null}

          {/* PET CARD */}

          <View
            style={
              styles.petCard
            }
          >
            <Image
              source={
                petImageSource
              }
              style={
                styles.petImage
              }
            />

            <View
              style={
                styles.petInfo
              }
            >
              <Text
                style={
                  styles.petName
                }
              >
                {petName}
              </Text>

              <View
                style={
                  styles.petDescription
                }
              >
                <View
                  style={
                    styles.petDetail
                  }
                >
                  <View
                    style={
                      styles.dot
                    }
                  />

                  <Text
                    style={
                      styles.petText
                    }
                  >
                    {petSpecies}
                  </Text>
                </View>

                <View
                  style={
                    styles.petDetail
                  }
                >
                  <View
                    style={
                      styles.dot
                    }
                  />

                  <Text
                    style={
                      styles.petText
                    }
                  >
                    {petBreed}
                  </Text>
                </View>

                <View
                  style={
                    styles.petDetail
                  }
                >
                  <View
                    style={
                      styles.dot
                    }
                  />

                  <Text
                    style={
                      styles.petText
                    }
                  >
                    {petSex}
                  </Text>
                </View>
              </View>
            </View>

            <Ionicons
              name="chevron-down"
              size={22}
              color="#111"
            />
          </View>

          {/* ROOM + PACKAGE */}

          <View
            style={
              styles.topCards
            }
          >
            <View
              style={
                styles.smallCard
              }
            >
              <Text
                style={
                  styles.orangeHeader
                }
              >
                Room Number
              </Text>

              <View
                style={
                  styles.smallCardBody
                }
              >
                <Text
                  style={
                    styles.bigValue
                  }
                >
                  {roomNumber}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.smallCard
              }
            >
              <Text
                style={
                  styles.orangeHeader
                }
              >
                Package
              </Text>

              <View
                style={
                  styles.smallCardBody
                }
              >
                <Text
                  style={
                    styles.bigValue
                  }
                >
                  {packageName}
                </Text>
              </View>
            </View>
          </View>

          {/* MAIN */}

          <View
            style={
              styles.mainRow
            }
          >
            {/* FEEDING */}

            <View
              style={
                styles.feedingCard
              }
            >
              <Text
                style={
                  styles.blueHeader
                }
              >
                Feeding Instructions
              </Text>

              <View
                style={
                  styles.cardContent
                }
              >
                {sortedFeedings
                  .length ===
                0 ? (
                  <Text
                    style={
                      styles.description
                    }
                  >
                    • No feeding
                    schedules
                  </Text>
                ) : (
                  sortedFeedings.map(
                    (
                      feeding,
                      index
                    ) => (
                      <View
                        key={
                          feeding.id
                        }
                        style={{
                          marginBottom:
                            8,
                        }}
                      >
                        <Text
                          style={
                            styles.label
                          }
                        >
                          {getMealPeriod(
                            feeding
                              .scheduled_at
                          )}
                        </Text>

                        <Text
                          style={
                            styles.description
                          }
                        >
                          •{' '}
                          {formatTime(
                            feeding
                              .scheduled_at
                          )}
                        </Text>

                        <Text
                          style={
                            styles.description
                          }
                        >
                          •{' '}
                          {capitalize(
                            feeding
                              .feeding_method ||
                              'Manual'
                          )}
                        </Text>

                        {feeding
                          .portion_grams ? (
                          <Text
                            style={
                              styles.description
                            }
                          >
                            •{' '}
                            {
                              feeding
                                .portion_grams
                            }
                            g
                          </Text>
                        ) : null}

                        {feeding
                          .instructions ? (
                          <Text
                            style={
                              styles.description
                            }
                          >
                            •{' '}
                            {
                              feeding
                                .instructions
                            }
                          </Text>
                        ) : null}

                        {index <
                        sortedFeedings.length -
                          1 ? (
                          <View
                            style={{
                              height:
                                4,
                            }}
                          />
                        ) : null}
                      </View>
                    )
                  )
                )}
              </View>
            </View>

            {/* RIGHT */}

            <View
              style={
                styles.rightColumn
              }
            >
              {/* SPECIAL NOTES */}

              <View
                style={
                  styles.specialCard
                }
              >
                <Text
                  style={
                    styles.blueHeader
                  }
                >
                  Special Notes
                </Text>

                <View
                  style={
                    styles.cardContent
                  }
                >
                  <Text
                    style={
                      styles.description
                    }
                  >
                    •{' '}
                    {specialNotes}
                  </Text>
                </View>
              </View>

              {/* STAFF */}

              <View
                style={
                  styles.staffCard
                }
              >
                <Text
                  style={
                    styles.blueHeader
                  }
                >
                  Assigned Staff
                </Text>

                <View
                  style={
                    styles.cardContent
                  }
                >
                  <Text
                    style={
                      styles.description
                    }
                  >
                    {
                      assignedStaff
                    }
                  </Text>
                </View>
              </View>

              {/* DAYS */}

              <View
                style={
                  styles.daysCard
                }
              >
                <Text
                  style={
                    styles.blueHeader
                  }
                >
                  Remaining Days
                </Text>

                <View
                  style={
                    styles.daysBody
                  }
                >
                  <Text
                    style={
                      styles.daysText
                    }
                  >
                    {remainingDays}{' '}
                    {remainingDays ===
                    1
                      ? 'DAY'
                      : 'DAYS'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* DATES */}

          <View
            style={
              styles.dateCard
            }
          >
            <View
              style={
                styles.dateHeader
              }
            >
              <Text
                style={
                  styles.dateHeaderText
                }
              >
                Check-in
              </Text>

              <Text
                style={
                  styles.dateHeaderText
                }
              >
                Check-out
              </Text>
            </View>

            <View
              style={
                styles.dateBody
              }
            >
              <Text
                style={
                  styles.dateText
                }
              >
                {checkIn}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#111"
              />

              <Text
                style={
                  styles.dateText
                }
              >
                {checkOut}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}

      <View
        style={
          styles.bottomNav
        }
      >
        <NavButton
          icon="home"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Home',
              }
            )
          }
        />

        <NavButton
          icon="paw"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Pets',
              }
            )
          }
        />

        <NavButton
          icon="camera"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Camera',
              }
            )
          }
        />

        <NavButton
          icon="nutrition"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Care',
              }
            )
          }
        />

        <NavButton
          icon="person"
          onPress={() =>
            navigation.navigate(
              'MainTabs',
              {
                screen:
                  'Profile',
              }
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// NAV BUTTON
// ============================================================

function NavButton({
  icon,
  onPress,
}: {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >['name'];

  onPress:
    () => void;
}) {
  return (
    <TouchableOpacity
      style={
        styles.navButton
      }
      onPress={
        onPress
      }
    >
      <Ionicons
        name={icon}
        size={23}
        color="#FFF"
      />
    </TouchableOpacity>
  );
}

// ============================================================
// HELPERS
// ============================================================

function calculateRemainingDays(
  value:
    string
) {
  const checkout =
    new Date(
      value
    );

  if (
    Number.isNaN(
      checkout.getTime()
    )
  ) {
    return 0;
  }

  const difference =
    checkout.getTime() -
    Date.now();

  return Math.max(
    0,
    Math.ceil(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        )
    )
  );
}

function formatDate(
  value:
    string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—';
  }

  return date.toLocaleDateString(
    'en-US',
    {
      month:
        'long',

      day:
        'numeric',

      year:
        'numeric',
    }
  );
}

function formatTime(
  value:
    string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '--:--';
  }

  return date.toLocaleTimeString(
    [],
    {
      hour:
        '2-digit',

      minute:
        '2-digit',

      hour12:
        true,
    }
  );
}

function getMealPeriod(
  value:
    string
) {
  const date =
    new Date(
      value
    );

  const hour =
    date.getHours();

  if (
    hour < 11
  ) {
    return 'Breakfast';
  }

  if (
    hour < 16
  ) {
    return 'Lunch';
  }

  return 'Dinner';
}

function capitalize(
  value:
    string
) {
  if (
    !value
  ) {
    return '';
  }

  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}