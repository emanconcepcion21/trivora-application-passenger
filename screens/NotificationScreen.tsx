import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import COLORS from '../theme/colors';

const notifications = [
  {
    id: '1',
    title: 'Driver Accepted',
    message: 'Juan Dela Cruz accepted your booking.',
    time: '2 mins ago',
  },
  {
    id: '2',
    title: 'Driver Arrived',
    message: 'Your driver has arrived at your pickup location.',
    time: '10 mins ago',
  },
  {
    id: '3',
    title: 'Trip Completed',
    message: 'Thank you for riding with TRIVORA.',
    time: 'Yesterday',
  },
  {
    id: '4',
    title: 'Rate Your Driver',
    message: 'Please leave a rating for your recent trip.',
    time: 'Yesterday',
  },
];

export default function NotificationScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Notifications
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.iconContainer}>

              <Image
                source={require('../assets/tricycle.png')}
                style={styles.tricycle}
              />

            </View>

            <View style={styles.info}>

              <Text style={styles.heading}>
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    alignItems: 'center',
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tricycle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  message: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },

  time: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
});