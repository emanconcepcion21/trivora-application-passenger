import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MapScreen from '../screens/MapScreen';

import BottomTabs from './BottomTabs';

import BookingScreen from '../screens/BookingScreen';
import TrackingScreen from '../screens/TrackingScreen';
import DriverDetailsScreen from '../screens/DriverDetailsScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import TripSummaryScreen from '../screens/TripSummaryScreen';
import RateDriverScreen from '../screens/RateDriverScreen';
import SearchingDriverScreen from '../screens/SearchingDriverScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      {/* Authentication */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      {/* Main Application */}
      <Stack.Screen
        name="Main"
        component={BottomTabs}
      />

      {/* Map */}
      <Stack.Screen
        name="Map"
        component={MapScreen}
      />

      {/* Booking */}
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
      />

      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
      />

      <Stack.Screen
        name="Tracking"
        component={TrackingScreen}
      />

      <Stack.Screen
        name="DriverDetails"
        component={DriverDetailsScreen}
      />

      <Stack.Screen
        name="TripSummary"
        component={TripSummaryScreen}
      />

      <Stack.Screen
        name="RateDriver"
        component={RateDriverScreen}
      />
      <Stack.Screen
  name="SearchingDriver"
  component={SearchingDriverScreen}
/>
    </Stack.Navigator>
  );
}