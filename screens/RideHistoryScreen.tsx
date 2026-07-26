import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

const groupedRides = [
  {
    title: 'This Week',
    data: [
      {
        id: '1',
        date: 'July 24, 2026',
        pickup: 'Nasugbu Plaza',
        destination: 'Nasugbu Plaza',
        fare: '₱35',
        driver: 'Juan Dela Cruz',
        rating: '4.8',
        duration: '15 mins',
        status: 'Completed',
      },
      {
        id: '2',
        date: 'July 23, 2026',
        pickup: 'Jollibee Nasugbu',
        destination: 'Brgy. Wawa',
        fare: '₱40',
        driver: 'Pedro Santos',
        rating: '4.9',
        duration: '10 mins',
        status: 'Completed',
      },
    ],
  },
  {
    title: 'Last Month',
    data: [
      {
        id: '3',
        date: 'July 22, 2026',
        pickup: 'SM Hypermarket',
        destination: 'Brgy. Bucana',
        fare: '₱55',
        driver: 'Mark Reyes',
        rating: '5.0',
        duration: '20 mins',
        status: 'Completed',
      },
    ],
  },
];

export default function RideHistoryScreen() {
  const [ridesList, setRidesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const host = getHost();
        const res = await fetch(`http://${host}:8000/api/v1/passenger/bookings/history`, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        const rawBookings = data.bookings || data.history || [];
        if (rawBookings.length > 0) {
          const parsed = rawBookings.map((b: any) => ({
            id: b.id.toString(),
            bookingCode: b.booking_code,
            date: new Date(b.created_at || b.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            pickup: b.pickup_name || 'Pickup Point',
            destination: b.dropoff_name || 'Destination Point',
            fare: `₱${parseFloat(b.fare_amount || 0).toFixed(2)}`,
            driver: b.driver?.user?.name || 'Assigned Driver',
            rating: b.driver?.rating || '5.0',
            duration: b.estimated_duration_mins ? `${b.estimated_duration_mins} mins` : '10 mins',
            status: (b.status || 'completed').toUpperCase(),
          }));
          setRidesList(parsed);
        }
      } catch (e) {
        console.log('[Passenger History] Poll notice:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* PRIMARY BLUE HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Passenger Portal</Text>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading trip history...</Text>
        </View>
      ) : ridesList.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Ionicons name="receipt-outline" size={48} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>No Ride History Yet</Text>
          <Text style={styles.emptySub}>Your completed tricycle trips will appear here.</Text>
        </View>
      ) : (
        <SectionList
          sections={[{ title: 'Recent Activity', data: ridesList }]}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => {

          const isExpanded =
            expandedId === item.id;

          return (

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                toggleExpand(item.id)
              }
            >

              {/* TOP ROW */}

              <View
                style={styles.topRow}
              >

                <View
                  style={
                    styles.iconContainer
                  }
                >

                  <Image
                    source={require(
                      '../assets/tricycle.png'
                    )}
                    style={
                      styles.tricycleIcon
                    }
                  />

                </View>

                <View
                  style={
                    styles.driverContainer
                  }
                >

                  <Text
                    style={styles.date}
                  >
                    {item.date}
                  </Text>

                  <Text
                    style={styles.driver}
                  >
                    Driver: {item.driver}
                  </Text>

                </View>

                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        item.status ===
                        'Completed'
                          ? COLORS.success
                          : COLORS.danger,
                    },
                  ]}
                >
                  {item.status}
                </Text>

              </View>

              {/* ROUTE */}

              <View
                style={
                  styles.routeContainer
                }
              >

                <View
                  style={
                    styles.locationRow
                  }
                >

                  <Ionicons
                    name="location"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.locationText
                    }
                  >
                    {item.pickup}
                  </Text>

                </View>

                <View
                  style={
                    styles.dashedLine
                  }
                />

                <View
                  style={
                    styles.locationRow
                  }
                >

                  <Ionicons
                    name="flag"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.locationText
                    }
                  >
                    {item.destination}
                  </Text>

                </View>

              </View>

              {/* BOTTOM ROW */}

              <View
                style={styles.bottomRow}
              >

                <Text
                  style={styles.fare}
                >
                  Fare: {item.fare}
                </Text>

                <Ionicons
                  name={
                    isExpanded
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color={
                    COLORS.gray
                  }
                />

              </View>

              {/* EXPANDED DETAILS */}

              {isExpanded && (

                <View
                  style={
                    styles.expandedContent
                  }
                >

                  <View
                    style={
                      styles.detailsRow
                    }
                  >

                    <View
                      style={
                        styles.detailItem
                      }
                    >

                      <Ionicons
                        name="star"
                        size={16}
                        color="#FBBF24"
                      />

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        {item.rating}
                      </Text>

                    </View>

                    <View
                      style={
                        styles.detailItem
                      }
                    >

                      <Ionicons
                        name="time"
                        size={16}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        {item.duration}
                      </Text>

                    </View>

                  </View>

                  {item.status ===
                    'Completed' && (

                    <TouchableOpacity
                      style={
                        styles.bookAgainButton
                      }
                    >

                      <Text
                        style={
                          styles.bookAgainText
                        }
                      >
                        Book Again
                      </Text>

                    </TouchableOpacity>

                  )}

                </View>

              )}

            </TouchableOpacity>

          );

        }}
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

  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color:
      COLORS.black,
    marginTop: 10,
    marginBottom: 15,
  },

  card: {
    backgroundColor:
      '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 5,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor:
      COLORS.primary,
    justifyContent:
      'center',
    alignItems:
      'center',
  },

  tricycleIcon: {
    width: 28,
    height: 28,
    resizeMode:
      'contain',
    tintColor:
      '#FFFFFF',
  },

  driverContainer: {
    flex: 1,
    marginLeft: 12,
  },

  driver: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },

  date: {
    fontSize: 14,
    color: '#777',
  },

  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  routeContainer: {
    marginTop: 15,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 10,
    color:
      COLORS.black,
    fontSize: 15,
    flex: 1,
  },

  dashedLine: {
    height: 15,
    borderLeftWidth: 2,
    borderStyle:
      'dashed',
    borderColor:
      '#D1D5DB',
    marginLeft: 9,
    marginVertical: 2,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems:
      'center',
    marginTop: 18,
    borderTopWidth: 1,
    borderColor:
      '#E5E7EB',
    paddingTop: 12,
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color:
      COLORS.primary,
  },

  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor:
      '#F3F4F6',
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent:
      'space-around',
    marginBottom: 15,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems:
      'center',
  },

  detailText: {
    marginLeft: 6,
    color:
      COLORS.gray,
    fontWeight: '600',
  },

  bookAgainButton: {
    backgroundColor:
      COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems:
      'center',
  },

  bookAgainText: {
    color:
      COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
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
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
  },
});