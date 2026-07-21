import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { WebView } from 'react-native-webview';

import * as Location from 'expo-location';

import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import COLORS from '../theme/colors';

export default function MapScreen() {

  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState({
    latitude: 14.064218,
    longitude: 120.622139,
  });

  const [destination, setDestination] = useState('');

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [estimatedFare, setEstimatedFare] = useState('₱0');

  const [distance, setDistance] = useState('0 km');

  const [eta, setEta] = useState('0 min');

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

    setLoading(false);

  }
    async function searchDestination(text: string) {

    setDestination(text);

    if (text.trim().length < 3) {

      setSearchResults([]);

      return;

    }

    try {

      const response = await fetch(

        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=ph&limit=5`

      );

      const data = await response.json();

      setSearchResults(data);

    } catch (error) {

      console.log(error);

    }

  }

  function selectDestination(item: any) {

    setSelectedPlace(item);

    setDestination(item.display_name);

    setSearchResults([]);

    const lat = parseFloat(item.lat);

    const lon = parseFloat(item.lon);

    // Distance Formula

    const R = 6371;

    const dLat = (lat - location.latitude) * Math.PI / 180;

    const dLon = (lon - location.longitude) * Math.PI / 180;

    const a =

      Math.sin(dLat / 2) *

      Math.sin(dLat / 2) +

      Math.cos(location.latitude * Math.PI / 180) *

      Math.cos(lat * Math.PI / 180) *

      Math.sin(dLon / 2) *

      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const km = R * c;

    setDistance(`${km.toFixed(1)} km`);

    // Fare Sample

    const fare = 20 + (km * 5);

    setEstimatedFare(`₱${fare.toFixed(0)}`);

    // ETA Sample

    const minutes = Math.max(2, Math.round(km * 2));

    setEta(`${minutes} mins`);

  }

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

      </View>

    );

  }
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

var map=L.map('map').setView(
[${location.latitude},${location.longitude}],15);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);

var passenger=L.marker(
[${location.latitude},${location.longitude}]
).addTo(map)
.bindPopup("Current Location");

${
selectedPlace
? `
var destination=L.marker(
[${selectedPlace.lat},${selectedPlace.lon}]
).addTo(map)
.bindPopup("Destination");

var bounds=L.latLngBounds([
[${location.latitude},${location.longitude}],
[${selectedPlace.lat},${selectedPlace.lon}]
]);

map.fitBounds(bounds,{padding:[50,50]});

L.polyline(
[
[${location.latitude},${location.longitude}],
[${selectedPlace.lat},${selectedPlace.lon}]
],
{
color:'blue',
weight:5
}
).addTo(map);
`
: ''
}

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
          Book Ride
        </Text>

        <View style={styles.searchContainer}>

          <Ionicons
            name="search"
            size={22}
            color={COLORS.primary}
          />

          <TextInput
            placeholder="Search destination..."
            value={destination}
            onChangeText={searchDestination}
            style={styles.input}
          />

        </View>

        {searchResults.length > 0 && (

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.place_id.toString()}
            style={styles.resultList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (

              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => selectDestination(item)}
              >

                <Ionicons
                  name="location"
                  size={18}
                  color={COLORS.primary}
                />

                <Text style={styles.resultText}>
                  {item.display_name}
                </Text>

              </TouchableOpacity>

            )}
          />

        )}
                {selectedPlace && (

          <>

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
                  ETA
                </Text>

                <Text style={styles.infoValue}>
                  {eta}
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

            <TouchableOpacity

              style={styles.button}

              onPress={() =>

                navigation.navigate(
                  'Booking',
                  {
                    destination,
                    distance,
                    eta,
                    estimatedFare,
                  }
                )

              }

            >

              <Ionicons
                name="car"
                size={22}
                color="#fff"
              />

              <Text style={styles.buttonText}>
                Continue Booking
              </Text>

            </TouchableOpacity>

          </>

        )}

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

  bottomCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    maxHeight: 420,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
  },

  resultList: {
    maxHeight: 180,
    marginBottom: 15,
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  resultText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.black,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 15,
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 17,
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
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },

});