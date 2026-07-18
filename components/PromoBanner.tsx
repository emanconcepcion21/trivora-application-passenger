import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function PromoBanner() {

  return (

    <View style={styles.container}>

      <Ionicons
        name="gift"
        size={45}
        color="white"
      />

      <View style={{ marginLeft:15 }}>

        <Text style={styles.title}>
          Welcome to TRIVORA!
        </Text>

        <Text style={styles.subtitle}>
          Enjoy safe and convenient tricycle rides.
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    marginHorizontal:20,
    marginVertical:25,

    backgroundColor:COLORS.primary,

    borderRadius:20,

    padding:20,

    flexDirection:'row',

    alignItems:'center',

    elevation:6,
  },

  title:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
  },

  subtitle:{
    color:'#E5E7EB',
    marginTop:5,
    width:'90%',
  },

});
