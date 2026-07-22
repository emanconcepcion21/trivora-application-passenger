import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import COLORS from '../theme/colors';

export default function BookRideButton() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Booking')}
    >
      <Image
        source={require('../assets/tricycle.png')}
        style={styles.tricycleIcon}
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

  tricycleIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
