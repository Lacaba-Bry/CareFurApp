import React, {
  useCallback,
  useState,
} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';

import { useFocusEffect } from '@react-navigation/native';

import { supabase } from '../lib/supabase';

import styles from '../assets/css/PetsStyles';

// ============================================================
// TYPES
// ============================================================

type Pet = {
  id?: string | null;
  name?: string | null;
  species?: string | null;
  breed?: string | null;

  sex?:
    | 'male'
    | 'female'
    | 'unknown'
    | null;

  birth_date?: string | null;

  weight_kg?:
    | number
    | string
    | null;

  allergies?: string | null;
  medical_notes?: string | null;
  feeding_notes?: string | null;
  photo_url?: string | null;
};

type Booking = {
  id?: string | null;
  pet_id?: string | null;
  room_id?: string | null;

  check_in_at?: string | null;

  expected_check_out_at?:
    | string
    | null;

  actual_check_out_at?:
    | string
    | null;

  status?:
    | 'pending'
    | 'checked_in'
    | 'checked_out'
    | 'cancelled'
    | string
    | null;
};

// ============================================================
// PETS SCREEN
// ============================================================

export default function Pets({
  navigation,
  route,
}: any) {
  const [fontsLoaded] =
    useFonts({
      DancingScript_700Bold,
    });

  const routeParams =
    route?.params ?? {};

  // Data already passed from CodeScreen / BottomNav
  const [pet, setPet] =
    useState<Pet | null>(
      routeParams.pet ??
        null
    );

  const [
    booking,
    setBooking,
  ] =
    useState<Booking | null>(
      routeParams.booking ??
        null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const accessCode =
    routeParams.accessCode ??
    '';

  // ============================================================
  // LOAD REAL PET FROM BOARDING CODE
  // ============================================================

  const loadPet =
    useCallback(
      async (
        isRefresh = false
      ) => {
        try {
          if (
            isRefresh
          ) {
            setRefreshing(
              true
            );
          } else {
            setLoading(
              true
            );
          }

          setError(null);

          /*
           * If no access code exists,
           * still use the pet that was
           * already passed through navigation.
           */
          if (
            !accessCode
          ) {
            if (!pet) {
              setError(
                'No active boarding pet was found.'
              );
            }

            return;
          }

          const {
            data,
            error:
              functionError,
          } =
            await supabase.functions.invoke(
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
              'Pets verify-booking-code error:',
              functionError
            );

            throw new Error(
              functionError.message ||
                'Unable to load pet information.'
            );
          }

          if (!data) {
            throw new Error(
              'No response received from the server.'
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
            !data.booking
          ) {
            throw new Error(
              'No active boarding booking was found.'
            );
          }

          // REAL BOOKING
          setBooking(
            data.booking
          );

          // REAL PET CONNECTED TO BOOKING
          setPet(
            data.pet ??
              null
          );

          if (
            !data.pet
          ) {
            setError(
              'No pet is connected to this boarding stay.'
            );
          }

          console.log(
            'PETS SCREEN DATA'
          );

          console.log(
            'Pet:',
            data.pet
          );

          console.log(
            'Booking:',
            data.booking
          );
        } catch (
          err: any
        ) {
          console.error(
            'Pets load error:',
            err
          );

          setError(
            err?.message ||
              'Unable to load your pet.'
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
        pet,
      ]
    );

  // ============================================================
  // REFRESH WHEN PETS TAB OPENS
  // ============================================================

  useFocusEffect(
    useCallback(() => {
      loadPet();

      return undefined;
    }, [loadPet])
  );

  // ============================================================
  // HELPERS
  // ============================================================

  const getPetImage = (
    photoUrl?:
      string |
      null
  ) => {
    if (
      photoUrl &&
      photoUrl.trim()
    ) {
      return {
        uri: photoUrl,
      };
    }

    return require('../assets/Login/DogProfile.jpg');
  };

  const getWeightText = () => {
    if (
      pet?.weight_kg ===
        null ||
      pet?.weight_kg ===
        undefined ||
      pet?.weight_kg === ''
    ) {
      return 'Weight not set';
    }

    return `${pet.weight_kg} kg`;
  };

  // ============================================================
  // FONT LOADING
  // ============================================================

  if (!fontsLoaded) {
    return null;
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
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color="#153F43"
          />
        </TouchableOpacity>

        <Text
          style={styles.title}
        >
          Pets
        </Text>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <ScrollView
        style={
          styles.scrollView
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() =>
              loadPet(true)
            }
            tintColor="#14646B"
            colors={[
              '#14646B',
            ]}
          />
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Your Pet
        </Text>

        <Text
          style={
            styles.sectionSubtitle
          }
        >
          View your pet and
          current boarding
          status
        </Text>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading &&
        !pet ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color="#14646B"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading your
              pet...
            </Text>
          </View>
        ) : null}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading &&
        error &&
        !pet ? (
          <View
            style={
              styles.emptyCard
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Ionicons
                name="paw-outline"
                size={32}
                color="#14646B"
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No pet found
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              {error}
            </Text>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={() =>
                loadPet()
              }
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.retryText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ================================================= */}
        {/* REAL PET */}
        {/* ================================================= */}

        {pet ? (
          <PetCard
            name={
              pet.name ||
              'Pet'
            }
            image={getPetImage(
              pet.photo_url
            )}
            gender={
              pet.sex ??
              'unknown'
            }
            weight={getWeightText()}
            breed={
              pet.breed ??
              null
            }
            species={
              pet.species ??
              null
            }
            bookingStatus={
              booking?.status ??
              null
            }
            checkInDate={
              booking?.check_in_at ??
              null
            }
            checkOutDate={
              booking
                ?.actual_check_out_at ??
              booking
                ?.expected_check_out_at ??
              null
            }
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// PET CARD
// ============================================================

function PetCard({
  name,
  image,
  gender,
  weight,
  breed,
  species,
  bookingStatus,
  checkInDate,
  checkOutDate,
}: {
  name: string;
  image: any;

  gender:
    | 'male'
    | 'female'
    | 'unknown';

  weight: string;

  breed?:
    | string
    | null;

  species?:
    | string
    | null;

  bookingStatus?:
    | string
    | null;

  checkInDate?:
    | string
    | null;

  checkOutDate?:
    | string
    | null;
}) {
  // ============================================================
  // GENDER
  // ============================================================

  const genderIcon =
    gender === 'female'
      ? 'female'
      : gender === 'male'
      ? 'male'
      : 'help-circle-outline';

  const genderText =
    gender === 'female'
      ? 'Female'
      : gender === 'male'
      ? 'Male'
      : 'Unknown';

  // ============================================================
  // STATUS
  // ============================================================

  const getStatus =
    () => {
      switch (
        bookingStatus
      ) {
        case 'checked_in':
          return {
            text:
              'Currently checked in',
            color:
              '#338B4A',
            background:
              '#E8F7EC',
            dot:
              '#41AE5D',
          };

        case 'pending':
          return {
            text:
              'Upcoming stay',
            color:
              '#A56B16',
            background:
              '#FFF3D8',
            dot:
              '#E7A72E',
          };

        case 'checked_out':
          return {
            text:
              'Checked out',
            color:
              '#607477',
            background:
              '#EDF2F2',
            dot:
              '#829496',
          };

        case 'cancelled':
          return {
            text:
              'Cancelled',
            color:
              '#A74343',
            background:
              '#FBEAEA',
            dot:
              '#D45C5C',
          };

        default:
          return {
            text:
              'Boarding active',
            color:
              '#338B4A',
            background:
              '#E8F7EC',
            dot:
              '#41AE5D',
          };
      }
    };

  const status =
    getStatus();

  // ============================================================
  // DATE FORMATTER
  // ============================================================

  const formatDate = (
    value?:
      string |
      null
  ) => {
    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  return (
    <View
      style={
        styles.petCard
      }
    >
      {/* PET PHOTO */}

      <Image
        source={image}
        style={
          styles.petImage
        }
        resizeMode="cover"
      />

      {/* PET DETAILS */}

      <View
        style={
          styles.petDetails
        }
      >
        <View
          style={
            styles.petTopRow
          }
        >
          <Text
            style={
              styles.petName
            }
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        {/* GENDER + WEIGHT */}

        <View
          style={
            styles.petInfoRow
          }
        >
          <View
            style={
              styles.infoItem
            }
          >
            <Ionicons
              name={
                genderIcon as any
              }
              size={18}
              color="#14646B"
            />

            <Text
              style={
                styles.infoText
              }
            >
              {genderText}
            </Text>
          </View>

          <View
            style={
              styles.infoDivider
            }
          />

          <View
            style={
              styles.infoItem
            }
          >
            <Ionicons
              name="scale-outline"
              size={18}
              color="#14646B"
            />

            <Text
              style={
                styles.infoText
              }
            >
              {weight}
            </Text>
          </View>
        </View>

        {/* BREED */}

        {(breed ||
          species) && (
          <View
            style={
              styles.breedRow
            }
          >
            <Ionicons
              name="paw-outline"
              size={15}
              color="#7D8D8F"
            />

            <Text
              style={
                styles.breedText
              }
              numberOfLines={1}
            >
              {breed ||
                species}
            </Text>
          </View>
        )}

        {/* STATUS */}

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status.background,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  status.dot,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color:
                  status.color,
              },
            ]}
          >
            {status.text}
          </Text>
        </View>

        {/* CHECK IN */}

        {checkInDate && (
          <View
            style={
              styles.dateRow
            }
          >
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#819294"
            />

            <Text
              style={
                styles.dateLabel
              }
            >
              Check-in
            </Text>

            <Text
              style={
                styles.dateValue
              }
            >
              {formatDate(
                checkInDate
              )}
            </Text>
          </View>
        )}

        {/* CHECK OUT */}

        {bookingStatus ===
          'checked_out' &&
          checkOutDate && (
            <View
              style={
                styles.dateRow
              }
            >
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#819294"
              />

              <Text
                style={
                  styles.dateLabel
                }
              >
                Checked out
              </Text>

              <Text
                style={
                  styles.dateValue
                }
              >
                {formatDate(
                  checkOutDate
                )}
              </Text>
            </View>
          )}
      </View>
    </View>
  );
}