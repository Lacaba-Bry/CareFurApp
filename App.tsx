import React, {
  useEffect,
  useState,
} from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  Session,
} from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from './lib/supabase';

// SPLASH
import AnimatedSplash from './Login/AnimatedSplash';

// AUTH
import WelcomeScreen from './Login/WelcomeScreen';
import LoginScreen from './Login/LoginScreen';
import SignUpScreen from './Login/SignupScreen';

// BOARDING CODE
import CodeScreen from './Login/CodeScreen';

// CHAT
import ChatScreen from './Login/ChatScreen';

// MAIN NAV
import Nav from './Login/Nav/BottomNav';

// OTHER SCREENS
import EditProfileScreen from './Login/EditProfileScreen';
import BoardingDetails from './Login/BoardingDetails';
import Rooms from './Login/Rooms';
import BookingHistory from './Login/BookingHistory';
import PetProfile from './Login/PetProfile';

const Stack =
  createNativeStackNavigator();

const BOARDING_CODE_STORAGE_KEY =
  'boarding_access_code';

export default function App() {
  const [
    session,
    setSession,
  ] =
    useState<Session | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    showSplash,
    setShowSplash,
  ] =
    useState(true);

  const [
    savedBoardingData,
    setSavedBoardingData,
  ] =
    useState<any>(null);

  const [
    hasSavedBoarding,
    setHasSavedBoarding,
  ] =
    useState(false);

  // ============================================================
  // APP STARTUP
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const initializeApp =
      async () => {
        try {
          // ====================================================
          // LOAD SUPABASE SESSION
          // ====================================================

          const {
            data: {
              session,
            },
            error:
              sessionError,
          } =
            await supabase.auth.getSession();

          if (
            sessionError
          ) {
            console.error(
              'Session load error:',
              sessionError
            );
          }

          if (
            mounted
          ) {
            setSession(
              session
            );
          }

          // ====================================================
          // LOAD SAVED BOARDING CODE
          // ====================================================

          const savedCode =
            await AsyncStorage.getItem(
              BOARDING_CODE_STORAGE_KEY
            );

          if (
            !savedCode
          ) {
            if (
              mounted
            ) {
              setHasSavedBoarding(
                false
              );
            }

            return;
          }

          console.log(
            'Saved boarding code found.'
          );

          // ====================================================
          // VERIFY SAVED CODE AGAIN
          // ====================================================

          const {
            data,
            error,
          } =
            await supabase.functions.invoke(
              'verify-booking-code',
              {
                body: {
                  code:
                    savedCode,
                },
              }
            );

          if (
            error ||
            !data ||
            data.error ||
            !data.booking
          ) {
            console.log(
              'Saved boarding code is no longer valid.'
            );

            await AsyncStorage.removeItem(
              BOARDING_CODE_STORAGE_KEY
            );

            if (
              mounted
            ) {
              setSavedBoardingData(
                null
              );

              setHasSavedBoarding(
                false
              );
            }

            return;
          }

          // ====================================================
          // SAVED CODE STILL VALID
          // ====================================================

          if (
            mounted
          ) {
            setSavedBoardingData({
              accessCode:
                savedCode,

              bookingId:
                data.booking
                  .id,

              boardingId:
                data.booking
                  .id,

              booking:
                data.booking,

              pet:
                data.pet ??
                null,

              room:
                data.room ??
                null,

              feedingSchedules:
                data.feedingSchedules ??
                [],

              access:
                data.access ??
                null,

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
            });

            setHasSavedBoarding(
              true
            );
          }
        } catch (
          error
        ) {
          console.error(
            'App initialization error:',
            error
          );
        } finally {
          if (
            mounted
          ) {
            setLoading(
              false
            );
          }
        }
      };

    initializeApp();

    // ============================================================
    // AUTH STATE LISTENER
    // ============================================================

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          currentSession
        ) => {
          if (
            mounted
          ) {
            setSession(
              currentSession
            );
          }
        }
      );

    return () => {
      mounted =
        false;

      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // SPLASH
  // ============================================================

  if (
    showSplash
  ) {
    return (
      <AnimatedSplash
        onFinish={() =>
          setShowSplash(
            false
          )
        }
      />
    );
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (
    loading
  ) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#14646B"
        />
      </View>
    );
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown:
            false,
        }}
        initialRouteName={
          hasSavedBoarding
            ? 'MainTabs'
            : session
            ? 'Code'
            : 'Welcome'
        }
      >
        {/* ================================================= */}
        {/* WELCOME */}
        {/* ================================================= */}

        <Stack.Screen
          name="Welcome"
          component={
            WelcomeScreen
          }
        />

        {/* ================================================= */}
        {/* LOGIN */}
        {/* ================================================= */}

        <Stack.Screen
          name="Login"
          component={
            LoginScreen
          }
        />

        {/* ================================================= */}
        {/* SIGN UP */}
        {/* ================================================= */}

        <Stack.Screen
          name="SignUp"
          component={
            SignUpScreen
          }
        />

        {/* ================================================= */}
        {/* BOARDING CODE */}
        {/* ================================================= */}

        <Stack.Screen
          name="Code"
          component={
            CodeScreen
          }
        />

        {/* ================================================= */}
        {/* MAIN TABS */}
        {/* ================================================= */}

        <Stack.Screen
          name="MainTabs"
          component={
            Nav
          }
          initialParams={
            hasSavedBoarding
              ? {
                  screen:
                    'Home',

                  params:
                    savedBoardingData,
                }
              : undefined
          }
        />

        {/* ================================================= */}
        {/* CHAT */}
        {/* ================================================= */}

        <Stack.Screen
          name="Chat"
          component={
            ChatScreen
          }
        />

        {/* ================================================= */}
        {/* OTHER SCREENS */}
        {/* ================================================= */}

        <Stack.Screen
          name="EditProfile"
          component={
            EditProfileScreen
          }
        />

        <Stack.Screen
          name="BoardingDetails"
          component={
            BoardingDetails
          }
        />

        <Stack.Screen
          name="Rooms"
          component={
            Rooms
          }
        />

        <Stack.Screen
          name="BookingHistory"
          component={
            BookingHistory
          }
        />

        <Stack.Screen
          name="PetProfile"
          component={PetProfile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles =
  StyleSheet.create({
    loadingContainer: {
      flex: 1,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        '#FFFDF8',
    },
  });