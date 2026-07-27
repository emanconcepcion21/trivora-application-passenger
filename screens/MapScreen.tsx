import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../theme/colors';

const ORS_API_KEY =
  'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjRmY2RkOThjMzNkMTQ2YzI5ZDcxNDVhMDM5MThhNTEyIiwiaCI6Im11cm11cjY0In0=';

type Barangay = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const NASUGBU_BARANGAYS: Barangay[] = [
  {
    id: '1',
    name: 'Aga',
    latitude: 14.1298,
    longitude: 120.6795,
  },
  {
    id: '2',
    name: 'Balaytigui',
    latitude: 14.1195,
    longitude: 120.7085,
  },
  {
    id: '3',
    name: 'Banilad',
    latitude: 14.0937,
    longitude: 120.6915,
  },
  {
    id: '4',
    name: 'Bucana',
    latitude: 14.1375,
    longitude: 120.6375,
  },
  {
    id: '5',
    name: 'Bunducan',
    latitude: 14.0745,
    longitude: 120.6845,
  },
  {
    id: '6',
    name: 'Butucan',
    latitude: 14.1055,
    longitude: 120.6525,
  },
  {
    id: '7',
    name: 'Calayo',
    latitude: 14.1705,
    longitude: 120.6185,
  },
  {
    id: '8',
    name: 'Catandaan',
    latitude: 14.0835,
    longitude: 120.7115,
  },
  {
    id: '9',
    name: 'Cogunan',
    latitude: 14.0675,
    longitude: 120.6575,
  },
  {
    id: '10',
    name: 'Dayap',
    latitude: 14.0605,
    longitude: 120.6255,
  },
  {
    id: '11',
    name: 'Kayrilaw',
    latitude: 14.1285,
    longitude: 120.6545,
  },
  {
    id: '12',
    name: 'Kaylaway',
    latitude: 14.1165,
    longitude: 120.6415,
  },
  {
    id: '13',
    name: 'Latag',
    latitude: 14.0515,
    longitude: 120.6555,
  },
  {
    id: '14',
    name: 'Looc',
    latitude: 14.0435,
    longitude: 120.6865,
  },
  {
    id: '15',
    name: 'Mabayo',
    latitude: 14.0955,
    longitude: 120.6415,
  },
  {
    id: '16',
    name: 'Magallanes',
    latitude: 14.0755,
    longitude: 120.6245,
  },
  {
    id: '17',
    name: 'Mataas na Lupa',
    latitude: 14.0655,
    longitude: 120.6415,
  },
  {
    id: '18',
    name: 'Natipuan',
    latitude: 14.1445,
    longitude: 120.6525,
  },
  {
    id: '19',
    name: 'Papaya',
    latitude: 14.1585,
    longitude: 120.6375,
  },
  {
    id: '20',
    name: 'Putat',
    latitude: 14.0985,
    longitude: 120.7245,
  },
  {
    id: '21',
    name: 'Reparo',
    latitude: 14.0845,
    longitude: 120.6285,
  },
  {
    id: '22',
    name: 'Talangan',
    latitude: 14.1125,
    longitude: 120.6745,
  },
  {
    id: '23',
    name: 'Tumalim',
    latitude: 14.1265,
    longitude: 120.7315,
  },
  {
    id: '24',
    name: 'Wawa',
    latitude: 14.0685,
    longitude: 120.6265,
  },
];

async function reverseGeocodeAddress(latitude: number, longitude: number): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const item = results[0];
      const isValidName = (str?: string | null) => str && !/^\d+$/.test(str.trim()) && !str.includes('+');

      const streetNumber = isValidName(item.streetNumber) ? item.streetNumber!.trim() : null;
      const streetName = isValidName(item.street) ? item.street!.trim() : null;
      const fullStreet = streetName ? (streetNumber ? `${streetNumber} ${streetName}` : streetName) : null;

      const name = isValidName(item.name) ? item.name!.trim() : null;
      const district = isValidName(item.district) ? item.district!.trim() : null;
      const city = isValidName(item.city) ? item.city!.trim() : 'Nasugbu';

      const mainPlace = fullStreet || name || district;
      if (mainPlace) return `${mainPlace}, ${city}`;
    }
  } catch (e) {}

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
      headers: { 'User-Agent': 'TrivoraMobile/1.0' },
    });
    const data = await res.json();
    if (data && data.address) {
      const a = data.address;
      const place = a.amenity || a.building || a.shop || a.road || a.suburb || a.village || a.neighbourhood || a.quarter;
      const city = a.city || a.town || a.municipality || 'Nasugbu';
      if (place && city) return `${place}, ${city}`;
      if (place) return `${place}, Nasugbu`;
      if (data.display_name) return data.display_name.split(',')[0];
    }
  } catch (e) {}

  return `Brgy. Poblacion, Nasugbu`;
}

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState({
    latitude: 14.064218,
    longitude: 120.622139,
  });

  const [pickupAddressName, setPickupAddressName] = useState('Nasugbu, Batangas');
  const [destination, setDestination] = useState('');

  const [selectedPlace, setSelectedPlace] =
    useState<Barangay | null>(null);

  const [distance, setDistance] = useState('');

  const [eta, setEta] = useState('');

  const [estimatedFare, setEstimatedFare] =
    useState('₱0');

  const [routeCoordinates, setRouteCoordinates] =
    useState<any[]>([]);

  const [routeLoading, setRouteLoading] =
    useState(false);

  useEffect(() => {
    let watchSub: Location.LocationSubscription | null = null;

    async function startContinuousLocationTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to use the map.');
          setLoading(false);
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (current && current.coords) {
          const lat = current.coords.latitude;
          const lng = current.coords.longitude;
          setLocation({ latitude: lat, longitude: lng });
          reverseGeocodeAddress(lat, lng).then((addr) => setPickupAddressName(addr));
        }

        setLoading(false);

        // Continuous real-time GPS position watcher
        watchSub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 3000,
            distanceInterval: 3,
          },
          (newLoc) => {
            if (newLoc && newLoc.coords) {
              const newLat = newLoc.coords.latitude;
              const newLng = newLoc.coords.longitude;
              setLocation({ latitude: newLat, longitude: newLng });
            }
          }
        );
      } catch (error) {
        console.log('Location Error:', error);
        setLoading(false);
      }
    }

    startContinuousLocationTracking();

    return () => {
      if (watchSub) {
        watchSub.remove();
      }
    };
  }, []);

  const filteredBarangays = useMemo(() => {
    const searchText =
      destination.trim().toLowerCase();

    if (searchText.length === 0) {
      return NASUGBU_BARANGAYS;
    }

    return NASUGBU_BARANGAYS.filter(
      (barangay) =>
        barangay.name
          .toLowerCase()
          .includes(searchText)
    );
  }, [destination]);

  async function selectDestination(
    barangay: Barangay
  ) {
    setSelectedPlace(barangay);

    setDestination(
      `Brgy. ${barangay.name}`
    );

    setDistance('');

    setEta('');

    setEstimatedFare('₱0');

    setRouteCoordinates([]);

    if (
      !ORS_API_KEY ||
      ORS_API_KEY.trim().length === 0
    ) {
      Alert.alert(
        'OpenRouteService API Key Missing',
        'Please add your OpenRouteService API key in MapScreen.tsx.'
      );

      return;
    }

    setRouteLoading(true);

    try {
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          method: 'POST',

          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            coordinates: [
              [
                location.longitude,
                location.latitude,
              ],
              [
                barangay.longitude,
                barangay.latitude,
              ],
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.log(
          'OpenRouteService Error:',
          errorText
        );

        throw new Error(
          'OpenRouteService request failed'
        );
      }

      const data =
        await response.json();

      if (
        !data.features ||
        data.features.length === 0
      ) {
        throw new Error(
          'No route found'
        );
      }

      const route =
        data.features[0];

      const summary =
        route.properties.summary;

      const km =
        summary.distance / 1000;

      const mins =
        Math.ceil(
          summary.duration / 60
        );

      setDistance(
        `${km.toFixed(2)} km`
      );

      setEta(
        `${mins} mins`
      );

      const fare =
        20 + km * 5;

      setEstimatedFare(
        `₱${fare.toFixed(0)}`
      );

      setRouteCoordinates(
        route.geometry.coordinates
      );
    } catch (error) {
      console.log(
        'Route Error:',
        error
      );

      Alert.alert(
        'Route Error',
        'Unable to load the driving route. Please try again.'
      );
    } finally {
      setRouteLoading(false);
    }
  }

  function clearDestination() {
    setDestination('');

    setSelectedPlace(null);

    setDistance('');

    setEta('');

    setEstimatedFare('₱0');

    setRouteCoordinates([]);
  }

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Getting your location...
        </Text>
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

height: 100%;
width: 100%;
margin: 0;
padding: 0;

}

body {

overflow: hidden;

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
${location.latitude},
${location.longitude}
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

var passengerMarker =
L.marker([
${location.latitude},
${location.longitude}
])
.addTo(map)
.bindPopup(
'Current Pickup Location'
);

var destinationMarker = null;

${
selectedPlace
  ? `
destinationMarker = L.marker([
${selectedPlace.latitude},
${selectedPlace.longitude}
], { draggable: true })
.addTo(map)
.bindPopup('${selectedPlace.name}');

destinationMarker.on('dragend', function(e) {
  var pos = e.target.getLatLng();
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'PIN_LOCATION',
      lat: pos.lat,
      lng: pos.lng
    }));
  }
});

var routeCoordinates = ${JSON.stringify(routeCoordinates)}.map(function(item) {
  return [item[1], item[0]];
});

if (routeCoordinates.length > 0) {
  var route = L.polyline(routeCoordinates, {
    color: '#2563EB',
    weight: 6,
    opacity: 0.9
  }).addTo(map);

  var bounds = route.getBounds();
  map.fitBounds(bounds, { padding: [50, 50] });
}
`
  : ''
}

// Allow passenger to tap anywhere on the map to pin destination
map.on('click', function(e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;

  if (destinationMarker) {
    destinationMarker.setLatLng(e.latlng);
  } else {
    destinationMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
  }
  destinationMarker.bindPopup('Pinned Destination').openPopup();

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'PIN_LOCATION',
      lat: lat,
      lng: lng
    }));
  }
});

</script>

</body>

</html>
`;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'PIN_LOCATION') {
        const resolvedAddress = await reverseGeocodeAddress(data.lat, data.lng);
        const pinned: Barangay = {
          id: 'pinned-' + Date.now(),
          name: resolvedAddress,
          latitude: data.lat,
          longitude: data.lng,
        };
        selectDestination(pinned);
      }
    } catch (e) {
      console.log('WebView Message Error:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      keyboardVerticalOffset={20}
    >

      {/* FLOATING MAP PINNING INSTRUCTION BANNER */}
      <View style={[styles.floatingBanner, { top: Math.max(insets.top + 12, 48) }]}>
        <Ionicons name="location" size={18} color="#FFFFFF" />
        <Text style={styles.floatingBannerText}>
          {selectedPlace ? 'Destination Pinned! Tap map to reposition.' : 'Tap anywhere on map to PIN Destination'}
        </Text>
      </View>

      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{
          html,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
      />

      <View style={styles.bottomCard}>
        <Text style={styles.title}>Book Ride</Text>

        {!selectedPlace ? (
          <TouchableOpacity
            style={styles.pinHintCard}
            onPress={() => {
              // Default pin near center if tapped
              selectDestination({
                id: 'pin-default',
                name: 'Pinned Destination (Bucana / Brgy. 10)',
                latitude: 14.0725,
                longitude: 120.6315,
              });
            }}
          >
            <Ionicons name="location" size={36} color={COLORS.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.pinHintTitle}>Pin Destination on Map</Text>
              <Text style={styles.pinHintSub}>Tap any location on the map above to drop your destination pin.</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.selectedDestination}>
              <Ionicons name="location" size={22} color={COLORS.primary} />
              <View style={styles.selectedContent}>
                <Text style={styles.selectedTitle}>{selectedPlace.name}</Text>
                <Text style={styles.selectedSubtitle}>Nasugbu, Batangas</Text>
              </View>
              <TouchableOpacity onPress={clearDestination}>
                <Ionicons name="close-circle" size={22} color="#999" />
              </TouchableOpacity>
            </View>

            {routeLoading ? (

              <View
                style={
                  styles.routeLoading
                }
              >

                <ActivityIndicator
                  size="small"
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.routeLoadingText
                  }
                >
                  Calculating route...
                </Text>

              </View>

            ) : (

              <>

                {distance &&
                  eta && (

                    <View
                      style={
                        styles.infoRow
                      }
                    >

                      <View
                        style={
                          styles.infoBox
                        }
                      >

                        <Ionicons
                          name="navigate"
                          size={18}
                          color={
                            COLORS.primary
                          }
                        />

                        <Text
                          style={
                            styles.infoLabel
                          }
                        >
                          Distance
                        </Text>

                        <Text
                          style={
                            styles.infoValue
                          }
                        >
                          {distance}
                        </Text>

                      </View>

                      <View
                        style={
                          styles.infoBox
                        }
                      >

                        <Ionicons
                          name="time"
                          size={18}
                          color={
                            COLORS.primary
                          }
                        />

                        <Text
                          style={
                            styles.infoLabel
                          }
                        >
                          ETA
                        </Text>

                        <Text
                          style={
                            styles.infoValue
                          }
                        >
                          {eta}
                        </Text>

                      </View>

                      <View
                        style={
                          styles.infoBox
                        }
                      >

                        <Ionicons
                          name="cash"
                          size={18}
                          color={
                            COLORS.primary
                          }
                        />

                        <Text
                          style={
                            styles.infoLabel
                          }
                        >
                          Fare
                        </Text>

                        <Text
                          style={
                            styles.infoValue
                          }
                        >
                          {estimatedFare}
                        </Text>

                      </View>

                    </View>

                  )}

                {distance &&
                  eta && (

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        const numericFare = parseFloat(estimatedFare.replace('₱', '')) || 45.0;
                        const numericDistance = parseFloat(distance.replace(' km', '')) || 2.5;

                        navigation.navigate('SearchingDriver', {
                          pickupName: pickupAddressName || 'Brgy. Poblacion, Nasugbu',
                          pickupLat: location.latitude,
                          pickupLng: location.longitude,
                          dropoffName: selectedPlace?.name || 'Brgy. Bucana, Nasugbu',
                          dropoffLat: selectedPlace?.latitude || 14.0701,
                          dropoffLng: selectedPlace?.longitude || 120.6339,
                          fareAmount: numericFare,
                          distanceKm: numericDistance,
                        });
                      }}
                    >

                      {/* TRICYCLE ICON */}

                      <Image
                        source={require('../assets/tricycle.png')}
                        style={styles.tricycleIcon}
                      />

                      <Text
                        style={
                          styles.buttonText
                        }
                      >
                        Continue Booking
                      </Text>

                    </TouchableOpacity>

                  )}

              </>

            )}

          </>

        )}

      </View>

    </KeyboardAvoidingView>
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666666',
  },

  bottomCard: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    maxHeight: 500,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.black,
  },

  resultList: {
    maxHeight: 230,
    marginBottom: 10,
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 13,
    borderRadius: 12,
    marginBottom: 8,
  },

  resultContent: {
    flex: 1,
    marginLeft: 10,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },

  resultSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  noResult: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  noResultText: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },

  noResultSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },

  selectedDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  selectedContent: {
    flex: 1,
    marginLeft: 10,
  },

  selectedLabel: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 3,
  },

  selectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },

  routeLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },

  routeLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    borderRadius: 15,
    paddingVertical: 12,
    marginHorizontal: 3,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 4,
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

  tricycleIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    marginRight: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  floatingBanner: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    zIndex: 99,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  floatingBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  pinHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
  },
  pinHintTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pinHintSub: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
});