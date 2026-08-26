import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  supabase,
} from '../lib/supabase';

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

export default function CodeScreen({
  navigation,
}: any) {
  const [
    accessCode,
    setAccessCode,
  ] =
    useState('');

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  // ============================================================
  // FORMAT ACCESS CODE
  // ============================================================

  const handleCodeChange =
    (
      text: string
    ) => {
      const formatted =
        text
          .replace(
            /[^a-zA-Z0-9]/g,
            ''
          )
          .toUpperCase();

      setAccessCode(
        formatted
      );
    };

  // ============================================================
  // MESSAGE
  // ============================================================

  const showMessage =
    (
      title: string,
      message: string
    ) => {
      if (
        Platform.OS ===
        'web'
      ) {
        window.alert(
          `${title}\n\n${message}`
        );

        return;
      }

      Alert.alert(
        title,
        message
      );
    };

  // ============================================================
  // READ FUNCTION ERROR
  // ============================================================

  const getFunctionErrorMessage =
    async (
      error: any
    ) => {
      let message =
        error?.message ||
        'Unable to verify your boarding code.';

      try {
        const response =
          error?.context;

        if (
          response &&
          typeof response.json ===
            'function'
        ) {
          const body =
            await response.json();

          if (
            body?.error
          ) {
            message =
              body.error;
          }
        }
      } catch (
        readError
      ) {
        console.log(
          'Unable to read function error:',
          readError
        );
      }

      return message;
    };

  // ============================================================
  // VERIFY CODE
  // ============================================================

  const handleContinue =
    async () => {
      const code =
        accessCode
          .trim()
          .toUpperCase();

      if (
        !code
      ) {
        showMessage(
          'Enter Access Code',
          'Please enter the boarding access code provided by CareFur.'
        );

        return;
      }

      if (
        code.length !==
        8
      ) {
        showMessage(
          'Invalid Code',
          'Please enter the 8-character boarding access code.'
        );

        return;
      }

      try {
        setLoading(
          true
        );

        console.log(
          'Checking boarding code:',
          code
        );

        const {
          data,
          error,
        } =
          await supabase.functions.invoke(
            'verify-booking-code',
            {
              body: {
                code,
              },
            }
          );

        // ======================================================
        // FUNCTION ERROR
        // ======================================================

        if (
          error
        ) {
          console.error(
            'Verify booking code error:',
            error
          );

          const message =
            await getFunctionErrorMessage(
              error
            );

          showMessage(
            'Access Code Error',
            message
          );

          return;
        }

        // ======================================================
        // NO RESPONSE
        // ======================================================

        if (
          !data
        ) {
          showMessage(
            'Connection Error',
            'No response was received from Supabase.'
          );

          return;
        }

        // ======================================================
        // SERVER ERROR
        // ======================================================

        if (
          data.error
        ) {
          showMessage(
            'Access Code Error',
            data.error
          );

          return;
        }

        // ======================================================
        // BOOKING REQUIRED
        // ======================================================

        if (
          !data.booking
        ) {
          showMessage(
            'Booking Not Found',
            'The booking connected to this access code could not be found.'
          );

          return;
        }

        // ======================================================
        // SAVE ACCESS CODE
        // ======================================================

        await AsyncStorage.setItem(
          BOARDING_CODE_STORAGE_KEY,
          code
        );

        console.log(
          'Boarding code saved locally.'
        );

        // ======================================================
        // DEBUG
        // ======================================================

        console.log(
          'ACCESS CODE ACCEPTED'
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

        // ======================================================
        // GO TO MAIN APP
        // ======================================================

        navigation.reset({
          index: 0,

          routes: [
            {
              name:
                'MainTabs',

              params: {
                screen:
                  'Home',

                params: {
                  // =============================================
                  // BOOKING
                  // =============================================

                  bookingId:
                    data.booking.id,

                  boardingId:
                    data.booking.id,

                  bookingCode:
                    data.booking
                      .booking_code ??
                    null,

                  bookingStatus:
                    data.booking
                      .status ??
                    null,

                  checkInAt:
                    data.booking
                      .check_in_at ??
                    null,

                  expectedCheckOutAt:
                    data.booking
                      .expected_check_out_at ??
                    null,

                  specialInstructions:
                    data.booking
                      .special_instructions ??
                    null,

                  booking:
                    data.booking,

                  // =============================================
                  // ACCESS
                  // =============================================

                  accessCode:
                    code,

                  accessId:
                    data.access
                      ?.id ??
                    null,

                  accessExpiresAt:
                    data.access
                      ?.expiresAt ??
                    null,

                  access:
                    data.access ??
                    null,

                  // =============================================
                  // OWNER
                  // =============================================

                  ownerId:
                    data.access
                      ?.ownerId ??
                    null,

                  ownerEmail:
                    data.access
                      ?.invitedEmail ??
                    null,

                  invitedEmail:
                    data.access
                      ?.invitedEmail ??
                    null,

                  // =============================================
                  // PET
                  // =============================================

                  petId:
                    data.pet
                      ?.id ??
                    data.booking
                      .pet_id ??
                    null,

                  pet:
                    data.pet ??
                    null,

                  // =============================================
                  // ROOM
                  // =============================================

                  roomId:
                    data.room
                      ?.id ??
                    data.booking
                      .room_id ??
                    null,

                  room:
                    data.room ??
                    null,

                  // =============================================
                  // FEEDING
                  // =============================================

                  feedingSchedules:
                    data.feedingSchedules ??
                    [],
                },
              },
            },
          ],
        });
      } catch (
        error: any
      ) {
        console.error(
          'CodeScreen error:',
          error
        );

        showMessage(
          'Something Went Wrong',
          error?.message ||
            'Unable to verify your boarding code.'
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  // ============================================================
  // BACK
  // ============================================================

  const handleBack =
    () => {
      if (
        navigation.canGoBack()
      ) {
        navigation.goBack();

        return;
      }

      navigation.navigate(
        'Welcome'
      );
    };

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }
      >
        <View
          style={
            styles.container
          }
        >
          {/* BACK */}

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              handleBack
            }
            activeOpacity={
              0.7
            }
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#16444A"
            />
          </TouchableOpacity>

          {/* CONTENT */}

          <View
            style={
              styles.content
            }
          >
            <View
              style={
                styles.iconContainer
              }
            >
              <Ionicons
                name="paw"
                size={42}
                color="#FFFFFF"
              />
            </View>

            <Text
              style={
                styles.title
              }
            >
              Enter Boarding Code
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Enter the access code provided by CareFur staff to view your pet&apos;s boarding information.
            </Text>

            {/* INPUT */}

            <View
              style={
                styles.inputContainer
              }
            >
              <Text
                style={
                  styles.inputLabel
                }
              >
                OWNER ACCESS CODE
              </Text>

              <TextInput
                value={
                  accessCode
                }
                onChangeText={
                  handleCodeChange
                }
                placeholder="XXXXXXXX"
                placeholderTextColor="#A5AAAA"
                autoCapitalize="characters"
                autoCorrect={
                  false
                }
                maxLength={
                  8
                }
                editable={
                  !loading
                }
                returnKeyType="done"
                onSubmitEditing={
                  handleContinue
                }
                style={
                  styles.codeInput
                }
              />
            </View>

            <Text
              style={
                styles.exampleText
              }
            >
              Example: MMLXWKKW
            </Text>

            {/* CONTINUE */}

            <TouchableOpacity
              style={[
                styles.continueButton,

                (!accessCode ||
                  loading) &&
                  styles.disabledButton,
              ]}
              onPress={
                handleContinue
              }
              disabled={
                !accessCode ||
                loading
              }
              activeOpacity={
                0.8
              }
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.continueText
                    }
                  >
                    Continue
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* HELP */}

            <View
              style={
                styles.helpContainer
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#687879"
              />

              <Text
                style={
                  styles.helpText
                }
              >
                Your access code is provided when a boarding reservation is created.
              </Text>
            </View>
          </View>

          {/* FOOTER */}

          <View
            style={
              styles.footer
            }
          >
            <Text
              style={
                styles.footerText
              }
            >
              Need help with your boarding code?
            </Text>

            <TouchableOpacity>
              <Text
                style={
                  styles.contactText
                }
              >
                Contact CareFur Staff
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        '#FFFDF8',
    },

    keyboardContainer: {
      flex: 1,
    },

    container: {
      flex: 1,

      paddingHorizontal:
        24,
    },

    backButton: {
      width: 42,

      height: 42,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop:
        12,
    },

    content: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginTop:
        -40,
    },

    iconContainer: {
      width: 82,

      height: 82,

      borderRadius:
        41,

      backgroundColor:
        '#53B5C2',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginBottom:
        24,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,

        height: 4,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        8,

      elevation:
        5,
    },

    title: {
      fontSize:
        28,

      fontWeight:
        '700',

      color:
        '#16444A',

      textAlign:
        'center',

      marginBottom:
        10,
    },

    description: {
      maxWidth:
        350,

      fontSize:
        14,

      lineHeight:
        21,

      color:
        '#687879',

      textAlign:
        'center',

      marginBottom:
        34,
    },

    inputContainer: {
      width:
        '100%',

      maxWidth:
        390,
    },

    inputLabel: {
      fontSize:
        11,

      fontWeight:
        '700',

      letterSpacing:
        1.1,

      color:
        '#16444A',

      marginBottom:
        9,
    },

    codeInput: {
      width:
        '100%',

      height:
        64,

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1.5,

      borderColor:
        '#BFD3D4',

      borderRadius:
        14,

      paddingHorizontal:
        18,

      fontSize:
        25,

      fontWeight:
        '700',

      letterSpacing:
        5,

      color:
        '#16444A',

      textAlign:
        'center',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,

        height: 2,
      },

      shadowOpacity:
        0.05,

      shadowRadius:
        4,

      elevation:
        2,
    },

    exampleText: {
      marginTop:
        9,

      marginBottom:
        25,

      fontSize:
        11,

      color:
        '#929C9D',
    },

    continueButton: {
      width:
        '100%',

      maxWidth:
        390,

      height:
        56,

      backgroundColor:
        '#16444A',

      borderRadius:
        14,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap:
        8,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,

        height: 3,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        5,

      elevation:
        4,
    },

    disabledButton: {
      opacity:
        0.55,
    },

    continueText: {
      color:
        '#FFFFFF',

      fontSize:
        15,

      fontWeight:
        '700',
    },

    helpContainer: {
      maxWidth:
        360,

      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginTop:
        26,

      paddingHorizontal:
        15,

      paddingVertical:
        13,

      borderRadius:
        12,

      backgroundColor:
        '#F1F6F5',
    },

    helpText: {
      flex:
        1,

      marginLeft:
        8,

      color:
        '#687879',

      fontSize:
        11,

      lineHeight:
        17,
    },

    footer: {
      alignItems:
        'center',

      paddingBottom:
        24,
    },

    footerText: {
      fontSize:
        11,

      color:
        '#8A9697',
    },

    contactText: {
      marginTop:
        4,

      color:
        '#D06435',

      fontSize:
        12,

      fontWeight:
        '700',
    },
  });