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
        date: 'July 18, 2026',
        pickup: 'Nasugbu Public Market',
        destination: 'BatStateU Nasugbu',
        fare: '₱25',
        driver: 'Juan Dela Cruz',
        rating: '4.8',
        duration: '15 mins',
        status: 'Completed',
      },
      {
        id: '2',
        date: 'July 17, 2026',
        pickup: 'Jollibee Nasugbu',
        destination: 'Wawa',
        fare: '₱18',
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
        date: 'June 16, 2026',
        pickup: 'SM Hypermarket',
        destination: 'Kaylaway',
        fare: '₱35',
        driver: 'Mark Reyes',
        rating: '5.0',
        duration: '20 mins',
        status: 'Cancelled',
      },
    ],
  },
];

export default function RideHistoryScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>
        Ride History
      </Text>

      <SectionList
        sections={groupedRides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          
          return (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.9} 
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.topRow}>
                <Image
                  source={require('../assets/tricycle.png')}
                  style={styles.tricycleIcon}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.driver}>Driver: {item.driver}</Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    { color: item.status === 'Completed' ? COLORS.success : COLORS.danger },
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={20} color={COLORS.primary} />
                  <Text style={styles.locationText}>{item.pickup}</Text>
                </View>
                
                <View style={styles.dashedLine} />

                <View style={styles.locationRow}>
                  <Ionicons name="flag" size={20} color={COLORS.primary} />
                  <Text style={styles.locationText}>{item.destination}</Text>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.fare}>Fare: {item.fare}</Text>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.gray} />
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="star" size={16} color="#FBBF24" />
                      <Text style={styles.detailText}>{item.rating}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={16} color={COLORS.primary} />
                      <Text style={styles.detailText}>{item.duration}</Text>
                    </View>
                  </View>
                  
                  {item.status === 'Completed' && (
                    <TouchableOpacity style={styles.bookAgainButton}>
                      <Text style={styles.bookAgainText}>Book Again</Text>
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
    backgroundColor: COLORS.background,
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
    marginBottom: 15,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  date: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  driver: {
    marginTop: 4,
    color: COLORS.gray,
  },

  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 10,
    color: COLORS.black,
    fontSize: 15,
  },

  routeContainer: {
    marginTop: 15,
  },

  dashedLine: {
    height: 15,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginLeft: 9,
    marginVertical: 2,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: 12,
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },

  tricycleIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailText: {
    marginLeft: 6,
    color: COLORS.gray,
    fontWeight: '600',
  },

  bookAgainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  bookAgainText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});