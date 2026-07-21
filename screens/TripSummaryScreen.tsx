import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

export default function TripSummaryScreen() {

  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const {

    destination,

    distance,

    eta,

    estimatedFare,

  } = route.params || {

    destination: 'Unknown',

    distance: '0 km',

    eta: '0 mins',

    estimatedFare: '₱0',

  };

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity

          style={styles.backButton}

          onPress={() => navigation.goBack()}

        >

          <Ionicons

            name="arrow-back"

            size={24}

            color="#FFFFFF"

          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>

          Trip Summary

        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* SUCCESS CARD */}

        <View style={styles.successCard}>

          <Ionicons
            name="checkmark-circle"
            size={80}
            color="#22C55E"
          />

          <Text style={styles.successTitle}>
            Trip Completed
          </Text>

          <Text style={styles.successSubtitle}>
            Thank you for riding with TRIVORA.
          </Text>

        </View>

        {/* TRIP DETAILS */}

        <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>
            Trip Information
          </Text>

          <View style={styles.row}>

            <Text style={styles.label}>
              Destination
            </Text>

            <Text style={styles.value}>
              {destination}
            </Text>

          </View>

          <View style={styles.row}>

            <Text style={styles.label}>
              Total Distance
            </Text>

            <Text style={styles.value}>
              {distance}
            </Text>

          </View>

          <View style={styles.row}>

            <Text style={styles.label}>
              Travel Time
            </Text>

            <Text style={styles.value}>
              {eta}
            </Text>

          </View>

          <View style={styles.row}>

            <Text style={styles.label}>
              Total Fare
            </Text>

            <Text style={styles.fare}>
              {estimatedFare}
            </Text>

          </View>

        </View>

        {/* DRIVER INFORMATION */}

        <View style={styles.driverCard}>

          <Text style={styles.cardTitle}>
            Driver Information
          </Text>

          <View style={styles.driverRow}>

            <Ionicons
              name="person-circle"
              size={70}
              color={COLORS.primary}
            />

            <View style={styles.driverInfo}>

              <Text style={styles.driverName}>
                Juan Dela Cruz
              </Text>

              <Text style={styles.driverPlate}>
                Tricycle No. TRV-102
              </Text>

              <Text style={styles.driverRating}>
                ⭐ 4.9 Rating
              </Text>

            </View>

          </View>

        </View>
                {/* RATE DRIVER */}

        <TouchableOpacity
          style={styles.rateButton}
          onPress={() =>
            navigation.navigate('RateDriver', {
              destination,
              distance,
              eta,
              estimatedFare,
            })
          }
        >

          <Ionicons
            name="star"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.rateButtonText}>
            Rate Driver
          </Text>

        </TouchableOpacity>

        {/* BACK TO DASHBOARD */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Main')}
        >

          <Ionicons
            name="home"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.homeButtonText}>
            Back to Dashboard
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>

  );

}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  headerTitle: {
    marginLeft: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },

  successTitle: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
  },

  successSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  label: {
    fontSize: 16,
    color: COLORS.gray,
  },

  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 25,
  },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  driverInfo: {
    marginLeft: 15,
    flex: 1,
  },

  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  driverPlate: {
    marginTop: 5,
    fontSize: 15,
    color: COLORS.gray,
  },

  driverRating: {
    marginTop: 5,
    fontSize: 15,
    color: '#F4B400',
    fontWeight: '600',
  },

  rateButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 15,
  },

  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  homeButton: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },

  homeButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});