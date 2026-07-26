import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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

  /*
  ========================================
  GET BOOKING DATA
  ========================================
  */

  const {
    destination = 'No destination',
    distance = '0 km',
    eta = '0 mins',
    estimatedFare = '₱0',

    pickupLatitude = 14.064218,
    pickupLongitude = 120.622139,

    destinationLatitude = 14.064218,
    destinationLongitude = 120.622139,
  } = route.params || {};

  /*
  ========================================
  PASSENGER LOCATION
  ========================================
  */

  const passenger = {
    lat: pickupLatitude,
    lng: pickupLongitude,
  };

  /*
  ========================================
  DRIVER DEMO LOCATION
  ========================================
  */

  const [driverLat, setDriverLat] = useState(
    pickupLatitude - 0.006
  );

  const [driverLng, setDriverLng] = useState(
    pickupLongitude - 0.008
  );

  /*
  ========================================
  ETA DEMO
  ========================================
  */

  const [minutes, setMinutes] = useState(3);

  /*
  ========================================
  DRIVER MOVEMENT DEMO
  ========================================
  */

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLat(prev => {
        const difference =
          passenger.lat - prev;

        if (Math.abs(difference) < 0.0005) {
          return passenger.lat;
        }

        return prev + difference * 0.1;
      });

      setDriverLng(prev => {
        const difference =
          passenger.lng - prev;

        if (Math.abs(difference) < 0.0005) {
          return passenger.lng;
        }

        return prev + difference * 0.1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    passenger.lat,
    passenger.lng,
  ]);

  /*
  ========================================
  COUNTDOWN DEMO
  ========================================
  */

  const [currentStatus, setCurrentStatus] = useState<string>('accepted');
  const [statusMessage, setStatusMessage] = useState<string>('Driver is en route to your pickup location');

  useEffect(() => {
    let intervalId: any = null;
    const host = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : '192.168.254.205';

    async function pollTripStatus() {
      try {
        const response = await fetch(`http://${host}:8000/api/v1/passenger/bookings/active`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (data.booking) {
          const st = data.booking.status;
          setCurrentStatus(st);
          if (st === 'arrived') {
            setStatusMessage('🔔 DRIVER ARRIVED! Your tricycle is waiting at pickup.');
          } else if (st === 'in_transit') {
            setStatusMessage('🚀 TRIP IN PROGRESS: Heading to your destination.');
          } else if (st === 'completed') {
            setStatusMessage('🎉 TRIP COMPLETED! Thank you for riding with Trivora.');
            setTimeout(() => {
              goToTripSummary();
            }, 1200);
          }
        }
      } catch (e) {
        console.log('Status poll notice:', e);
      }
    }

    pollTripStatus();
    intervalId = setInterval(pollTripStatus, 3000);
    return () => clearInterval(intervalId);
  }, []);

  /*
  ========================================
  GO TO TRIP SUMMARY
  ========================================
  */

  function goToTripSummary() {
    navigation.replace(
      'TripSummary',
      {
        destination,
        distance,
        eta,
        estimatedFare,
      }
    );
  }

  /*
  ========================================
  LEAFLET MAP
  ========================================
  */

  const html = `
<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8"/>

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<style>

html,
body,
#map {

height:100%;
width:100%;

margin:0;
padding:0;

}

body {

overflow:hidden;

}

</style>

</head>

<body>

<div id="map"></div>

<script
src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
</script>

<script>

var map = L.map('map').setView(
[
${passenger.lat},
${passenger.lng}
],
15
);

L.tileLayer(
'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
{
maxZoom: 20,
attribution: '© Google Maps'
}
).addTo(map);


/*
========================================
PASSENGER MARKER
========================================
*/

L.marker([
${passenger.lat},
${passenger.lng}
])
.addTo(map)
.bindPopup(
'Passenger Location'
);


/*
========================================
DESTINATION MARKER
========================================
*/

L.marker([
${destinationLatitude},
${destinationLongitude}
])
.addTo(map)
.bindPopup(
'Destination'
);


/*
========================================
DRIVER MARKER
========================================
*/

L.marker([
${driverLat},
${driverLng}
])
.addTo(map)
.bindPopup(
'Tricycle Driver'
);


/*
========================================
DRIVER TO PASSENGER ROUTE
========================================
*/

L.polyline(
[
[
${driverLat},
${driverLng}
],
[
${passenger.lat},
${passenger.lng}
]
],
{
color: '#2563EB',
weight: 5,
opacity: 0.8
}
)
.addTo(map);

</script>

</body>

</html>
`;

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <View style={styles.container}>

      {/* REAL-TIME TRIP STATUS BANNER */}
      <View style={styles.statusBanner}>
        <Ionicons name="radio" size={18} color="#FFFFFF" />
        <Text style={styles.statusBannerText}>{statusMessage}</Text>
      </View>

      {/* MAP */}

      <WebView
        source={{
          html,
        }}
        originWhitelist={['*']}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />


      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.goBack()
        }
      >

        <Ionicons
          name="arrow-back"
          size={25}
          color={COLORS.black}
        />

      </TouchableOpacity>


      {/* TRACKING CARD */}

      <View style={styles.card}>

        {/* DRIVER HEADER */}

        <View style={styles.driverHeader}>

          {/* TRICYCLE IMAGE */}

          <View style={styles.driverIcon}>

            <Image
              source={require('../assets/tricycle.png')}
              style={styles.tricycleIcon}
              resizeMode="contain"
            />

          </View>


          <View>

            <Text style={styles.title}>
              Driver is Coming
            </Text>

            <Text style={styles.subtitle}>
              Your tricycle driver is on the way
            </Text>

          </View>

        </View>


        {/* DESTINATION */}

        <View style={styles.destinationBox}>

          <Ionicons
            name="location"
            size={22}
            color={COLORS.primary}
          />

          <View
            style={styles.destinationContent}
          >

            <Text
              style={styles.destinationLabel}
            >
              Destination
            </Text>

            <Text
              style={styles.destinationText}
              numberOfLines={2}
            >
              {destination}
            </Text>

          </View>

        </View>


        {/* ETA */}

        <View style={styles.etaContainer}>

          <Text style={styles.etaLabel}>
            Estimated Arrival
          </Text>

          <Text style={styles.time}>
            {minutes} mins
          </Text>

        </View>


        {/* BOOKING INFO */}

        <View style={styles.infoRow}>

          <View style={styles.infoBox}>

            <Text style={styles.infoLabel}>
              Distance
            </Text>

            <Text style={styles.infoValue}>
              {distance}
            </Text>

          </View>


          <View style={styles.infoBox}>

            <Text style={styles.infoLabel}>
              Fare
            </Text>

            <Text style={styles.infoValue}>
              {estimatedFare}
            </Text>

          </View>

        </View>


        {/* END DEMO */}

        <TouchableOpacity
          style={styles.button}
          onPress={
            goToTripSummary
          }
        >

          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            End Demo Ride
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}


/*
========================================
STYLES
========================================
*/

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  map: {
    flex: 1,
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,

    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 6,

    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    zIndex: 10,
  },

  card: {
    position: 'absolute',

    left: 15,
    right: 15,
    bottom: 20,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 20,

    elevation: 10,

    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 15,
  },

  driverIcon: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,

    overflow: 'hidden',
  },

  tricycleIcon: {
    width: 38,
    height: 38,
    tintColor: '#FFFFFF',
  },

  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#777777',
  },

  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F5F8FF',

    borderRadius: 14,

    padding: 12,

    marginBottom: 15,
  },

  destinationContent: {
    flex: 1,
    marginLeft: 10,
  },

  destinationLabel: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 3,
  },

  destinationText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },

  etaContainer: {
    alignItems: 'center',

    marginBottom: 15,
  },

  etaLabel: {
    fontSize: 14,
    color: '#666666',
  },

  time: {
    marginTop: 4,

    fontSize: 32,
    fontWeight: 'bold',

    color: COLORS.primary,
  },

  infoRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 15,
  },

  infoBox: {
    flex: 1,

    backgroundColor: '#F5F8FF',

    borderRadius: 13,

    paddingVertical: 10,

    marginHorizontal: 3,

    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  button: {
    height: 55,

    backgroundColor: COLORS.primary,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',

    elevation: 5,
  },

  buttonText: {
    marginLeft: 8,

    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: 'bold',
  },

  statusBanner: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  statusBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});