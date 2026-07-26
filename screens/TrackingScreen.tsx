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

  const {
    destination = 'Pinned Location',
    distance = '2.5 km',
    eta = '8 mins',
    estimatedFare = '₱45.00',
    pickupLatitude,
    pickupLongitude,
    destinationLatitude,
    destinationLongitude,
  } = route.params || {};

  const pLat = parseFloat(pickupLatitude) || 14.0637;
  const pLng = parseFloat(pickupLongitude) || 120.6274;
  const dLat = parseFloat(destinationLatitude) || 14.0701;
  const dLng = parseFloat(destinationLongitude) || 120.6339;

  const [driverLat, setDriverLat] = useState(pLat - 0.005);
  const [driverLng, setDriverLng] = useState(pLng - 0.006);
  const [isExpanded, setIsExpanded] = useState(false);

  const passenger = {
    lat: pLat,
    lng: pLng,
  };

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
  const [activeDriver, setActiveDriver] = useState<{
    name: string;
    plateNumber: string;
    todaName: string;
    mobile: string;
  }>({
    name: 'Pedro Ramos',
    plateNumber: 'TRV-BRGY8',
    todaName: 'TODA Brgy. 8',
    mobile: '09188887777',
  });

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

          // Update active driver details from server
          if (data.booking.driver?.user?.name || data.booking.tricycle?.plate_number) {
            setActiveDriver({
              name: data.booking.driver?.user?.name || 'Pedro Ramos',
              plateNumber: data.booking.tricycle?.plate_number || 'TRV-BRGY8',
              todaName: data.booking.toda_zone?.name || 'TODA Brgy. 8',
              mobile: data.booking.driver?.mobile_number || '09188887777',
            });
          }

          // Extract real server driver GPS / TODA coordinates
          const serverDrvLat = parseFloat(data.booking.driver?.current_lat) || parseFloat(data.booking.toda_zone?.center_lat) || (pLat - 0.003);
          const serverDrvLng = parseFloat(data.booking.driver?.current_lng) || parseFloat(data.booking.toda_zone?.center_lng) || (pLng - 0.004);

          webViewRef.current?.injectJavaScript(`
            if (window.updateDriverPosition) {
              window.updateDriverPosition('${st}', ${serverDrvLat}, ${serverDrvLng});
            }
            true;
          `);

          if (st === 'arrived') {
            setStatusMessage('DRIVER ARRIVED: Your tricycle is waiting at pickup location.');
          } else if (st === 'in_transit') {
            setStatusMessage('TRIP IN PROGRESS: En route to your destination.');
          } else if (st === 'completed') {
            setStatusMessage('TRIP COMPLETED: Thank you for riding with Trivora.');
            if (intervalId) clearInterval(intervalId);
            setTimeout(() => {
              goToTripSummary();
            }, 800);
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

  const webViewRef = React.useRef<any>(null);

  const initialDrvLat = pLat - 0.005;
  const initialDrvLng = pLng - 0.006;

  const mapHtml = React.useMemo(() => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  html, body, #map { height:100%; width:100%; margin:0; padding:0; background: #f8fafc; }
  .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', { zoomControl: false }).setView([${pLat}, ${pLng}], 14);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '© Google Maps'
  }).addTo(map);

  // ── Tricycle base64 image asset matching Driver App
  var tricycleBase64 = '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';

  var tricycleIcon = L.divIcon({
    className: '',
    html: '<div style="width:36px; height:36px; background:#FFFFFF; border:2px solid #1E2A5A; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(30,42,90,0.25);"><img src="data:image/png;base64,' + tricycleBase64 + '" style="width:20px; height:20px; object-fit:contain;" /></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  // ── Green pickup pin matching Driver App
  var pickupIcon = L.divIcon({
    className: '',
    html: '<div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(34,197,94,0.4));"><svg width="28" height="34" viewBox="0 0 26 32" fill="none"><path d="M13 0C5.82 0 0 5.82 0 13C0 22.75 13 32 13 32C13 32 26 22.75 26 13C26 5.82 20.18 0 13 0Z" fill="#22C55E"/><circle cx="13" cy="12" r="5" fill="#FFFFFF"/></svg></div>',
    iconSize: [28, 34],
    iconAnchor: [14, 34]
  });

  // ── Red destination pin
  var destIcon = L.divIcon({
    className: '',
    html: '<div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(239,68,68,0.4));"><svg width="28" height="34" viewBox="0 0 26 32" fill="none"><path d="M13 0C5.82 0 0 5.82 0 13C0 22.75 13 32 13 32C13 32 26 22.75 26 13C26 5.82 20.18 0 13 0Z" fill="#EF4444"/><circle cx="13" cy="12" r="5" fill="#FFFFFF"/></svg></div>',
    iconSize: [28, 34],
    iconAnchor: [14, 34]
  });

  var destMarker = L.marker([${dLat}, ${dLng}], { icon: destIcon, zIndexOffset: 800 }).addTo(map).bindPopup('<b>Destination</b>: ${destination}');
  var pickupMarker = L.marker([${pLat}, ${pLng}], { icon: pickupIcon, zIndexOffset: 950 }).addTo(map).bindPopup('<b>Pickup Location</b>');
  var driverMarker = L.marker([${initialDrvLat}, ${initialDrvLng}], { icon: tricycleIcon, zIndexOffset: 1000 }).addTo(map).bindPopup('<b>Driver</b><br/>En route to pickup location');

  // Immediately Draw Both Polyline Vectors (Zero flickering!)
  var driverPolyline = L.polyline([[${initialDrvLat}, ${initialDrvLng}], [${pLat}, ${pLng}]], {
    color: '#F59E0B',
    weight: 6,
    opacity: 0.9,
    dashArray: '8, 8'
  }).addTo(map);

  var tripPolyline = L.polyline([[${pLat}, ${pLng}], [${dLat}, ${dLng}]], {
    color: '#2563EB',
    weight: 6,
    opacity: 0.9
  }).addTo(map);

  var allBounds = L.latLngBounds([
    [${initialDrvLat}, ${initialDrvLng}],
    [${pLat}, ${pLng}],
    [${dLat}, ${dLng}]
  ]);
  map.fitBounds(allBounds, { padding: [50, 50] });

  // Asynchronously Upgrade to OSRM Road Geometry
  var url1 = 'https://router.project-osrm.org/route/v1/driving/' + ${initialDrvLng} + ',' + ${initialDrvLat} + ';' + ${pLng} + ',' + ${pLat} + '?overview=full&geometries=geojson';
  var url2 = 'https://router.project-osrm.org/route/v1/driving/' + ${pLng} + ',' + ${pLat} + ';' + ${dLng} + ',' + ${dLat} + '?overview=full&geometries=geojson';

  Promise.all([
    fetch(url1).then(function(r) { return r.json(); }).catch(function() { return null; }),
    fetch(url2).then(function(r) { return r.json(); }).catch(function() { return null; })
  ]).then(function(results) {
    if (results[0] && results[0].routes && results[0].routes.length > 0) {
      var coords1 = results[0].routes[0].geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
      map.removeLayer(driverPolyline);
      driverPolyline = L.polyline(coords1, { color: '#F59E0B', weight: 6, opacity: 0.9, dashArray: '8, 8' }).addTo(map);
    }
    if (results[1] && results[1].routes && results[1].routes.length > 0) {
      var coords2 = results[1].routes[0].geometry.coordinates.map(function(c) { return [c[1], c[0]]; });
      map.removeLayer(tripPolyline);
      tripPolyline = L.polyline(coords2, { color: '#2563EB', weight: 6, opacity: 0.9 }).addTo(map);
    }
  });

  // ── Handle live GPS updates without reloads or flickering
  var currentStatus = 'accepted';

  window.updateDriverPosition = function(status, curLat, curLng) {
    currentStatus = status;

    if (driverMarker) {
      driverMarker.setLatLng([curLat, curLng]);
    }

    if (status === 'in_transit') {
      // AFTER PICKUP: Remove Driver -> Pickup route and Pickup pin
      if (driverPolyline) {
        map.removeLayer(driverPolyline);
        driverPolyline = null;
      }
      if (pickupMarker) {
        map.removeLayer(pickupMarker);
        pickupMarker = null;
      }

      // Dynamic update: Driver location -> Destination
      if (tripPolyline) {
        var existingCoords = tripPolyline.getLatLngs();
        if (existingCoords && existingCoords.length > 0) {
          existingCoords[0] = L.latLng(curLat, curLng);
          tripPolyline.setLatLngs(existingCoords);
        } else {
          tripPolyline.setLatLngs([[curLat, curLng], [${dLat}, ${dLng}]]);
        }
      }
    } else {
      // BEFORE PICKUP (accepted / arrived): Both routes render simultaneously!
      // 1. Update Driver -> Pickup route
      if (driverPolyline) {
        var existingDriverCoords = driverPolyline.getLatLngs();
        if (existingDriverCoords && existingDriverCoords.length > 0) {
          existingDriverCoords[0] = L.latLng(curLat, curLng);
          driverPolyline.setLatLngs(existingDriverCoords);
        } else {
          driverPolyline.setLatLngs([[curLat, curLng], [${pLat}, ${pLng}]]);
        }
      } else {
        driverPolyline = L.polyline([[curLat, curLng], [${pLat}, ${pLng}]], {
          color: '#F59E0B',
          weight: 6,
          opacity: 0.9,
          dashArray: '8, 8'
        }).addTo(map);
      }

      // 2. Preserve Pickup pin & Pickup -> Destination route intact
      if (!pickupMarker) {
        pickupMarker = L.marker([${pLat}, ${pLng}], { icon: pickupIcon, zIndexOffset: 900 }).addTo(map).bindPopup('<b>Pickup Location</b>');
      } else if (!map.hasLayer(pickupMarker)) {
        pickupMarker.addTo(map);
      }

      if (tripPolyline && !map.hasLayer(tripPolyline)) {
        tripPolyline.addTo(map);
      }
    }
  };
</script>
</body>
</html>
`;
  }, [pLat, pLng, dLat, dLng, destination]);

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <View style={styles.container}>

      {/* FULL SCREEN MAP */}
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        originWhitelist={['*']}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* REAL-TIME TRIP STATUS BANNER (FLOATING TOP) */}
      <View style={styles.statusBanner}>
        <Ionicons name="radio" size={16} color="#FFFFFF" style={{ marginTop: 2 }} />
        <Text style={styles.statusBannerText}>{statusMessage}</Text>
      </View>

      {/* FLOATING BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.black} />
      </TouchableOpacity>

      {/* COLLAPSIBLE BOTTOM SHEET CARD */}
      <View style={[styles.bottomSheet, isExpanded ? styles.bottomSheetExpanded : styles.bottomSheetCollapsed]}>
        
        {/* DRAG / TOGGLE HANDLE */}
        <TouchableOpacity
          style={styles.handleArea}
          activeOpacity={0.7}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.handleBar} />
        </TouchableOpacity>

        {/* ALWAYS VISIBLE PEEK HEADER */}
        <TouchableOpacity
          style={styles.peekHeader}
          activeOpacity={0.9}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.driverMetaRow}>
            <View style={styles.driverAvatarBadge}>
              <Image
                source={require('../assets/tricycle.png')}
                style={styles.tricycleIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.driverNames}>
              <Text style={styles.driverTitle}>{activeDriver.name}</Text>
              <Text style={styles.driverSubtitle}>{activeDriver.plateNumber} · {activeDriver.todaName}</Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.iconCircleBtn}
              onPress={() => Alert.alert('Call Driver', `Calling ${activeDriver.name} (${activeDriver.mobile})...`)}
            >
              <Ionicons name="call" size={18} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleChevron}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-up'} size={22} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* EXPANDABLE DETAILS CONTENT */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* DESTINATION ROW */}
            <View style={styles.destinationBox}>
              <Ionicons name="location-sharp" size={22} color={COLORS.primary} />
              <View style={styles.destinationContent}>
                <Text style={styles.destinationLabel}>Pinned Destination</Text>
                <Text style={styles.destinationText} numberOfLines={2}>{destination}</Text>
              </View>
            </View>

            {/* METRICS GRID */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Est. Fare</Text>
                <Text style={styles.metricValueFare}>{estimatedFare}</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Distance</Text>
                <Text style={styles.metricValue}>{distance}</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Est. Time</Text>
                <Text style={styles.metricValue}>{eta}</Text>
              </View>
            </View>
          </View>
        )}
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

  bottomSheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    zIndex: 100,
  },
  bottomSheetCollapsed: {
    paddingTop: 8,
  },
  bottomSheetExpanded: {
    paddingTop: 8,
  },

  handleArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  handleBar: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },

  peekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  driverMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tricycleIcon: {
    width: 28,
    height: 28,
  },
  driverNames: {
    flex: 1,
  },
  driverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  driverSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  toggleChevron: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  destinationContent: {
    marginLeft: 10,
    flex: 1,
  },
  destinationLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  destinationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 1,
  },

  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 10,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metricValueFare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
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
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    lineHeight: 18,
  },
});