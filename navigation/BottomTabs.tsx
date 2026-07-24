import React from 'react';
import {
  useRoute,
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  // GET PASSENGER DATA FROM LOGIN
  const route = useRoute<any>();

  const passenger = route.params?.passenger;

  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor:
          COLORS.primary,

        tabBarInactiveTintColor:
          COLORS.gray,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarIcon: ({
          color,
          size,
        }) => {

          let iconName: any;

          switch (route.name) {

            case 'Home':

              iconName = 'home';

              break;

            case 'History':

              iconName = 'time';

              break;

            case 'Notifications':

              iconName = 'notifications';

              break;

            case 'Profile':

              iconName = 'person';

              break;

            default:

              iconName = 'ellipse';

          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );

        },

      })}

    >

      {/* HOME */}

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* RIDE HISTORY */}

      <Tab.Screen
        name="History"
        component={RideHistoryScreen}
      />

      {/* NOTIFICATIONS */}

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
      />

      {/* PROFILE */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{
          passenger: passenger,
        }}
      />

    </Tab.Navigator>
  );
}