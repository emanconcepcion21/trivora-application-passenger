import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function QuickServices() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Quick Services
      </Text>

      <View style={styles.grid}>

        {/* BOOK RIDE */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Booking')}
        >
          <View style={styles.iconCircle}>

            <Image
              source={require('../assets/tricycle.png')}
              style={styles.tricycleIcon}
            />

          </View>

          <Text style={styles.text}>
            Book Ride
          </Text>
        </TouchableOpacity>

        {/* TRACK RIDE */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Tracking')}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="navigate"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.text}>
            Track Ride
          </Text>
        </TouchableOpacity>

        {/* NOTIFICATIONS */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="notifications"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.text}>
            Notifications
          </Text>
        </TouchableOpacity>

        {/* PROFILE */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="person"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.text}>
            Profile
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  tricycleIcon: {
    width: 34,
    height: 34,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },

  text: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },

});