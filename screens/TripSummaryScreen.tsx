import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

  /*
  ========================================
  GET TRIP DATA
  ========================================
  */

  const {
    bookingId = null,
    booking = null,
    destination = 'No destination',
    distance = '0 km',
    eta = '0 mins',
    estimatedFare = '₱0',
  } = route.params || {};


  /*
  ========================================
  CONTINUE TO RATE DRIVER
  ========================================
  */

  function continueToRating() {

    navigation.replace(
      'RateDriver',
      {
        bookingId: bookingId || (booking ? booking.id : null),
        booking,
        destination,
        distance,
        eta,
        estimatedFare,
      }
    );

  }


  return (

    <View style={styles.container}>


      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.goBack()
        }
      >

        <Ionicons
          name="arrow-back"
          size={26}
          color={COLORS.black}
        />

      </TouchableOpacity>


      {/* TITLE */}

      <View style={styles.header}>

        <View style={styles.successIcon}>

          <Ionicons
            name="checkmark"
            size={35}
            color="#FFFFFF"
          />

        </View>

        <Text style={styles.title}>
          Trip Completed
        </Text>

        <Text style={styles.subtitle}>
          Thank you for riding with Trivora
        </Text>

      </View>


      {/* TRIP SUMMARY CARD */}

      <View style={styles.card}>


        {/* DESTINATION */}

        <View style={styles.row}>

          <View style={styles.labelContainer}>

            <Ionicons
              name="location"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Destination
            </Text>

          </View>

          <Text
            style={styles.value}
            numberOfLines={3}
          >
            {destination}
          </Text>

        </View>


        <View style={styles.divider} />


        {/* DISTANCE */}

        <View style={styles.row}>

          <View style={styles.labelContainer}>

            <Ionicons
              name="navigate"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Distance
            </Text>

          </View>

          <Text style={styles.value}>
            {distance}
          </Text>

        </View>


        <View style={styles.divider} />


        {/* TRAVEL TIME */}

        <View style={styles.row}>

          <View style={styles.labelContainer}>

            <Ionicons
              name="time"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Travel Time
            </Text>

          </View>

          <Text style={styles.value}>
            {eta}
          </Text>

        </View>


        <View style={styles.divider} />


        {/* FARE */}

        <View style={styles.row}>

          <View style={styles.labelContainer}>

            <Ionicons
              name="cash"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.label}>
              Fare
            </Text>

          </View>

          <Text style={styles.fareValue}>
            {estimatedFare}
          </Text>

        </View>

      </View>


      {/* CONTINUE BUTTON */}

      <TouchableOpacity
        style={styles.button}
        onPress={
          continueToRating
        }
      >

        <Text style={styles.buttonText}>
          Continue
        </Text>

        <Ionicons
          name="arrow-forward"
          size={22}
          color="#FFFFFF"
        />

      </TouchableOpacity>


    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: '#F5F7FB',

    justifyContent: 'center',

    paddingHorizontal: 20,
  },


  backButton: {
    position: 'absolute',

    top: 55,
    left: 20,

    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,

    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    zIndex: 10,
  },


  header: {
    alignItems: 'center',

    marginBottom: 25,
  },


  successIcon: {
    width: 65,
    height: 65,

    borderRadius: 33,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 12,
  },


  title: {
    fontSize: 28,

    fontWeight: 'bold',

    color: COLORS.primary,

    textAlign: 'center',

    marginBottom: 8,
  },


  subtitle: {
    fontSize: 15,

    color: '#777777',

    textAlign: 'center',
  },


  card: {
    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    padding: 20,

    elevation: 6,

    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },


  row: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    minHeight: 50,
  },


  labelContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },


  label: {
    fontSize: 15,

    color: '#666666',

    marginLeft: 8,
  },


  value: {
    fontSize: 15,

    fontWeight: 'bold',

    color: COLORS.black,

    textAlign: 'right',

    flex: 1.5,
  },


  fareValue: {
    fontSize: 21,

    fontWeight: 'bold',

    color: COLORS.primary,

    textAlign: 'right',
  },


  divider: {
    height: 1,

    backgroundColor: '#EEEEEE',

    marginVertical: 5,
  },


  button: {
    marginTop: 30,

    height: 58,

    borderRadius: 15,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 5,
  },


  buttonText: {
    color: '#FFFFFF',

    fontSize: 18,

    fontWeight: 'bold',

    marginRight: 10,
  },

});