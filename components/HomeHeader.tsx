import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function HomeHeader() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Passenger Portal</Text>
        <Text style={styles.title}>Welcome to TRIVORA</Text>
      </View>

      <TouchableOpacity
        style={styles.notification}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    color: '#fff',
    fontSize: 16,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },

  notification: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',

    justifyContent: 'center',
    alignItems: 'center',
  },
});
