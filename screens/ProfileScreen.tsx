import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../theme/colors';

import { usePassenger } from '../context/PassengerContext';

export default function ProfileScreen() {

  const navigation = useNavigation<any>();

  // GET CURRENT LOGGED-IN PASSENGER
  const {
    passenger,
    logoutPassenger,
  } = usePassenger();

  // PROFILE STATES
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState(
    'Nasugbu, Batangas'
  );

  const [emergency, setEmergency] = useState(
    '09123456789'
  );

  const [loading, setLoading] = useState(false);

  const getHost = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return '192.168.254.205';
  };

  // LOAD PASSENGER DATA WHEN PROFILE SCREEN OPENS
  useEffect(() => {
    async function loadProfileData() {
      if (passenger && (passenger.full_name || passenger.email)) {
        setName(passenger.full_name || (passenger as any).name || 'Juan Dela Cruz');
        setEmail(passenger.email || 'passenger@trivora.ph');
        setPhone(passenger.phone || (passenger as any).mobile_number || '09171234567');
      } else {
        try {
          const host = getHost();
          const res = await fetch(`http://${host}:8000/api/v1/passenger/bookings/active`, {
            headers: { 'Accept': 'application/json' },
          });
          const data = await res.json();
          if (data.booking?.passenger) {
            const p = data.booking.passenger;
            setName(p.user?.name || p.full_name || 'Juan Dela Cruz');
            setEmail(p.user?.email || p.email || 'passenger@trivora.ph');
            setPhone(p.mobile_number || p.phone || '09171234567');
          } else {
            setName('Juan Dela Cruz');
            setEmail('passenger@trivora.ph');
            setPhone('09171234567');
          }
        } catch (e) {
          setName('Juan Dela Cruz');
          setEmail('passenger@trivora.ph');
          setPhone('09171234567');
        }
      }
    }

    loadProfileData();
  }, [passenger]);

  // SAVE PROFILE
  const handleSave = async () => {

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {

      Alert.alert(
        'Incomplete Information',
        'Please fill in all fields.'
      );

      return;
    }

    if (!passenger?.id) {

      Alert.alert(
        'Error',
        'Passenger information is not available.'
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        'http://192.168.8.33/passenger_api/update_profile.php',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({

            id: passenger.id,

            full_name:
              name.trim(),

            email:
              email.trim(),

            phone:
              phone.trim(),

          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'UPDATE PROFILE RESPONSE:',
        data
      );

      if (data.success) {

        setIsEditing(false);

        Alert.alert(
          'Success',
          data.message ||
            'Profile updated successfully.'
        );

      } else {

        Alert.alert(
          'Update Failed',
          data.message ||
            'Unable to update profile.'
        );

      }

    } catch (error) {

      console.log(
        'UPDATE PROFILE ERROR:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please make sure XAMPP Apache is running.'
      );

    } finally {

      setLoading(false);

    }

  };

  // LOGOUT
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
          style: 'destructive',

          onPress: () => {

            // CLEAR CURRENT PASSENGER
            logoutPassenger();

            // RETURN TO LOGIN
            navigation.replace(
              'Login'
            );

          },
        },
      ]
    );

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View
          style={styles.header}
        >

          <View
            style={
              styles.avatarContainer
            }
          >

            <Image
              source={{
                uri:
                  passenger?.profile_image ||
                  'https://i.pravatar.cc/300',
              }}
              style={styles.avatar}
            />

            {/* CAMERA ICON
                DESIGN ONLY
                NO CAMERA / GALLERY FUNCTIONALITY */}

            <TouchableOpacity
              style={
                styles.cameraButton
              }
            >

              <Ionicons
                name="camera"
                size={18}
                color="#fff"
              />

            </TouchableOpacity>

          </View>

          <Text
            style={styles.name}
          >
            {name ||
              'Passenger'}
          </Text>

          <Text
            style={styles.email}
          >
            {email ||
              'No email available'}
          </Text>

        </View>

        {/* PROFILE CARD */}

        <View
          style={styles.card}
        >

          {/* PROFILE DETAILS HEADER */}

          <View
            style={styles.cardHeader}
          >

            <Text
              style={
                styles.sectionTitle
              }
            >
              Profile Details
            </Text>

            <TouchableOpacity
              onPress={() =>
                setIsEditing(
                  !isEditing
                )
              }
            >

              <Ionicons
                name={
                  isEditing
                    ? 'close'
                    : 'pencil'
                }
                size={22}
                color={
                  COLORS.primary
                }
              />

            </TouchableOpacity>

          </View>

          {/* FULL NAME */}

          <Text
            style={styles.label}
          >
            Full Name
          </Text>

          <TextInput
            style={[
              styles.input,
              !isEditing &&
                styles.inputDisabled,
            ]}
            value={name}
            onChangeText={
              setName
            }
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            editable={
              isEditing
            }
          />

          {/* EMAIL */}

          <Text
            style={styles.label}
          >
            Email
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.inputDisabled,
            ]}
            value={email}
            onChangeText={
              setEmail
            }
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />

          {/* MOBILE NUMBER */}

          <Text
            style={styles.label}
          >
            Mobile Number
          </Text>

          <TextInput
            style={[
              styles.input,
              !isEditing &&
                styles.inputDisabled,
            ]}
            value={phone}
            onChangeText={
              setPhone
            }
            placeholder="Enter your mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            editable={
              isEditing
            }
          />

          {/* ADDRESS */}

          <Text
            style={styles.label}
          >
            Address
          </Text>

          <TextInput
            style={[
              styles.input,
              !isEditing &&
                styles.inputDisabled,
            ]}
            value={address}
            onChangeText={
              setAddress
            }
            editable={
              isEditing
            }
          />

          {/* EMERGENCY CONTACT */}

          <Text
            style={styles.label}
          >
            Emergency Contact
          </Text>

          <TextInput
            style={[
              styles.input,
              !isEditing &&
                styles.inputDisabled,
            ]}
            value={emergency}
            onChangeText={
              setEmergency
            }
            keyboardType="phone-pad"
            editable={
              isEditing
            }
          />

        </View>

        {/* SAVE CHANGES */}

        {isEditing && (

          <TouchableOpacity
            style={styles.button}
            onPress={
              handleSave
            }
            disabled={
              loading
            }
          >

            {loading ? (

              <ActivityIndicator
                color="#fff"
              />

            ) : (

              <>

                <Ionicons
                  name="save"
                  size={22}
                  color="#fff"
                />

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Save Changes
                </Text>

              </>

            )}

          </TouchableOpacity>

        )}

        {/* CHANGE PASSWORD */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            navigation.navigate(
              'ChangePassword'
            )
          }
        >

          <Ionicons
            name="lock-closed"
            size={22}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Change Password
          </Text>

        </TouchableOpacity>

        {/* RIDE HISTORY */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            navigation.navigate(
              'History'
            )
          }
        >

          <Ionicons
            name="time"
            size={22}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Ride History
          </Text>

        </TouchableOpacity>

        {/* LOGOUT */}

        <TouchableOpacity
          style={
            styles.logoutButton
          }
          onPress={
            handleLogout
          }
        >

          <Ionicons
            name="log-out"
            size={22}
            color="#fff"
          />

          <Text
            style={
              styles.buttonText
            }
          >
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
    backgroundColor:
      '#F4F7FC',
  },

  header: {
    backgroundColor:
      COLORS.primary,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor:
      COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
    fontSize: 15,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: COLORS.black,
  },

  inputDisabled: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
    borderColor: '#E5E7EB',
  },

  button: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 55,
    borderRadius: 15,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  secondaryButton: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor:
      COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 40,
    height: 55,
    borderRadius: 15,
    backgroundColor:
      '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  secondaryButtonText: {
    color:
      COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});