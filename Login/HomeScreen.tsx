import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../lib/supabase';
import styles from '../assets/css/HomeScreenStyles';

type Booking = {
  id: string;
  booking_code?: string | null;
  pet_id?: string | null;
  room_id?: string | null;
  check_in_at?: string | null;
  expected_check_out_at?: string | null;
  status?: string | null;
  special_instructions?: string | null;
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

type AccessData = {
  id?: string | null;
  ownerId?: string | null;
  invitedEmail?: string | null;
  expiresAt?: string | null;
  redeemedAt?: string | null;
};

export default function HomeScreen({
  navigation,
  route,
}: any) {
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

  const [access, setAccess] =
    useState<AccessData | null>(
      routeParams.access ?? null
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const accessCode =
    routeParams.accessCode ?? '';

  const ownerEmail =
    routeParams.ownerEmail ??
    routeParams.invitedEmail ??
    routeParams.access?.invitedEmail ??
    null;

  const loadBoardingData =
    useCallback(async () => {
      try {
        setError(null);

        if (!accessCode) {
          setLoading(false);
          return;
        }

        const {
          data,
          error,
        } =
          await supabase.functions.invoke(
            'verify-booking-code',
            {
              body: {
                code: accessCode,
              },
            }
          );

        if (error) {
          console.error(
            'Home verify-booking-code error:',
            error
          );

          throw new Error(
            error.message ||
              'Unable to refresh boarding information.'
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
            'The boarding booking could not be found.'
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

        setAccess(
          data.access ?? null
        );

        setFeedingSchedules(
          data.feedingSchedules ?? []
        );

        console.log(
          'HOME DATA LOADED'
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
          'Feeding schedules:',
          data.feedingSchedules
        );

        console.log(
          'Access:',
          data.access
        );
      } catch (err: any) {
        console.error(
          'HomeScreen load error:',
          err
        );

        setError(
          err?.message ||
            'Unable to load boarding information.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, [accessCode]);

  useEffect(() => {
    loadBoardingData();
  }, [loadBoardingData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBoardingData();
  };

  const petName =
    pet?.name ||
    'Your Pet';

  const ownerName =
    getOwnerDisplayName(
      ownerEmail
    );

  const now =
    new Date();

  const todayKey =
    getLocalDateKey(
      now
    );

  const todaySchedules =
    feedingSchedules.filter(
      (schedule) => {
        return (
          getLocalDateKey(
            new Date(
              schedule.scheduled_at
            )
          ) === todayKey
        );
      }
    );

  const completedToday =
    todaySchedules.filter(
      (schedule) =>
        String(
          schedule.status || ''
        )
          .trim()
          .toLowerCase() ===
        'completed'
    );

  const mealsPercentage =
    todaySchedules.length > 0
      ? Math.round(
          (
            completedToday.length /
            todaySchedules.length
          ) * 100
        )
      : 0;

  const latestCompleted =
    [...feedingSchedules]
      .filter(
        (schedule) =>
          String(
            schedule.status || ''
          )
            .trim()
            .toLowerCase() ===
          'completed'
      )
      .sort(
        (a, b) =>
          new Date(
            b.scheduled_at
          ).getTime() -
          new Date(
            a.scheduled_at
          ).getTime()
      )[0] ?? null;

  const nextFeeding =
    [...feedingSchedules]
      .filter(
        (schedule) => {
          const scheduledTime =
            new Date(
              schedule.scheduled_at
            ).getTime();

          const status =
            String(
              schedule.status || ''
            )
              .trim()
              .toLowerCase();

          return (
            scheduledTime >
              Date.now() &&
            status !== 'completed' &&
            status !== 'cancelled' &&
            status !== 'canceled'
          );
        }
      )
      .sort(
        (a, b) =>
          new Date(
            a.scheduled_at
          ).getTime() -
          new Date(
            b.scheduled_at
          ).getTime()
      )[0] ?? null;

  const latestTime =
    latestCompleted
      ? formatTime(
          latestCompleted
            .scheduled_at
        )
      : '--:--';

  const latestMessage =
    latestCompleted
      ? `${petName} was fed ${getMealPeriod(
          latestCompleted.scheduled_at
        )}.`
      : 'No completed feeding yet.';

  const nextFeedingTime =
    nextFeeding
      ? formatTimeParts(
          nextFeeding
            .scheduled_at
        )
      : {
          time: '--:--',
          period: '',
        };

  const nextMealLabel =
    nextFeeding
      ? getMealPeriod(
          nextFeeding
            .scheduled_at
        )
      : 'No Feeding';

  const feedingInstructions =
    nextFeeding?.instructions ||
    pet?.feeding_notes ||
    booking?.special_instructions ||
    'No feeding instructions';

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#14646B"
          />

          <Text
            style={{
              marginTop: 10,
              color: '#14646B',
            }}
          >
            Loading boarding information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
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
          style={styles.content}
        >
          {/* HEADER */}

          <View
            style={styles.header}
          >
            <Text
              style={styles.hello}
            >
              Hello,
            </Text>

            <Text
              style={styles.name}
            >
              {ownerName}!
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Check on your pet and see how they're doing
            </Text>
          </View>

          {/* ERROR */}

          {error && (
            <Text
              style={{
                color: '#D06435',
                fontSize: 12,
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              {error}
            </Text>
          )}

          {/* DASHBOARD */}

          <View
            style={styles.grid}
          >
            <DashboardCard
              title={`${petName}'s Profile`}
              icon="paw"
              color="#D06435"
              onPress={() =>
                navigation.navigate(
                  'Pets',
                  {
                    petId:
                      pet?.id ??
                      booking?.pet_id ??
                      null,

                    bookingId:
                      booking?.id ??
                      null,

                    pet,

                    booking,
                  }
                )
              }
            />

            <DashboardCard
              title="Slot Availability"
              icon="calendar"
              color="#14646B"
              onPress={() =>
                navigation.navigate(
                  'Rooms',
                  {
                    bookingId:
                      booking?.id ??
                      null,

                    roomId:
                      room?.id ??
                      booking?.room_id ??
                      null,

                    room,

                    booking,
                  }
                )
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
                navigation.navigate(
                  'BoardingDetails',
                  {
                    bookingId:
                      booking?.id ??
                      null,

                    petId:
                      pet?.id ??
                      booking?.pet_id ??
                      null,

                    roomId:
                      room?.id ??
                      booking?.room_id ??
                      null,

                    booking,

                    pet,

                    room,

                    feedingSchedules,

                    access,
                  }
                )
              }
            />
          </View>

          {/* LATEST UPDATE HEADER */}

          <View
            style={
              styles.sectionTitleRow
            }
          >
            <Text
              style={
                styles.smallTitle
              }
            >
              Latest Update
            </Text>

            <View
              style={
                styles.mealsTitleRow
              }
            >
              <Text
                style={
                  styles.smallTitle
                }
              >
                Meals Today:
              </Text>

              <View
                style={
                  styles.percentBadge
                }
              >
                <Text
                  style={
                    styles.percentBadgeText
                  }
                >
                  {mealsPercentage}%
                </Text>
              </View>
            </View>
          </View>

          {/* LATEST UPDATE */}

          <View
            style={
              styles.updateRow
            }
          >
            <View
              style={
                styles.updateBox
              }
            >
              <Text
                style={
                  styles.time
                }
              >
                {latestTime}
              </Text>

              <Text
                style={
                  styles.food
                }
              >
                {latestMessage}
              </Text>

              {latestCompleted
                ?.instructions ? (
                <TouchableOpacity>
                  <Text
                    style={
                      styles.view
                    }
                  >
                    {
                      latestCompleted
                        .instructions
                    }
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={
                styles.progressCircle
              }
            >
              <Text
                style={
                  styles.percent
                }
              >
                {mealsPercentage}%
              </Text>

              <Text
                style={
                  styles.done
                }
              >
                DONE
              </Text>
            </View>
          </View>

          {/* FOOD DETAILS */}

          <View
            style={
              styles.bottomSection
            }
          >
            <View
              style={
                styles.bottomTitleRow
              }
            >
              <Text
                style={
                  styles.smallTitle
                }
              >
                Food Details:
              </Text>

              <Text
                style={
                  styles.smallTitle
                }
              >
                Next Feeding:
              </Text>
            </View>

            <View
              style={
                styles.bottomCards
              }
            >
              <View
                style={
                  styles.foodCard
                }
              >
                <Text
                  style={
                    styles.foodTitle
                  }
                >
                  🍚 Feeding
                </Text>

                <Text
                  style={
                    styles.foodDetail
                  }
                >
                  {
                    feedingInstructions
                  }
                </Text>

                {nextFeeding
                  ?.feeding_method ? (
                  <>
                    <Text
                      style={
                        styles.foodTitle
                      }
                    >
                      Method
                    </Text>

                    <Text
                      style={
                        styles.foodDetail
                      }
                    >
                      ▪{' '}
                      {capitalize(
                        nextFeeding
                          .feeding_method
                      )}
                    </Text>
                  </>
                ) : null}

                {nextFeeding
                  ?.portion_grams ? (
                  <>
                    <Text
                      style={
                        styles.foodTitle
                      }
                    >
                      🍗 Portion
                    </Text>

                    <Text
                      style={
                        styles.foodDetail
                      }
                    >
                      ▪{' '}
                      {
                        nextFeeding
                          .portion_grams
                      }
                      g
                    </Text>
                  </>
                ) : null}

                {nextFeeding
                  ?.compartment_number ? (
                  <>
                    <Text
                      style={
                        styles.foodTitle
                      }
                    >
                      Chamber
                    </Text>

                    <Text
                      style={
                        styles.foodDetail
                      }
                    >
                      ▪{' '}
                      {
                        nextFeeding
                          .compartment_number
                      }
                    </Text>
                  </>
                ) : null}
              </View>

              <View
                style={
                  styles.feedCard
                }
              >
                <Text
                  style={
                    styles.dinnerText
                  }
                >
                  {
                    nextMealLabel
                  }
                </Text>

                <Text
                  style={
                    styles.timeBig
                  }
                >
                  {
                    nextFeedingTime
                      .time
                  }
                </Text>

                <Text
                  style={
                    styles.pmText
                  }
                >
                  {
                    nextFeedingTime
                      .period
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  icon:
    React.ComponentProps<
      typeof Ionicons
    >['name'];
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
          backgroundColor:
            color,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#FFFFFF"
      />

      <Text
        style={
          styles.cardText
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function getOwnerDisplayName(
  email?: string | null
) {
  if (!email) {
    return 'Pet Owner';
  }

  const localPart =
    email
      .split('@')[0]
      .replace(
        /[._-]+/g,
        ' '
      )
      .trim();

  if (!localPart) {
    return 'Pet Owner';
  }

  return localPart
    .split(' ')
    .filter(Boolean)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part.slice(1)
    )
    .join(' ');
}

function getLocalDateKey(
  date: Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}-${day}`;
}

function formatTime(
  value: string
) {
  const date =
    new Date(value);

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
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }
  );
}

function formatTimeParts(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return {
      time: '--:--',
      period: '',
    };
  }

  const formatted =
    date.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );

  const parts =
    formatted
      .trim()
      .split(/\s+/);

  return {
    time:
      parts[0] ??
      '--:--',

    period:
      parts[1] ??
      '',
  };
}

function getMealPeriod(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Meal';
  }

  const hour =
    date.getHours();

  if (hour < 11) {
    return 'Breakfast';
  }

  if (hour < 16) {
    return 'Lunch';
  }

  return 'Dinner';
}

function capitalize(
  value: string
) {
  if (!value) {
    return '';
  }

  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}