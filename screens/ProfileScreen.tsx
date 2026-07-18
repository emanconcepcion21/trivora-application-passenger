import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
 Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ProfileScreen() {

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => Alert.alert('Logged Out'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>

          <Image
            source={{
              uri: 'https://i.pravatar.cc/300',
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            Eman Esguerra
          </Text>

          <Text style={styles.email}>
            emanc6620@gmail.com
          </Text>

        </View>

        <View style={styles.card}>

          {/* PHONE */}

          <View style={styles.row}>

            <Ionicons
              name="call"
              size={24}
              color={COLORS.primary}
            />

            <Text style={styles.text}>
              09678216267
            </Text>

          </View>

          {/* RATING */}

          <View style={styles.row}>

            <Ionicons
              name="star"
              size={24}
              color="#FFD700"
            />

            <Text style={styles.text}>
              Passenger Rating: 5.0
            </Text>

          </View>

          {/* TOTAL TRIPS */}

          <View style={styles.row}>

            <Image
              source={require('../assets/tricycle.png')}
              style={styles.tricycleIcon}
            />

            <Text style={styles.text}>
              Total Trips: 25
            </Text>

          </View>

        </View>

        {/* EDIT PROFILE */}

        <TouchableOpacity
          style={styles.button}
        >

          <Ionicons
            name="create"
            size={22}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Edit Profile
          </Text>

        </TouchableOpacity>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out"
            size={22}
            color="#fff"
          />

          <Text style={styles.buttonText}>
            Logout
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },

  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },

  email: {
    color: '#E5E7EB',
    marginTop: 5,
    fontSize: 15,
  },

  card: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  tricycleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 15,
  },

  text: {
    fontSize: 17,
    color: COLORS.black,
  },

  button: {
    marginHorizontal: 20,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },

  logoutButton: {
    marginHorizontal: 20,
    height: 55,
    backgroundColor: COLORS.danger,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});