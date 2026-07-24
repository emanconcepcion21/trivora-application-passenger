import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../theme/colors';

export default function DriverDetailsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://i.pravatar.cc/300?img=12',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          Juan Dela Cruz
        </Text>

        <Text style={styles.vehicle}>
          Honda TMX 155
        </Text>

        <Text style={styles.plate}>
          Plate No: ABC-1234
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons
            name="star"
            size={20}
            color="#FFD700"
          />

          <Text style={styles.rating}>
            4.9 Rating
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.replace('Tracking')
          }
        >
          <Ionicons
            name="navigate"
            size={22}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Start Tracking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  vehicle: {
    marginTop: 8,
    fontSize: 18,
    color: COLORS.black,
  },

  plate: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  rating: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },

  button: {
    marginTop: 35,
    width: '100%',
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  buttonText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});