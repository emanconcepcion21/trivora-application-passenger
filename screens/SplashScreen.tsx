import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import COLORS from '../theme/colors';

export default function SplashScreen() {

  const navigation = useNavigation<any>();

  useEffect(() => {

    const timer = setTimeout(() => {

      navigation.replace('Login');

    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.content}>

        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
          }}
          style={styles.logo}
        />

        <Text style={styles.title}>
          TRIVORA
        </Text>

        <Text style={styles.subtitle}>
          Passenger Application
        </Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ marginTop: 40 }}
        />

      </View>

      <Text style={styles.version}>
        Version 1.0.0
      </Text>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 160,
    height: 160,
    marginBottom: 25,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
  },

  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    marginTop: 10,
  },

  version: {
    color: '#FFFFFF',
    fontSize: 14,
  },

});