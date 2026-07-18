import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function BookRideButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons
        name="car-sport"
        size={28}
        color="#FFFFFF"
      />

      <Text style={styles.text}>
        BOOK A TRICYCLE
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 18,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
