import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function TrackingScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>
        Ride Tracking
      </Text>

      {/* MAP */}

      <View style={styles.mapContainer}>
        <Ionicons
          name="map"
          size={80}
          color={COLORS.primary}
        />

        <Text style={styles.mapText}>
          Google Maps will appear here
        </Text>
      </View>

      {/* LOCATION */}

      <View style={styles.locationCard}>

        <View style={styles.row}>
          <Ionicons
            name="location"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.locationText}>
            Pickup: Nasugbu Public Market
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="flag"
            size={22}
            color={COLORS.danger}
          />

          <Text style={styles.locationText}>
            Destination: BatStateU Nasugbu
          </Text>
        </View>

      </View>

      {/* DRIVER */}

      <View style={styles.driverCard}>

        <Text style={styles.driverTitle}>
          Driver Information
        </Text>

        <View style={styles.driverRow}>

          <Ionicons
            name="person-circle"
            size={70}
            color={COLORS.primary}
          />

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.driverName}>
              Juan Dela Cruz
            </Text>

            <Text style={styles.driverInfo}>
              Tricycle No. TRI-0456
            </Text>

            <Text style={styles.driverInfo}>
              ⭐ 4.9 Rating
            </Text>

          </View>

        </View>

      </View>

      {/* STATUS */}

      <View style={styles.statusCard}>

        <Text style={styles.statusTitle}>
          Ride Status
        </Text>

        <Text style={styles.status}>
          Driver is on the way...
        </Text>

      </View>

      {/* BUTTONS */}

      <TouchableOpacity style={styles.callButton}>

        <Ionicons
          name="call"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Call Driver
        </Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton}>

        <Ionicons
          name="close-circle"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Cancel Ride
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
  },

  header:{
    fontSize:28,
    fontWeight:'bold',
    color:COLORS.primary,
    marginBottom:20,
  },

  mapContainer:{
    height:220,
    backgroundColor:COLORS.white,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    elevation:5,
  },

  mapText:{
    marginTop:10,
    color:COLORS.gray,
    fontSize:16,
  },

  locationCard:{
    backgroundColor:COLORS.white,
    marginTop:20,
    borderRadius:20,
    padding:18,
    elevation:4,
  },

  row:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:12,
  },

  locationText:{
    marginLeft:10,
    fontSize:16,
    color:COLORS.black,
  },

  driverCard:{
    backgroundColor:COLORS.white,
    marginTop:20,
    borderRadius:20,
    padding:18,
    elevation:4,
  },

  driverTitle:{
    fontSize:18,
    fontWeight:'bold',
    color:COLORS.black,
    marginBottom:15,
  },

  driverRow:{
    flexDirection:'row',
    alignItems:'center',
  },

  driverName:{
    fontSize:20,
    fontWeight:'bold',
    color:COLORS.black,
  },

  driverInfo:{
    marginTop:4,
    color:COLORS.gray,
  },

  statusCard:{
    backgroundColor:COLORS.white,
    marginTop:20,
    borderRadius:20,
    padding:18,
    elevation:4,
  },

  statusTitle:{
    fontSize:18,
    fontWeight:'bold',
    color:COLORS.black,
  },

  status:{
    marginTop:10,
    fontSize:16,
    color:COLORS.success,
    fontWeight:'bold',
  },

  callButton:{
    height:55,
    backgroundColor:COLORS.primary,
    borderRadius:15,
    marginTop:25,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  cancelButton:{
    height:55,
    backgroundColor:COLORS.danger,
    borderRadius:15,
    marginTop:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  buttonText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:17,
    marginLeft:8,
  },

});