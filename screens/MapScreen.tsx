import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
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

  return (
    <View style={styles.container}>

      {/* MAP */}

      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* Passenger */}

        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          description="Current Position"
        />

      </MapView>

      {/* Bottom Card */}

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