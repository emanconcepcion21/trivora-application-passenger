import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.successContainer}>

        <Ionicons
          name="checkmark-circle"
          size={120}
          color={COLORS.success}
        />

        <Text style={styles.title}>
          Booking Confirmed!
        </Text>

        <Text style={styles.subtitle}>
          Your booking has been accepted.
        </Text>

      </View>

      <View style={styles.card}>

        {/* DRIVER */}

        <View style={styles.row}>

          <Ionicons
            name="person"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.text}>
            Driver: Juan Dela Cruz
          </Text>

        </View>

        {/* TRICYCLE */}

        <View style={styles.row}>

          <Image
            source={require('../assets/tricycle.png')}
            style={styles.tricycleIcon}
          />

          <Text style={styles.text}>
            Tricycle No: TRI-0456
          </Text>

        </View>

        {/* ETA */}

        <View style={styles.row}>

          <Ionicons
            name="time"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.text}>
            ETA: 5 Minutes
          </Text>

        </View>

        {/* FARE */}

        <View style={styles.row}>

          <Ionicons
            name="cash"
            size={22}
            color={COLORS.success}
          />

          <Text style={styles.text}>
            Estimated Fare: ₱25
          </Text>

        </View>

      </View>

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => navigation.navigate('DriverDetails')}
      >

        <Ionicons
          name="navigate"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          TRACK RIDE
        </Text>

      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },

  successContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },

  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,

    elevation: 5,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  tricycleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 15,
  },

  text: {
    fontSize: 17,
    color: COLORS.black,
    fontWeight: '600',
  },

  trackButton: {
    marginTop: 35,
    height: 58,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

});