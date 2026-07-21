import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

export default function TrackingScreen() {

  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const {
  destination = 'Unknown Destination',
  distance = '0 km',
  eta = '0 min',
  estimatedFare = '₱0',
} = route.params || {};

  const [driverDistance, setDriverDistance] =
    useState('1.2 km');

  const [driverETA, setDriverETA] =
    useState(4);

  const [status, setStatus] =
    useState('Driver is on the way');

  useEffect(() => {

    const timer = setInterval(() => {

      setDriverETA((prev) => {

        if (prev <= 1) {

          setStatus('Driver has arrived');

          setDriverDistance('0 km');

          clearInterval(timer);

          return 0;

        }

        return prev - 1;

      });

      setDriverDistance((prev) => {

        switch (prev) {

          case '1.2 km':
            return '900 m';

          case '900 m':
            return '500 m';

          case '500 m':
            return '150 m';

          default:
            return '0 km';

        }

      });

    }, 5000);

    return () => clearInterval(timer);

  }, []);

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"/>

<link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

<style>

html,
body,
#map{

height:100%;
margin:0;
padding:0;

}

</style>

</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>

var map = L.map('map').setView(
[14.064218,120.622139],
16
);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

L.marker(
[14.064218,120.622139]
).addTo(map)
.bindPopup('Passenger')
.openPopup();

L.marker(
[14.066000,120.624000]
).addTo(map)
.bindPopup('Driver');

</script>

</body>

</html>
`;

  return (

    <View style={styles.container}>
            {/* MAP */}

      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
      />

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
          Tracking Ride
        </Text>

      </View>

      {/* DRIVER CARD */}

      <View style={styles.bottomCard}>

        <Text style={styles.status}>
          {status}
        </Text>

        <View style={styles.driverRow}>

          <Ionicons
            name="person-circle"
            size={60}
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

        <View style={styles.infoContainer}>

          <View style={styles.infoBox}>

            <Ionicons
              name="time"
              size={24}
              color={COLORS.primary}
            />

            <Text style={styles.infoTitle}>
              ETA
            </Text>

            <Text style={styles.infoValue}>
              {driverETA} min
            </Text>

          </View>

          <View style={styles.infoBox}>

            <Ionicons
              name="navigate"
              size={24}
              color={COLORS.primary}
            />

            <Text style={styles.infoTitle}>
              Distance
            </Text>

            <Text style={styles.infoValue}>
              {driverDistance}
            </Text>

          </View>

        </View>

        <View style={styles.destinationCard}>

  <Ionicons
    name="location"
    size={22}
    color={COLORS.primary}
  />

  <Text style={styles.destinationText}>
    {destination}
  </Text>

</View>

        {/* ACTION BUTTONS */}

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() =>
              Alert.alert(
                'Call Driver',
                'Calling Juan Dela Cruz...'
              )
            }
          >

            <Ionicons
              name="call"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Call
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              Alert.alert(
                'Message Driver',
                'Opening chat...'
              )
            }
          >

            <Ionicons
              name="chatbubble"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Message
            </Text>

          </TouchableOpacity>

        </View>

        {/* DRIVER ARRIVED */}

                  <TouchableOpacity
            style={styles.arrivedButton}
            disabled={status !== 'Driver has arrived'}
            onPress={() =>
              navigation.navigate('TripSummary', {
                destination,
                distance,
                eta,
                estimatedFare,
              })
            }
          >

          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#FFFFFF"
          />

          <Text style={styles.arrivedButtonText}>
            Driver Arrived
          </Text>

        </TouchableOpacity>

        {/* CANCEL RIDE */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>

            Alert.alert(
              'Cancel Ride',
              'Are you sure you want to cancel this ride?',
              [
                {
                  text: 'No',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: () =>
                    navigation.navigate('Main'),
                },
              ]
            )

          }
        >

          <Ionicons
            name="close-circle"
            size={22}
            color="#E53935"
          />

          <Text style={styles.cancelText}>
            Cancel Ride
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  map: {
    flex: 1,
  },

  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
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

  bottomCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },

  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  driverInfo: {
    marginLeft: 15,
    flex: 1,
  },

  driverName: {
    fontSize: 20,
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

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    borderRadius: 15,
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  infoTitle: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.gray,
  },

  infoValue: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  destinationText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  callButton: {
    flex: 1,
    height: 55,
    backgroundColor: '#34A853',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
    elevation: 5,
  },

  messageButton: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  arrivedButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 15,
  },

  arrivedButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  cancelButton: {
    height: 55,
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  cancelText: {
    color: '#E53935',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});