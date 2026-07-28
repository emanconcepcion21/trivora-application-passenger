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
import { usePassenger } from '../context/PassengerContext';

export default function RideHistoryScreen() {
  const { passenger } = usePassenger();
  const [ridesList, setRidesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '172.20.10.2';
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const host = getHost();
        const userId = passenger ? (passenger.id || passenger.user_id) : '';
        const url = userId
          ? `http://${host}:8000/api/v1/passenger/bookings/history?user_id=${userId}`
          : `http://${host}:8000/api/v1/passenger/bookings/history`;

        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
        });
        const data = await res.json();
        const rawBookings = data.bookings || data.history || [];
        if (rawBookings && rawBookings.length > 0) {
          const parsed = rawBookings.map((b: any) => {
            const dateObj = new Date(b.created_at || b.requested_at || Date.now());
            const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            const ratingObj = Array.isArray(b.rating) ? b.rating[0] : b.rating;
            const tripRating = ratingObj?.score ? `${Number(ratingObj.score).toFixed(1)} Stars` : 'Not Rated Yet';
            const tripComment = ratingObj?.comment || null;

            return {
              id: b.id.toString(),
              bookingCode: b.booking_code,
              date: `${formattedDate} · ${formattedTime}`,
              time: formattedTime,
              pickup: b.pickup_name || 'Pickup Point',
              destination: b.dropoff_name || 'Destination Point',
              fare: `₱${parseFloat(b.fare_amount || 0).toFixed(2)}`,
              driver: b.driver?.user?.name || 'Assigned Driver',
              rating: tripRating,
              comment: tripComment,
              duration: b.estimated_duration_mins ? `${b.estimated_duration_mins} mins` : '10 mins',
              status: (b.status || 'completed').toUpperCase(),
            };
          });
          setRidesList(parsed);
        } else {
          setRidesList([]);
        }
      } catch (e) {
        console.log('[Passenger History] Poll notice:', e);
        setRidesList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [passenger]);

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
          <View style={styles.emptyIconBadge}>
            <Ionicons name="receipt-outline" size={42} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Ride History Yet</Text>
          <Text style={styles.emptySub}>You haven't completed any tricycle rides yet. Book your first ride in Nasugbu!</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="location" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.emptyButtonText}>Book a Ride Now</Text>
          </TouchableOpacity>
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

                    {item.comment ? (
                      <Text style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', marginTop: 6, marginBottom: 4 }}>
                        "{item.comment}"
                      </Text>
                    ) : null}

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
  emptyButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});