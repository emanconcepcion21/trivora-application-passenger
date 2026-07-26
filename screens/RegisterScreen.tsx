import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Incomplete Information', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const getHost = () => {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        return window.location.hostname;
      }
      return '192.168.254.205';
    };

    const host = getHost();
    const apiUrls = [
      `http://${host}:8000/api/v1/passenger/register`,
      'http://localhost:8000/api/v1/passenger/register',
      'http://127.0.0.1:8000/api/v1/passenger/register',
      'http://10.0.2.2:8000/api/v1/passenger/register',
    ];

    let successMsg = null;
    let lastErrorMsg = '';

    for (const url of apiUrls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            mobile_number: phone.trim(),
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && (data.token || data.message || data.user)) {
          successMsg = data.message || 'Passenger registered successfully.';
          break;
        } else {
          lastErrorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Registration failed.');
          if (response.status === 422 || response.status === 400) {
            // Validation error, break immediately to show validation message
            break;
          }
        }
      } catch (err: any) {
        lastErrorMsg = err.message || 'Server connection error.';
      }
    }

    setLoading(false);

    if (successMsg) {
      if (Platform.OS === 'web') {
        alert('Registration Successful 🎉\nYour passenger account has been saved in the database.');
        navigation.replace('Login');
      } else {
        Alert.alert('Registration Successful 🎉', 'Your passenger account has been saved in the database.', [
          { text: 'Log In', onPress: () => navigation.replace('Login') },
        ]);
      }
    } else {
      if (Platform.OS === 'web') {
        alert(`Registration Notice: ${lastErrorMsg}`);
      } else {
        Alert.alert('Registration Notice', lastErrorMsg);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.avatarContainer}>

            <Image
              source={{
                uri: 'https://i.pravatar.cc/300',
              }}
              style={styles.avatar}
            />

            <TouchableOpacity
              style={styles.cameraButton}
            >

              <Ionicons
                name="camera"
                size={18}
                color="#fff"
              />

            </TouchableOpacity>

          </View>

          <Text style={styles.name}>
            {name || 'Create Your Account'}
          </Text>

          <Text style={styles.email}>
            {email ||
              'Register as a TRIVORA passenger'}
          </Text>

        </View>

        {/* REGISTER CARD */}

        <View style={styles.card}>

          {/* FULL NAME */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />

          {/* EMAIL */}

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* MOBILE NUMBER */}

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          {/* PASSWORD */}

          <Text style={styles.label}>
            Password
          </Text>

          <View
            style={styles.passwordContainer}
          >

            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={
                !showPassword
              }
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color={COLORS.gray}
              />

            </TouchableOpacity>

          </View>

        </View>

        {/* CREATE ACCOUNT */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <>

              <Ionicons
                name="person-add"
                size={22}
                color="#fff"
              />

              <Text
                style={styles.buttonText}
              >
                Create Account
              </Text>

            </>

          )}

        </TouchableOpacity>

        {/* BACK TO LOGIN */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            navigation.replace('Login')
          }
          disabled={loading}
        >

          <Ionicons
            name="log-in-outline"
            size={22}
            color={COLORS.primary}
          />

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Already have an account? Login
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  header: {
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.primary,
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

  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },

  button: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 55,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  secondaryButton: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 40,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});