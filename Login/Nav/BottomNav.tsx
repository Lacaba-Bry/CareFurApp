import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../HomeScreen';
import Pets from '../Pets';
import CameraScreen from '../CameraScreen';
import FeedingLogsScreen from '../FeedingLogsScreen';
import ProfileScreen from '../ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Nav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',

        tabBarStyle: {
          backgroundColor: '#53B5C2',
          height: 58,
          borderTopWidth: 0,
          paddingTop: 5,
          paddingBottom: 5,
          elevation: 0,
        },
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home"
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* PETS */}
      <Tab.Screen
        name="Pets"
        component={Pets}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="paw"
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* CAMERA */}
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="camera"
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* CARE / FEEDING LOGS */}
      <Tab.Screen
        name="Care"
        component={FeedingLogsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="nutrition"
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person"
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}