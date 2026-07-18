import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function DriverDetailsScreen() {

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>
        Driver Details
      </Text>

      <View style={styles.card}>

        <Image
          source={{
            uri: 'https://i.pravatar.cc/300?img=12',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          Juan Dela Cruz
        </Text>

        <Text style={styles.rating}>
          ⭐ 4.9 (245 Trips)
        </Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="car-sport"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.info}>
            Tricycle No. TRI-0456
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="call"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.info}>
            +63 912 345 6789
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.info}>
            Current Location: Nasugbu Plaza
          </Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={() =>
          Alert.alert(
            'Call Driver',
            'Calling Juan Dela Cruz...'
          )
        }
      >
        <Ionicons
          name="call"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Call Driver
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() =>
          Alert.alert(
            'Message',
            'Messaging feature coming soon.'
          )
        }
      >
        <Ionicons
          name="chatbubble"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Message Driver
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() =>
          navigation.navigate('Tracking')
        }
      >
        <Ionicons
          name="navigate"
          size={22}
          color="#fff"
        />

        <Text style={styles.buttonText}>
          Start Tracking
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

  card:{
    backgroundColor:'#fff',
    borderRadius:20,
    padding:25,
    alignItems:'center',
    elevation:5,
  },

  avatar:{
    width:120,
    height:120,
    borderRadius:60,
    marginBottom:15,
  },

  name:{
    fontSize:24,
    fontWeight:'bold',
    color:COLORS.black,
  },

  rating:{
    color:COLORS.gray,
    marginTop:5,
    marginBottom:20,
  },

  infoRow:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    marginVertical:8,
  },

  info:{
    marginLeft:12,
    fontSize:16,
    color:COLORS.black,
  },

  callButton:{
    backgroundColor:COLORS.success,
    marginTop:25,
    height:55,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  messageButton:{
    backgroundColor:COLORS.primary,
    marginTop:15,
    height:55,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  trackButton:{
    backgroundColor:'#F59E0B',
    marginTop:15,
    height:55,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  buttonText:{
    color:'#fff',
    fontSize:17,
    fontWeight:'bold',
    marginLeft:8,
  },

});