import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

export default function MapScreen() {
  const [location, setLocation] = useState({
    latitude: 14.064218,
    longitude: 120.622139,
  });

  const [destination, setDestination] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Location permission is required.'
      );
      return;
    }

    const current =
      await Location.getCurrentPositionAsync({});

    setLocation({
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

<style>
html,body,#map{
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

var map=L.map('map').setView(
[${location.latitude},${location.longitude}],16);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

L.marker(
[${location.latitude},${location.longitude}]
).addTo(map)
.bindPopup('Your Location')
.openPopup();

</script>

</body>
</html>
`;

  return (
    <View style={styles.container}>

      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
      />

      <View style={styles.bottomCard}>

        <Text style={styles.title}>
          Book a Ride
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="location"
            size={22}
            color={COLORS.primary}
          />

          <TextInput
            placeholder="Enter Destination"
            value={destination}
            onChangeText={setDestination}
            style={styles.input}
          />

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {

            if (destination === '') {
              Alert.alert(
                'Destination Required',
                'Please enter your destination.'
              );
              return;
            }

            Alert.alert(
              'Destination Selected',
              destination
            );

          }}
        >

          <Text style={styles.buttonText}>
            CONTINUE
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  button: {
    marginTop: 20,
    height: 55,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});