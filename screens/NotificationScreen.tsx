import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { usePassenger } from '../context/PassengerContext';

export default function NotificationScreen() {
  const { passenger } = usePassenger();
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.204';
  };

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const host = getHost();
        const items: any[] = [];
        const userId = passenger ? (passenger.id || passenger.user_id) : '';
        const userParam = userId ? `?user_id=${userId}` : '';

        // 1. Fetch Active Booking Notifications for logged-in user
        try {
          const activeRes = await fetch(`http://${host}:8000/api/v1/passenger/bookings/active${userParam}`, {
            headers: { 'Accept': 'application/json' },
          });
          const activeData = await activeRes.json();
          if (activeData.booking) {
            const b = activeData.booking;
            const driverName = b.driver?.user?.name || 'Assigned Driver';
            const code = b.booking_code || `#${b.id}`;

            if (b.status === 'pending') {
              items.push({
                id: `act-${b.id}-pending`,
                title: 'Searching for Driver',
                message: `Your booking request ${code} near ${b.pickup_name || 'pickup'} is being dispatched to nearby TODA drivers.`,
                time: 'Live',
                type: 'system',
              });
            } else if (b.status === 'accepted') {
              items.push({
                id: `act-${b.id}-accepted`,
                title: 'Driver Accepted Ride',
                message: `${driverName} accepted booking ${code} and is heading to ${b.pickup_name || 'pickup'}.`,
                time: 'Live',
                type: 'accepted',
              });
            } else if (b.status === 'arrived') {
              items.push({
                id: `act-${b.id}-arrived`,
                title: 'Driver Arrived at Pickup',
                message: `${driverName} has arrived at ${b.pickup_name || 'pickup location'}!`,
                time: 'Live',
                type: 'arrived',
              });
            } else if (b.status === 'in_transit') {
              items.push({
                id: `act-${b.id}-transit`,
                title: 'Trip in Progress',
                message: `Heading to ${b.dropoff_name || 'destination'}. Fare: ₱${parseFloat(b.fare_amount || 0).toFixed(2)}.`,
                time: 'Live',
                type: 'transit',
              });
            }
          }
        } catch (err) {}

        // 2. Fetch Completed & History Booking Notifications for logged-in user
        try {
          const historyRes = await fetch(`http://${host}:8000/api/v1/passenger/bookings/history${userParam}`, {
            headers: { 'Accept': 'application/json' },
          });
          const historyData = await historyRes.json();
          const rawHistory = historyData.bookings || historyData.history || [];

          rawHistory.slice(0, 10).forEach((b: any) => {
            const dateStr = b.created_at || b.requested_at
              ? new Date(b.created_at || b.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Recent';
            const fare = `₱${parseFloat(b.fare_amount || 0).toFixed(2)}`;
            const code = b.booking_code || `#${b.id}`;

            if (b.status === 'completed') {
              items.push({
                id: `hist-${b.id}-comp`,
                title: 'Trip Completed Successfully',
                message: `Completed ride ${code} to ${b.dropoff_name || 'Destination'}. Total fare paid: ${fare}.`,
                time: dateStr,
                type: 'accepted',
              });
            } else if (b.status === 'cancelled') {
              items.push({
                id: `hist-${b.id}-canc`,
                title: 'Booking Cancelled',
                message: `Booking ${code} from ${b.pickup_name || 'Pickup'} was cancelled.`,
                time: dateStr,
                type: 'system',
              });
            }
          });
        } catch (err) {}

        // 3. Official System & Safety Broadcasts
        items.push({
          id: 'sys-1',
          title: 'Welcome to TRIVORA',
          message: 'Book TODA tricycles easily anytime across Nasugbu, Batangas.',
          time: 'System',
          type: 'system',
        });

        items.push({
          id: 'sys-2',
          title: 'Official TODA Fare Matrix',
          message: 'Fares comply strictly with Nasugbu LGU Municipal Ordinance fare standards.',
          time: 'Info',
          type: 'accepted',
        });

        setNotificationsList(items);
      } catch (e) {
        console.log('[Passenger Notifications] Poll notice:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [passenger]);

  return (
    <View style={styles.container}>
      {/* PRIMARY BLUE HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Passenger Portal</Text>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching notifications...</Text>
        </View>
      ) : notificationsList.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIconBadge}>
            <Ionicons name="notifications-off-outline" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Unread Notifications</Text>
          <Text style={styles.emptySub}>You're all caught up! Live ride updates, TODA announcements, and receipts will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={notificationsList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={
                    item.type === 'accepted'
                      ? 'checkmark-circle'
                      : item.type === 'arrived'
                      ? 'location'
                      : item.type === 'transit'
                      ? 'navigate'
                      : 'notifications'
                  }
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.heading}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    alignItems: 'center',
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tricycle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  message: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },

  time: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
  loadingWrapper: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptyWrapper: {
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});