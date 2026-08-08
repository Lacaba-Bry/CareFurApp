import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from './Login/WelcomeScreen';
import LoginScreen from './Login/LoginScreen';
import SignUpScreen from './Login/SignupScreen';

import HomeScreen from './Login/HomeScreen';
import PetProfileScreen from './Login/PetProfile';
import CameraScreen from './Login/CameraScreen';
import FeedingLogsScreen from './Login/FeedingLogsScreen';
import ProfileScreen from './Login/ProfileScreen';
import EditProfileScreen from './Login/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#53B5C2',
          height: 55,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Pets"
        component={PetProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="paw" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Care"
        component={FeedingLogsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="nutrition" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
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

        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}