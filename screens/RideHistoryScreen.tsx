import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
} from 'react-native';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(
      expandedId === id
        ? null
        : id
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >

      <Text
        style={styles.title}
      >
        Ride History
      </Text>

      <SectionList
        sections={groupedRides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}

        renderSectionHeader={({
          section: { title },
        }) => (
          <Text
            style={styles.sectionHeader}
          >
            {title}
          </Text>
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      '#F5F7FB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color:
      COLORS.primary,
    marginBottom: 20,
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

});