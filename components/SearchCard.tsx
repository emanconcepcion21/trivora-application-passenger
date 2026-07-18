import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function SearchCard() {
  return (

    <TouchableOpacity style={styles.container}>

      <Ionicons
        name="search"
        size={22}
        color="#999"
      />

      <Text style={styles.placeholder}>
        Where are you going?
      </Text>

    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  container:{
    backgroundColor:'#fff',

    marginHorizontal:20,

    marginTop:20,

    padding:18,

    borderRadius:18,

    flexDirection:'row',

    alignItems:'center',

    elevation:4,
  },

  placeholder:{
    marginLeft:12,
    color:'#999',
    fontSize:16,
  },

});