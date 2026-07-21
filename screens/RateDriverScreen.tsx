import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

export default function RateDriverScreen() {

  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const {

    destination = 'Unknown',

    distance = '0 km',

    eta = '0 min',

    estimatedFare = '₱0',

  } = route.params || {};

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >

          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Rate Driver
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* DRIVER CARD */}

        <View style={styles.driverCard}>

          <Ionicons
            name="person-circle"
            size={90}
            color={COLORS.primary}
          />

          <Text style={styles.driverName}>
            Juan Dela Cruz
          </Text>

          <Text style={styles.driverPlate}>
            Tricycle No. TRV-102
          </Text>

          <Text style={styles.driverRating}>
            ⭐ 4.9 Driver Rating
          </Text>

        </View>

        {/* TRIP SUMMARY */}

        <View style={styles.summaryCard}>

          <Text style={styles.cardTitle}>
            Trip Summary
          </Text>
                    <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Destination
            </Text>

            <Text style={styles.value}>
              {destination}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Distance
            </Text>

            <Text style={styles.value}>
              {distance}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Travel Time
            </Text>

            <Text style={styles.value}>
              {eta}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Fare Paid
            </Text>

            <Text style={styles.fare}>
              {estimatedFare}
            </Text>

          </View>

        </View>

        {/* RATE DRIVER */}

        <View style={styles.ratingCard}>

          <Text style={styles.cardTitle}>
            How was your ride?
          </Text>

          <Text style={styles.ratingSubtitle}>
            Tap the stars to rate your driver.
          </Text>

          <View style={styles.starContainer}>

            {[1, 2, 3, 4, 5].map((star) => (

              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >

                <Ionicons
                  name={
                    star <= rating
                      ? 'star'
                      : 'star-outline'
                  }
                  size={42}
                  color="#F4B400"
                  style={styles.star}
                />

              </TouchableOpacity>

            ))}

          </View>

        </View>
                {/* COMMENT */}

        <View style={styles.commentCard}>

          <Text style={styles.cardTitle}>
            Leave a Comment
          </Text>

          <Text style={styles.commentSubtitle}>
            Tell us about your experience with the driver.
          </Text>

          <TextInput
            style={styles.commentInput}
            placeholder="Write your feedback here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />

        </View>

        {/* REVIEW PREVIEW */}

        <View style={styles.reviewCard}>

          <Text style={styles.cardTitle}>
            Your Review
          </Text>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Rating
            </Text>

            <Text style={styles.value}>
              {rating} / 5 ⭐
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Comment
            </Text>

            <Text style={styles.value}>
              {comment.trim() === ''
                ? 'No comment yet.'
                : comment}
            </Text>

          </View>

        </View>
                {/* SUBMIT REVIEW */}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {

            if (rating === 0) {

              Alert.alert(
                'Rating Required',
                'Please rate your driver first.'
              );

              return;

            }

            Alert.alert(
              'Thank You!',
              'Your review has been submitted.',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    }),
                },
              ]
            );

          }}
        >

          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.submitButtonText}>
            Submit Review
          </Text>

        </TouchableOpacity>

        {/* BACK TO DASHBOARD */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          }
        >

          <Ionicons
            name="home"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.homeButtonText}>
            Back to Dashboard
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  headerTitle: {
    marginLeft: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },

  driverName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  driverPlate: {
    marginTop: 5,
    fontSize: 15,
    color: COLORS.gray,
  },

  driverRating: {
    marginTop: 5,
    fontSize: 16,
    color: '#F4B400',
    fontWeight: '600',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
    summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  label: {
    fontSize: 16,
    color: COLORS.gray,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
    textAlign: 'right',
    marginLeft: 15,
  },

  fare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',
  },

  ratingSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },

  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  star: {
    marginHorizontal: 6,
  },

  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 20,
  },

  commentSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 15,
  },

  commentInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: '#FAFAFA',
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 25,
  },

  submitButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 15,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  homeButton: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },

  homeButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});