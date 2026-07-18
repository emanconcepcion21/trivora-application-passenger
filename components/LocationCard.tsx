import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function LocationCard() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="location"
        size={30}
        color={COLORS.primary}
      />

      <View style={styles.textContainer}>

        <Text style={styles.label}>
          Current Location
        </Text>

        <Text style={styles.location}>
          Nasugbu, Batangas
        </Text>

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
