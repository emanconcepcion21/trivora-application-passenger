import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import COLORS from '../theme/colors';

export default function BookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    destination,
    distance,
    eta,
    estimatedFare,
  } = route.params || {
    destination: 'Unknown Destination',
    distance: '0 km',
    eta: '0 mins',
    estimatedFare: '₱0',
  };

  return (
    <View style={styles.container}>

      {/* Header */}

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
          Confirm Booking
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* Driver Card */}

        <View style={styles.driverCard}>

          <Image
            source={{
              uri: 'https://i.pravatar.cc/300?img=12',
            }}
            style={styles.avatar}
          />

          <Text style={styles.driverName}>
            Juan Dela Cruz
          </Text>

          <Text style={styles.rating}>
            ⭐ 4.9 Rating
          </Text>

          <View style={styles.infoRow}>

            <Image
              source={require('../assets/tricycle.png')}
              style={styles.tricycleIcon}
            />

            <Text style={styles.infoText}>
              Tricycle No. TRV-102
            </Text>

          </View>

          <View style={styles.infoRow}>

            <Ionicons
              name="location"
              size={22}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              {destination}
            </Text>

          </View>

        </View>
                {/* Trip Details */}

        <View style={styles.tripCard}>

          <Text style={styles.cardTitle}>
            Trip Details
          </Text>

          <View style={styles.tripRow}>

            <Text style={styles.tripLabel}>
              Destination
            </Text>

            <Text style={styles.tripValue}>
              {destination}
            </Text>

          </View>

          <View style={styles.tripRow}>

            <Text style={styles.tripLabel}>
              Estimated Fare
            </Text>

            <Text style={styles.tripValue}>
              {estimatedFare}
            </Text>

          </View>

          <View style={styles.tripRow}>

            <Text style={styles.tripLabel}>
              Distance
            </Text>

            <Text style={styles.tripValue}>
              {distance}
            </Text>

          </View>

          <View style={styles.tripRow}>

            <Text style={styles.tripLabel}>
              ETA
            </Text>

            <Text style={styles.tripValue}>
              {eta}
            </Text>

          </View>

        </View>

        {/* Driver Actions */}

        <View style={styles.actionContainer}>

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
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Call
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              Alert.alert(
                'Message Driver',
                'Opening chat...'
              )
            }
          >

            <Ionicons
              name="chatbubble"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.actionButtonText}>
              Message
            </Text>

          </TouchableOpacity>

        </View>
                {/* Confirm Booking */}

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            navigation.navigate('Tracking', {
              destination,
              distance,
              eta,
              estimatedFare,
            })
          }
        >

          <Image
            source={require('../assets/tricycle.png')}
            style={styles.confirmIcon}
          />

          <Text style={styles.confirmButtonText}>
            Confirm Booking
          </Text>

        </TouchableOpacity>

        {/* Cancel Booking */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            Alert.alert(
              'Cancel Booking',
              'Are you sure you want to cancel this booking?',
              [
                {
                  text: 'No',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: () => navigation.goBack(),
                },
              ]
            )
          }
        >

          <Ionicons
            name="close-circle"
            size={22}
            color="#E53935"
          />

          <Text style={styles.cancelButtonText}>
            Cancel Booking
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>

  );
}
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
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
    borderRadius: 22.5,
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
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },

  driverName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  rating: {
    fontSize: 16,
    color: '#F4B400',
    marginTop: 5,
    marginBottom: 20,
  },

  infoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.black,
  },

  tricycleIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },

  tripCard: {
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

  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  tripLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },

  tripValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  callButton: {
    flex: 1,
    height: 55,
    backgroundColor: '#34A853',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
    elevation: 4,
  },

  messageButton: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    elevation: 4,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  confirmButton: {
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 5,
    marginBottom: 15,
  },

  confirmIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 10,
    color: '#FFFFFF',
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cancelButton: {
    height: 55,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E53935',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },

  cancelButtonText: {
    color: '#E53935',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});