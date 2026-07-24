import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';

import { PassengerProvider } from '../context/PassengerContext';

export default function AppNavigator() {
  return (
    <PassengerProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </PassengerProvider>
  );
}