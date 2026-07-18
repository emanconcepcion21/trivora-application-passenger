import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../theme/colors';

export default function RateDriverScreen() {

  const navigation = useNavigation<any>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = () => {

    if (rating === 0) {
      Alert.alert(
        'Rating Required',
        'Please rate your driver.'
      );
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your review has been submitted.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Ionicons
          name="star"
          size={100}
          color="#F59E0B"
        />

        <Text style={styles.title}>
          Rate Your Driver
        </Text>

        <Text style={styles.subtitle}>
          Help us improve TRIVORA by rating your ride.
        </Text>

      </View>

      <View style={styles.starContainer}>

        {[1,2,3,4,5].map((item) => (

          <TouchableOpacity
            key={item}
            onPress={() => setRating(item)}
          >

            <Ionicons
              name={
                item <= rating
                  ? 'star'
                  : 'star-outline'
              }
              size={45}
              color="#F59E0B"
              style={{ marginHorizontal:6 }}
            />

          </TouchableOpacity>

        ))}

      </View>

      <TextInput
        placeholder="Write your feedback..."
        multiline
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
            <TouchableOpacity
        style={styles.button}
        onPress={submitReview}
      >
        <Ionicons
          name="send"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          SUBMIT REVIEW
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

  header:{
    alignItems:'center',
    marginBottom:35,
  },

  title:{
    marginTop:15,
    fontSize:30,
    fontWeight:'bold',
    color:COLORS.primary,
  },

  subtitle:{
    marginTop:8,
    textAlign:'center',
    color:COLORS.gray,
    fontSize:16,
  },

  starContainer:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:30,
  },

  input:{
    backgroundColor:COLORS.white,
    borderRadius:15,
    padding:15,
    minHeight:140,
    textAlignVertical:'top',
    fontSize:16,
    color:COLORS.black,
    elevation:4,

    shadowColor:'#000',
    shadowOpacity:0.1,
    shadowRadius:8,
    shadowOffset:{
      width:0,
      height:4,
    },
  },

  button:{
    marginTop:30,
    backgroundColor:COLORS.primary,
    height:58,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  buttonText:{
    marginLeft:10,
    color:'#FFFFFF',
    fontSize:18,
    fontWeight:'bold',
    letterSpacing:1,
  },

});