import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function RecentTripCard() {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Recent Trip
      </Text>

      <View style={styles.card}>

        <View style={styles.row}>

          <Ionicons
            name="location"
            size={26}
            color={COLORS.primary}
          />

          <View style={{ marginLeft: 12 }}>

            <Text style={styles.place}>
              Batangas State University
            </Text>

            <Text style={styles.destination}>
              Destination: Palico Terminal
            </Text>

          </View>

        </View>

        <View style={styles.footer}>

          <Text style={styles.date}>
            July 12, 2026
          </Text>

          <Text style={styles.price}>
            ₱35
          </Text>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    marginHorizontal:20,
    marginTop:25,
  },

  heading:{
    fontSize:22,
    fontWeight:'bold',
    color:COLORS.black,
    marginBottom:15,
  },

  card:{
    backgroundColor:'#FFFFFF',
    borderRadius:20,
    padding:20,
    elevation:4,
  },

  row:{
    flexDirection:'row',
    alignItems:'center',
  },

  place:{
    fontSize:18,
    fontWeight:'bold',
    color:COLORS.black,
  },

  destination:{
    marginTop:5,
    color:COLORS.gray,
  },

  footer:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20,
  },

  date:{
    color:COLORS.gray,
  },

  price:{
    color:COLORS.primary,
    fontWeight:'bold',
    fontSize:18,
  },

});
