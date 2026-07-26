import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function RecentTripCard() {
  const navigation = useNavigation<any>();
  const [recentTrip, setRecentTrip] = useState<any>(null);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  useEffect(() => {
    async function fetchRecentTrip() {
      try {
        const host = getHost();
        const response = await fetch(`http://${host}:8000/api/v1/passenger/bookings/history`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        if (data.bookings && data.bookings.length > 0) {
          setRecentTrip(data.bookings[0]);
        }
      } catch (e) {
        console.log('[Passenger RecentTrip] Poll notice:', e);
      }
    }

    fetchRecentTrip();
  }, []);

  if (!recentTrip) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Recent Trip</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="time-outline" size={24} color={COLORS.gray} />
          <Text style={styles.emptyText}>No recent trips recorded yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Recent Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.viewAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons
            name="location"
            size={24}
            color={COLORS.primary}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.place} numberOfLines={1}>
              {recentTrip.pickup_name || 'Pickup Point'}
            </Text>
            <Text style={styles.destination} numberOfLines={1}>
              To: {recentTrip.dropoff_name || 'Destination'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(recentTrip.created_at || recentTrip.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <Text style={styles.price}>
            ₱{parseFloat(recentTrip.fare_amount || 0).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    elevation: 2,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  place: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  destination: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  date: {
    color: COLORS.gray,
    fontSize: 13,
  },
  price: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
