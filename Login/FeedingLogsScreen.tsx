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

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  supabase,
} from '../lib/supabase';

import styles from '../assets/css/FeedingStyles';

// ============================================================
// TYPES
// ============================================================

type Pet = {
  id: string;

  name?: string | null;

  species?: string | null;

  breed?: string | null;

  sex?: string | null;

  photo_url?: string | null;

  feeding_notes?: string | null;
};

type Booking = {
  id: string;

  booking_code?: string | null;

  pet_id?: string | null;

  room_id?: string | null;

  status?: string | null;

  check_in_at?: string | null;

  expected_check_out_at?: string | null;

  special_instructions?: string | null;
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

type FilterType =
  | 'all'
  | 'completed'
  | 'scheduled';

// ============================================================
// FEEDING LOGS SCREEN
// ============================================================

export default function FeedingLogsScreen({
  navigation,
  route,
}: any) {
  const routeParams =
    route?.params ?? {};

  // ==========================================================
  // DATA PASSED FROM CODESCREEN / BOTTOMNAV
  // ==========================================================

  const [
    booking,
    setBooking,
  ] =
    useState<Booking | null>(
      routeParams.booking ??
        null
    );

  const [
    pet,
    setPet,
  ] =
    useState<Pet | null>(
      routeParams.pet ??
        null
    );

  const [
    feedingSchedules,
    setFeedingSchedules,
  ] =
    useState<
      FeedingSchedule[]
    >(
      routeParams
        .feedingSchedules ??
        []
    );

  const [
    filter,
    setFilter,
  ] =
    useState<FilterType>(
      'all'
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const accessCode =
    routeParams
      .accessCode ??
    '';

  // ==========================================================
  // FETCH FRESH BOARDING DATA
  // ==========================================================

  const loadFeedingData =
    useCallback(
      async () => {
        if (
          !accessCode
        ) {
          return;
        }

        try {
          setError(null);

          const {
            data,
            error:
              functionError,
          } =
            await supabase
              .functions
              .invoke(
                'verify-booking-code',
                {
                  body: {
                    code:
                      accessCode,
                  },
                }
              );

          if (
            functionError
          ) {
            console.error(
              'Feeding verify function error:',
              functionError
            );

            throw new Error(
              functionError
                .message ||
                'Unable to load feeding information.'
            );
          }

          if (
            !data
          ) {
            throw new Error(
              'No response was received from Supabase.'
            );
          }

          if (
            data.error
          ) {
            throw new Error(
              data.error
            );
          }

          if (
            data.booking
          ) {
            setBooking(
              data.booking
            );
          }

          if (
            data.pet
          ) {
            setPet(
              data.pet
            );
          }

          setFeedingSchedules(
            data
              .feedingSchedules ??
              []
          );

          console.log(
            'FEEDING DATA LOADED'
          );

          console.log(
            'Pet:',
            data.pet
          );

          console.log(
            'Feeding schedules:',
            data
              .feedingSchedules
          );
        } catch (
          err: any
        ) {
          console.error(
            'FeedingLogs load error:',
            err
          );

          setError(
            err?.message ||
              'Unable to load feeding logs.'
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      [
        accessCode,
      ]
    );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    /*
     * If CodeScreen already passed data,
     * show it immediately.
     *
     * Then refresh from the Edge Function.
     */

    if (
      feedingSchedules
        .length === 0
    ) {
      setLoading(
        true
      );
    }

    loadFeedingData();
  }, []);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh =
    () => {
      setRefreshing(
        true
      );

      loadFeedingData();
    };

  // ==========================================================
  // PET VALUES
  // ==========================================================

  const petName =
    pet?.name ||
    'Your Pet';

  const species =
    capitalize(
      pet?.species ||
        'Pet'
    );

  const breed =
    pet?.breed ||
    'Unknown Breed';

  const sex =
    capitalize(
      pet?.sex ||
        'Unknown'
    );

  // ==========================================================
  // TODAY
  // ==========================================================

  const todayKey =
    getLocalDateKey(
      new Date()
    );

  const todaySchedules =
    useMemo(
      () => {
        return feedingSchedules
          .filter(
            (
              schedule
            ) => {
              return (
                getLocalDateKey(
                  new Date(
                    schedule
                      .scheduled_at
                  )
                ) ===
                todayKey
              );
            }
          )
          .sort(
            (
              a,
              b
            ) =>
              new Date(
                a
                  .scheduled_at
              ).getTime() -
              new Date(
                b
                  .scheduled_at
              ).getTime()
          );
      },
      [
        feedingSchedules,
        todayKey,
      ]
    );

  // ==========================================================
  // FILTERED SCHEDULES
  // ==========================================================

  const filteredSchedules =
    useMemo(
      () => {
        if (
          filter ===
          'completed'
        ) {
          return todaySchedules.filter(
            (
              schedule
            ) =>
              normalizeStatus(
                schedule
                  .status
              ) ===
              'completed'
          );
        }

        if (
          filter ===
          'scheduled'
        ) {
          return todaySchedules.filter(
            (
              schedule
            ) => {
              const status =
                normalizeStatus(
                  schedule
                    .status
                );

              return (
                status !==
                  'completed' &&
                status !==
                  'cancelled' &&
                status !==
                  'canceled'
              );
            }
          );
        }

        return todaySchedules;
      },
      [
        todaySchedules,
        filter,
      ]
    );

  // ==========================================================
  // MEAL STATUS
  // ==========================================================

  const breakfast =
    findMeal(
      todaySchedules,
      'Breakfast'
    );

  const lunch =
    findMeal(
      todaySchedules,
      'Lunch'
    );

  const dinner =
    findMeal(
      todaySchedules,
      'Dinner'
    );

  // ==========================================================
  // PET IMAGE
  // ==========================================================

  const petImageSource =
    pet?.photo_url
      ? {
          uri:
            pet.photo_url,
        }
      : require(
          '../assets/Login/Logo.jpg'
        );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    feedingSchedules
      .length === 0
  ) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={{
            flex: 1,

            justifyContent:
              'center',

            alignItems:
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
            Loading feeding
            logs...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // SCREEN
  // ==========================================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
          />
        }
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            onPress={() => {
              if (
                navigation
                  ?.canGoBack?.()
              ) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#111"
            />
          </TouchableOpacity>

          <Text
            style={
              styles.title
            }
          >
            Feeding Logs
          </Text>

          <TouchableOpacity>
            <Ionicons
              name="options-outline"
              size={24}
              color="#111"
            />
          </TouchableOpacity>
        </View>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error ? (
          <Text
            style={{
              color:
                '#D06435',

              fontSize: 12,

              marginHorizontal:
                20,

              marginBottom:
                10,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* ================================================= */}
        {/* PET CARD */}
        {/* ================================================= */}

        <View
          style={
            styles.petCard
          }
        >
          <View
            style={
              styles.petTopRow
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
                  styles.infoRow
                }
              >
                <Text
                  style={
                    styles.info
                  }
                >
                  🐾 {species}
                </Text>

                <Text
                  style={
                    styles.infoDot
                  }
                >
                  ●
                </Text>

                <Text
                  style={
                    styles.info
                  }
                >
                  {breed}
                </Text>

                <Text
                  style={
                    styles.infoDot
                  }
                >
                  ●
                </Text>

                <Text
                  style={
                    styles.info
                  }
                >
                  {sex}
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-down"
              size={22}
              color="#111"
            />
          </View>

          {/* =============================================== */}
          {/* MEALS TODAY */}
          {/* =============================================== */}

          <View
            style={
              styles.mealsInsideCard
            }
          >
            <Text
              style={
                styles.mealsTitle
              }
            >
              🍽 Meals Today
            </Text>

            <View
              style={
                styles.mealStatus
              }
            >
              <MealStatusText
                label="Breakfast"
                schedule={
                  breakfast
                }
              />

              <MealStatusText
                label="Lunch"
                schedule={
                  lunch
                }
              />

              <MealStatusText
                label="Dinner"
                schedule={
                  dinner
                }
              />
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* DATE */}
        {/* ================================================= */}

        <View
          style={
            styles.dateRow
          }
        >
          <Text
            style={
              styles.date
            }
          >
            Today,{' '}
            {formatDate(
              new Date()
            )}
          </Text>

          <Ionicons
            name="calendar-outline"
            size={20}
            color="#111"
          />
        </View>

        {/* ================================================= */}
        {/* FILTER */}
        {/* ================================================= */}

        <View
          style={
            styles.filter
          }
        >
          <TouchableOpacity
            style={
              filter ===
              'all'
                ? styles.filterActive
                : styles.filterItem
            }
            onPress={() =>
              setFilter(
                'all'
              )
            }
          >
            <Text
              style={
                filter ===
                'all'
                  ? styles.filterActiveText
                  : styles.filterText
              }
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              filter ===
              'completed'
                ? styles.filterActive
                : styles.filterItem
            }
            onPress={() =>
              setFilter(
                'completed'
              )
            }
          >
            <Text
              style={
                filter ===
                'completed'
                  ? styles.filterActiveText
                  : styles.filterText
              }
            >
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              filter ===
              'scheduled'
                ? styles.filterActive
                : styles.filterItem
            }
            onPress={() =>
              setFilter(
                'scheduled'
              )
            }
          >
            <Text
              style={
                filter ===
                'scheduled'
                  ? styles.filterActiveText
                  : styles.filterText
              }
            >
              Scheduled
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================= */}
        {/* FEEDING LOGS */}
        {/* ================================================= */}

        {filteredSchedules
          .length === 0 ? (
          <View
            style={{
              paddingVertical:
                30,

              alignItems:
                'center',
            }}
          >
            <Ionicons
              name="restaurant-outline"
              size={35}
              color="#999"
            />

            <Text
              style={{
                marginTop:
                  8,

                color:
                  '#777',

                fontSize:
                  13,
              }}
            >
              No feeding logs
              found.
            </Text>
          </View>
        ) : (
          filteredSchedules.map(
            (
              schedule
            ) => {
              const meal =
                getMealPeriod(
                  schedule
                    .scheduled_at
                );

              const status =
                normalizeStatus(
                  schedule
                    .status
                );

              const completed =
                status ===
                'completed';

              const items =
                buildFeedingItems(
                  schedule
                );

              return (
                <FoodLog
                  key={
                    schedule.id
                  }
                  color={
                    getMealColor(
                      meal
                    )
                  }
                  time={`${formatTime(
                    schedule
                      .scheduled_at
                  )} — ${meal}`}
                  status={
                    completed
                      ? '✓'
                      : '⌛'
                  }
                  items={
                    items
                  }
                  compact={
                    !completed &&
                    items
                      .length ===
                      0
                  }
                />
              );
            }
          )
        )}

        <View
          style={{
            height:
              20,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// MEAL STATUS
// ============================================================

function MealStatusText({
  label,
  schedule,
}: {
  label: string;

  schedule:
    | FeedingSchedule
    | null;
}) {
  if (
    !schedule
  ) {
    return (
      <Text>
        — {label}
      </Text>
    );
  }

  const status =
    normalizeStatus(
      schedule.status
    );

  if (
    status ===
    'completed'
  ) {
    return (
      <Text
        style={
          styles.completed
        }
      >
        ✓ {label}
      </Text>
    );
  }

  return (
    <Text
      style={
        styles.pending
      }
    >
      ⌛ {label}
    </Text>
  );
}

// ============================================================
// FOOD LOG
// ============================================================

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
    <View
      style={[
        styles.log,

        {
          backgroundColor:
            color,
        },
      ]}
    >
      <View
        style={
          styles.logHeader
        }
      >
        <Text
          style={
            styles.time
          }
        >
          {time}
        </Text>

        <Text
          style={
            styles.status
          }
        >
          {status}
        </Text>
      </View>

      {!compact && (
        <>
          {items?.map(
            (
              item,
              index
            ) => (
              <View
                key={
                  `${item}-${index}`
                }
                style={
                  styles.itemRow
                }
              >
                <View
                  style={
                    styles.bullet
                  }
                />

                <Text
                  style={
                    styles.item
                  }
                >
                  {item}
                </Text>
              </View>
            )
          )}

          {/*
            Keep your button design.

            Your current feeding_schedules schema
            doesn't include a feeding photo URL yet,
            so the button is visual only for now.
          */}

          <TouchableOpacity
            style={
              styles.photoBtn
            }
          >
            <Text
              style={
                styles.photoText
              }
            >
              View Feeding
              Details →
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ============================================================
// BUILD FEEDING DETAILS
// ============================================================

function buildFeedingItems(
  schedule:
    FeedingSchedule
) {
  const items:
    string[] = [];

  if (
    schedule
      .feeding_method
  ) {
    items.push(
      `Method: ${capitalize(
        schedule
          .feeding_method
      )}`
    );
  }

  if (
    schedule
      .instructions
  ) {
    items.push(
      `Instructions: ${schedule.instructions}`
    );
  }

  if (
    schedule
      .portion_grams
  ) {
    items.push(
      `Portion: ${schedule.portion_grams} g`
    );
  }

  if (
    schedule
      .compartment_number
  ) {
    items.push(
      `Feeder Chamber: ${schedule.compartment_number}`
    );
  }

  const status =
    normalizeStatus(
      schedule.status
    );

  items.push(
    `Status: ${capitalize(
      status
    )}`
  );

  return items;
}

// ============================================================
// FIND BREAKFAST / LUNCH / DINNER
// ============================================================

function findMeal(
  schedules:
    FeedingSchedule[],

  mealName:
    string
) {
  return (
    schedules.find(
      (
        schedule
      ) =>
        getMealPeriod(
          schedule
            .scheduled_at
        ) === mealName
    ) ?? null
  );
}

// ============================================================
// MEAL COLORS
// ============================================================

function getMealColor(
  meal:
    string
) {
  if (
    meal ===
    'Breakfast'
  ) {
    return '#55B8C5';
  }

  if (
    meal ===
    'Lunch'
  ) {
    return '#F49B7D';
  }

  return '#C9B47C';
}

// ============================================================
// MEAL PERIOD
// ============================================================

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

// ============================================================
// FORMAT TIME
// ============================================================

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

  return date
    .toLocaleTimeString(
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

// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
  date:
    Date
) {
  return date
    .toLocaleDateString(
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

// ============================================================
// LOCAL DATE KEY
// ============================================================

function getLocalDateKey(
  date:
    Date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1
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

// ============================================================
// STATUS
// ============================================================

function normalizeStatus(
  value:
    string |
    null |
    undefined
) {
  return String(
    value || 'pending'
  )
    .trim()
    .toLowerCase();
}

// ============================================================
// CAPITALIZE
// ============================================================

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