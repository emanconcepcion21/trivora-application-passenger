import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function MapPreview() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="map"
        size={70}
        color={COLORS.primary}
      />

      <Text style={styles.title}>
        Map Preview
      </Text>

      <Text style={styles.subtitle}>
        Google Maps will appear here
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    backgroundColor:'#fff',

    marginHorizontal:20,

    marginTop:20,

    height:220,

    borderRadius:20,

    justifyContent:'center',

    alignItems:'center',

    elevation:5,
  },

  title:{
    fontSize:20,
    fontWeight:'bold',
    color:COLORS.black,
    marginTop:10,
  },

  subtitle:{
    marginTop:5,
    color:COLORS.gray,
  },

});
