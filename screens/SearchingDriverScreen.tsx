import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { usePassenger } from '../context/PassengerContext';

export default function SearchingDriverScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { passenger } = usePassenger();

  const params = route.params || {};
  const pickupName = params.pickupName || 'Current Location';
  const dropoffName = params.dropoffName || 'Pinned Destination';
  const fareAmount = params.fareAmount || 45;
  const distanceKm = params.distanceKm || 2.5;

  const bookingIdRef = React.useRef<number | null>(params.bookingId || null);

  const [bookingId, setBookingId] = useState<number | null>(params.bookingId || null);
  const [bookingCode, setBookingCode] = useState<string>(params.bookingCode || 'BK-SEARCHING');
  const [todaName, setTodaName] = useState<string>(params.todaName || 'Nearest TODA');
  const [statusText, setStatusText] = useState('Waiting for driver to accept...');

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  // Step 1: Initialize or Request Booking via API
  useEffect(() => {
    let isMounted = true;

    async function initBooking() {
      if (params.bookingId) {
        bookingIdRef.current = params.bookingId;
        return;
      }

      const host = getHost();
      const url = `http://${host}:8000/api/v1/passenger/bookings/request`;
      const userId = passenger ? (passenger.id || passenger.user_id) : '';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            passenger_id: userId,
            pickup_name: pickupName,
            pickup_lat: params.pickupLat || 14.137,
            pickup_lng: params.pickupLng || 120.637,
            dropoff_name: dropoffName,
            dropoff_lat: params.dropoffLat || 14.0685,
            dropoff_lng: params.dropoffLng || 120.6285,
            fare_amount: fareAmount,
            distance_km: distanceKm,
            estimated_duration_mins: 8,
          }),
        });

        const data = await response.json();
        if (isMounted && response.ok && data.booking) {
          bookingIdRef.current = data.booking.id;
          setBookingId(data.booking.id);
          setBookingCode(data.booking.booking_code);
          if (data.booking.toda_zone) {
            setTodaName(data.booking.toda_zone.name);
          }
        }
      } catch (e) {
        console.log('[SearchingScreen] Booking API notice:', e);
      }
    }

    initBooking();

    return () => {
      isMounted = false;
    };
  }, [passenger]);

  // Step 2: Poll for Driver Acceptance
  useEffect(() => {
    let intervalId: any = null;
    const host = getHost();

    async function checkStatus() {
      try {
        const currentBookingId = bookingIdRef.current || '';
        const userId = passenger ? (passenger.id || passenger.user_id || '') : '';
        const pollUrl = currentBookingId
          ? `http://${host}:8000/api/v1/passenger/bookings/active?booking_id=${currentBookingId}&user_id=${userId}`
          : `http://${host}:8000/api/v1/passenger/bookings/active?user_id=${userId}`;

        const response = await fetch(pollUrl, {
          headers: { 'Accept': 'application/json' },
        });
        const text = await response.text();
        if (!text || text.trim().length === 0) return;
        const data = JSON.parse(text);

        if (data.booking) {
          if (data.booking.id) {
            bookingIdRef.current = data.booking.id;
          }
          if (data.booking.toda_zone) {
            setTodaName(data.booking.toda_zone.name);
          }

          if (['accepted', 'arrived', 'in_transit'].includes(data.booking.status)) {
            clearInterval(intervalId);
            navigation.replace('Tracking', {
              booking: data.booking,
              destination: data.booking.dropoff_name,
              pickupLatitude: parseFloat(data.booking.pickup_lat) || 14.0637,
              pickupLongitude: parseFloat(data.booking.pickup_lng) || 120.6274,
              destinationLatitude: parseFloat(data.booking.dropoff_lat) || 14.0701,
              destinationLongitude: parseFloat(data.booking.dropoff_lng) || 120.6339,
              estimatedFare: `₱${parseFloat(data.booking.fare_amount).toFixed(2)}`,
              distance: `${data.booking.distance_km} km`,
            });
          }
        }
      } catch (e) {
        console.log('[SearchingScreen] Status poll notice:', e);
      }
    }

    intervalId = setInterval(checkStatus, 3000);
    return () => clearInterval(intervalId);
  }, [passenger]);

  const handleCancel = async () => {
    const host = getHost();
    const targetId = bookingIdRef.current || bookingId;

    try {
      if (targetId) {
        await fetch(`http://${host}:8000/api/v1/passenger/bookings/${targetId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: 'cancelled', cancellation_reason: 'Cancelled by passenger' }),
        });
      } else {
        // Fallback: Cancel active booking via active endpoint
        await fetch(`http://${host}:8000/api/v1/passenger/bookings/active/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: 'cancelled', cancellation_reason: 'Cancelled by passenger' }),
        });
      }
    } catch (e) {
      console.log('Cancel error:', e);
    }
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SEARCHING DRIVER</Text>
        </View>
        <Text style={styles.todaHeader}>Dispatched to {todaName}</Text>
      </View>

      {/* RADAR ANIMATION CONTAINER */}
      <View style={styles.radarWrapper}>
        <View style={styles.outerRing}>
          <View style={styles.innerRing}>
            <Ionicons name="tricycle" size={48} color={COLORS.primary} />
          </View>
        </View>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      </View>

      <Text style={styles.title}>{statusText}</Text>
      <Text style={styles.subtitle}>
        Your booking request was sent to drivers in <Text style={{ fontWeight: 'bold' }}>{todaName}</Text>.
      </Text>

      {/* TRIP SUMMARY CARD */}
      <View style={styles.tripCard}>
        <View style={styles.locRow}>
          <Ionicons name="radio-button-on" size={18} color="#10B981" style={{ marginTop: 2 }} />
          <Text style={styles.locText}>{pickupName}</Text>
        </View>
        <View style={styles.connector} />
        <View style={styles.locRow}>
          <Ionicons name="location" size={18} color="#EF4444" style={{ marginTop: 2 }} />
          <Text style={styles.locText}>{dropoffName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Estimated Fare</Text>
          <Text style={styles.metaValue}>₱{fareAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* CANCEL BUTTON */}
      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
        <Text style={styles.cancelText}>CANCEL REQUEST</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  todaHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },

  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  innerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginHorizontal: 15,
    lineHeight: 18,
  },

  tripCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 10,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: '#CBD5E1',
    marginLeft: 8,
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    width: '100%',
    height: 52,
    borderRadius: 16,
    marginBottom: 10,
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});