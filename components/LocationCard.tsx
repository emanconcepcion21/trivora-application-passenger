import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function LocationCard() {
  const [addressName, setAddressName] = useState('Nasugbu, Batangas');

  useEffect(() => {
    async function fetchAddress() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (loc && loc.coords) {
            const results = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
            if (results && results.length > 0) {
              const item = results[0];
              const isValidName = (str?: string | null) => str && !/^\d+$/.test(str.trim()) && !str.includes('+');
              
              const streetNumber = isValidName(item.streetNumber) ? item.streetNumber!.trim() : null;
              const streetName = isValidName(item.street) ? item.street!.trim() : null;
              const fullStreet = streetName ? (streetNumber ? `${streetNumber} ${streetName}` : streetName) : null;

              const name = isValidName(item.name) ? item.name!.trim() : null;
              const district = isValidName(item.district) ? item.district!.trim() : null;
              const city = isValidName(item.city) ? item.city!.trim() : 'Nasugbu';

              const mainPlace = fullStreet || name || district || 'Brgy. Poblacion';
              setAddressName(`${mainPlace}, ${city}`);
            }
          }
        }
      } catch (e) {}
    }
    fetchAddress();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="location"
        size={30}
        color={COLORS.primary}
      />

      <View style={styles.textContainer}>
        <Text style={styles.label}>Current Location</Text>
        <Text style={styles.location}>{addressName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    backgroundColor:'#fff',

    marginHorizontal:20,

    marginTop:-20,

    padding:20,

    borderRadius:20,

    elevation:5,

    flexDirection:'row',

    alignItems:'center',
  },

  textContainer:{
    marginLeft:15,
  },

  label:{
    color:COLORS.gray,
    fontSize:14,
  },

  location:{
    marginTop:5,
    fontSize:18,
    fontWeight:'bold',
    color:COLORS.black,
  },

});
