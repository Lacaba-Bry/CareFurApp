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

import { supabase } from './lib/supabase';

// AUTH SCREENS
import WelcomeScreen from './Login/WelcomeScreen';
import LoginScreen from './Login/LoginScreen';
import SignUpScreen from './Login/SignupScreen';

// MAIN NAVIGATION
import Nav from './Login/Nav/BottomNav';

// OTHER STACK SCREENS
import EditProfileScreen from './Login/EditProfileScreen';
import BoardingDetails from './Login/BoardingDetails';
import Rooms from './Login/Rooms';
import BookingHistory from './Login/BookingHistory';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0B6E71"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {session ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={Nav}
            />

            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
            />

            <Stack.Screen
              name="BoardingDetails"
              component={BoardingDetails}
            />

            <Stack.Screen
              name="Rooms"
              component={Rooms}
            />

            <Stack.Screen
              name="BookingHistory"
              component={BookingHistory}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
            />

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
  },
});