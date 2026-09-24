import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../HomeScreen';
import Pets from '../Pets';
import CameraScreen from '../CameraScreen';
import FeedingLogsScreen from '../FeedingLogsScreen';
import ProfileScreen from '../ProfileScreen';
import { colors } from '../../lib/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, outline, focused }: { name: any; outline: any; focused: boolean }) {
  return (
    <View style={{
      width: 42,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? colors.primarySoft : 'transparent',
    }}>
      <Ionicons
        name={focused ? name : outline}
        size={22}
        color={focused ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

export default function Nav({ route }: any) {
  const sharedParams = route?.params?.params ?? route?.params ?? {};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          height: 66,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={sharedParams}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" outline="home-outline" focused={focused} /> }}
      />
      <Tab.Screen
        name="Pets"
        component={Pets}
        initialParams={sharedParams}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="paw" outline="paw-outline" focused={focused} /> }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        initialParams={sharedParams}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="camera" outline="camera-outline" focused={focused} /> }}
      />
      <Tab.Screen
        name="Care"
        component={FeedingLogsScreen}
        initialParams={sharedParams}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="nutrition" outline="nutrition-outline" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={sharedParams}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="person" outline="person-outline" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
