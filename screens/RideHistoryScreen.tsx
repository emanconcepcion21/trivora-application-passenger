import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import COLORS from '../theme/colors';

const rides = [
  {
    id: '1',
    destination: 'Nasugbu Plaza',
    fare: '₱35',
    date: 'July 24, 2026',
    status: 'Completed',
  },
  {
    id: '2',
    destination: 'Brgy. Wawa',
    fare: '₱40',
    date: 'July 23, 2026',
    status: 'Completed',
  },
  {
    id: '3',
    destination: 'Brgy. Bucana',
    fare: '₱55',
    date: 'July 22, 2026',
    status: 'Completed',
  },
];

export default function RideHistoryScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Ride History
      </Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.iconContainer}>

              <Image
                source={require('../assets/tricycle.png')}
                style={styles.tricycle}
              />

            </View>

            <View style={styles.info}>

              <Text style={styles.destination}>
                {item.destination}
              </Text>

              <Text style={styles.date}>
                {item.date}
              </Text>

              <Text style={styles.status}>
                {item.status}
              </Text>

            </View>

            <Text style={styles.fare}>
              {item.fare}
            </Text>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 5,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tricycle: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  destination: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  date: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },

  status: {
    marginTop: 6,
    color: '#16A34A',
    fontWeight: '600',
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});