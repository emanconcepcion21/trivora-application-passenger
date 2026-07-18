import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../theme/colors';

export default function TripSummaryScreen() {

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.successBox}>

        <Ionicons
          name="checkmark-done-circle"
          size={110}
          color={COLORS.success}
        />

        <Text style={styles.title}>
          Ride Completed
        </Text>

        <Text style={styles.subtitle}>
          Thank you for riding with TRIVORA.
        </Text>

      </View>

      <View style={styles.card}>

        <View style={styles.row}>
          <Ionicons name="person" size={22} color={COLORS.primary} />
          <Text style={styles.text}>
            Driver: Juan Dela Cruz
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location" size={22} color={COLORS.primary} />
          <Text style={styles.text}>
            Pickup: Public Market
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="flag" size={22} color={COLORS.danger} />
          <Text style={styles.text}>
            Destination: Batangas State University
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time" size={22} color={COLORS.primary} />
          <Text style={styles.text}>
            Travel Time: 12 mins
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash" size={22} color={COLORS.success} />
          <Text style={styles.text}>
            Total Fare: ₱35
          </Text>
        </View>

      </View>
            <TouchableOpacity
        style={styles.rateButton}
        onPress={() => navigation.navigate('RateDriver')}
      >
        <Ionicons
          name="star"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          RATE DRIVER
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name="home"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          BACK TO HOME
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:COLORS.background,
    padding:20,
    justifyContent:'center',
  },

  successBox:{
    alignItems:'center',
    marginBottom:35,
  },

  title:{
    marginTop:20,
    fontSize:30,
    fontWeight:'bold',
    color:COLORS.success,
  },

  subtitle:{
    marginTop:8,
    fontSize:16,
    color:COLORS.gray,
    textAlign:'center',
  },

  card:{
    backgroundColor:COLORS.white,
    borderRadius:20,
    padding:20,
    elevation:5,

    shadowColor:'#000',
    shadowOpacity:0.12,
    shadowRadius:10,
    shadowOffset:{
      width:0,
      height:5,
    },
  },

  row:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:12,
  },

  text:{
    marginLeft:15,
    fontSize:17,
    color:COLORS.black,
    fontWeight:'600',
  },

  rateButton:{
    marginTop:35,
    height:58,
    backgroundColor:'#F59E0B',
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  homeButton:{
    marginTop:15,
    height:58,
    backgroundColor:COLORS.primary,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  buttonText:{
    marginLeft:10,
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
    letterSpacing:1,
  },

});