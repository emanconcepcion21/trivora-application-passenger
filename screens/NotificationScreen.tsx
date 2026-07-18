import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const notifications = [
  {
    id: '1',
    title: 'Ride Booked',
    message: 'Your booking has been received.',
    time: 'Just now',
    color: '#2563EB',
    type: 'tricycle',
  },
  {
    id: '2',
    icon: 'person',
    title: 'Driver Assigned',
    message: 'Juan Dela Cruz accepted your ride.',
    time: '5 mins ago',
    color: '#16A34A',
  },
  {
    id: '3',
    icon: 'navigate',
    title: 'Driver Arriving',
    message: 'Driver is 2 minutes away.',
    time: '10 mins ago',
    color: '#F59E0B',
  },
  {
    id: '4',
    icon: 'checkmark-circle',
    title: 'Ride Completed',
    message: 'Thank you for using TRIVORA.',
    time: 'Yesterday',
    color: '#7C3AED',
  },
];

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>
        Notifications
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.color },
              ]}
            >

              {item.type === 'tricycle' ? (
                <Image
                  source={require('../assets/tricycle.png')}
                  style={styles.tricycleIcon}
                />
              ) : (
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color="#fff"
                />
              )}

            </View>

            <View style={styles.info}>

              <Text style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.message}>
                {item.message}
              </Text>

              <Text style={styles.time}>
                {item.time}
              </Text>

            </View>

          </View>

        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tricycleIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  message: {
    marginTop: 5,
    color: COLORS.gray,
    fontSize: 14,
  },

  time: {
    marginTop: 8,
    color: '#9CA3AF',
    fontSize: 12,
  },

});