import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const rides = [
  {
    id: '1',
    date: 'July 18, 2026',
    pickup: 'Nasugbu Public Market',
    destination: 'BatStateU Nasugbu',
    fare: '₱25',
    driver: 'Juan Dela Cruz',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'July 17, 2026',
    pickup: 'Jollibee Nasugbu',
    destination: 'Wawa',
    fare: '₱18',
    driver: 'Pedro Santos',
    status: 'Completed',
  },
  {
    id: '3',
    date: 'July 16, 2026',
    pickup: 'SM Hypermarket',
    destination: 'Kaylaway',
    fare: '₱35',
    driver: 'Mark Reyes',
    status: 'Cancelled',
  },
];

export default function RideHistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>
        Ride History
      </Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.topRow}>

              <Image
  source={require('../assets/tricycle.png')}
  style={styles.tricycleIcon}
/>

              <View style={{ flex: 1, marginLeft: 12 }}>

                <Text style={styles.date}>
                  {item.date}
                </Text>

                <Text style={styles.driver}>
                  Driver: {item.driver}
                </Text>

              </View>

              <Text
                style={[
                  styles.status,
                  {
                    color:
                      item.status === 'Completed'
                        ? COLORS.success
                        : COLORS.danger,
                  },
                ]}
              >
                {item.status}
              </Text>

            </View>

            <View style={styles.locationRow}>

              <Ionicons
                name="location"
                size={20}
                color={COLORS.primary}
              />

              <Text style={styles.locationText}>
                {item.pickup}
              </Text>

            </View>

            <View style={styles.locationRow}>

              <Ionicons
                name="flag"
                size={20}
                color={COLORS.danger}
              />

              <Text style={styles.locationText}>
                {item.destination}
              </Text>

            </View>

            <View style={styles.bottomRow}>

              <Text style={styles.fare}>
                Fare: {item.fare}
              </Text>

            </View>

          </View>

        )}
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
    marginTop: 15,
  },

  locationText: {
    marginLeft: 10,
    color: COLORS.black,
    fontSize: 15,
  },

  bottomRow: {
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

});