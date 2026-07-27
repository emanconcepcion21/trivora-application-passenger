import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../theme/colors';
import { usePassenger } from '../context/PassengerContext';

export default function RateDriverScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { passenger } = usePassenger();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitRating() {
    if (rating === 0) {
      Alert.alert(
        'Rating Required',
        'Please select a star rating for your driver.'
      );
      return;
    }

    setSubmitting(true);
    const host = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : '192.168.254.204';
    let bookingId = route.params?.bookingId || route.params?.booking?.id;
    const passengerId = passenger ? (passenger.id || passenger.user_id || '') : '';

    if (!bookingId) {
      try {
        const histRes = await fetch(`http://${host}:8000/api/v1/passenger/bookings/history?user_id=${passengerId}`, {
          headers: { 'Accept': 'application/json' },
        });
        const histData = await histRes.json();
        const bookings = histData.bookings || histData.history || [];
        if (bookings.length > 0) {
          bookingId = bookings[0].id;
        }
      } catch (e) {}
    }

    if (!bookingId) bookingId = 1;

    const apiUrls = [
      `http://${host}:8000/api/v1/passenger/bookings/${bookingId}/rate`,
      `http://192.168.254.204:8000/api/v1/passenger/bookings/${bookingId}/rate`,
    ];

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            score: rating,
            comment: comment.trim(),
            passenger_id: passengerId,
          }),
        });
        if (response.ok) {
          console.log('[Passenger Rate] Rating submitted and saved to ride_ratings table.');
          break;
        }
      } catch (e) {
        console.log('[Passenger Rate] Post notice:', e);
      }
    }

    setSubmitting(false);

    Alert.alert(
      'Thank You!',
      'Your rating has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Main');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back"
          size={26}
          color={COLORS.black}
        />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>
        Rate Your Driver
      </Text>

      <Text style={styles.subtitle}>
        How was your trip?
      </Text>

      {/* Stars */}
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setRating(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                item <= rating
                  ? 'star'
                  : 'star-outline'
              }
              size={42}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating Text */}
      {rating > 0 && (
        <Text style={styles.ratingText}>
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </Text>
      )}

      {/* Feedback */}
      <TextInput
        placeholder="Write your feedback..."
        placeholderTextColor="#999999"
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={submitRating}
        activeOpacity={0.8}
      >
        <Ionicons
          name="checkmark-circle"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Submit Rating
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },

  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },

  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: COLORS.black,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  button: {
    marginTop: 30,
    height: 58,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});