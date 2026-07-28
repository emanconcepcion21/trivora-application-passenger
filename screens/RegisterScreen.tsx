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
  const [regError, setRegError] = useState('');

  const handleRegister = async () => {
    setRegError('');
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const host = typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : '172.20.10.2';
    const apiUrl = `http://${host}:8000/api/v1/passenger/register`;
    const REQUEST_TIMEOUT_MS = 2000; // faster failover

    let successMsg = null;
    let lastErrorMsg = '';

    // Single attempt using AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
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
      clearTimeout(timeout);
      const data = await response.json();
      if (response.ok && (data.token || data.message || data.user)) {
        successMsg = data.message || 'Passenger registered successfully.';
      } else {
        if (data.errors) {
          lastErrorMsg = Object.values(data.errors).flat().join(', ');
        } else {
          lastErrorMsg = data.message || 'Registration failed.';
        }
      }
    } catch (err: any) {
      clearTimeout(timeout);
      lastErrorMsg = err.name === 'AbortError' ? 'Request timed out. Please check your network.' : err.message || 'Server connection error.';
    }

    setLoading(false);

    if (successMsg) {
      if (Platform.OS === 'web') {
        alert('Registration Successful\nYour passenger account has been saved in the database.');
      } else {
        Alert.alert('Registration Successful', 'Your passenger account has been saved in the database.', [
          { text: 'Log In', onPress: () => navigation.replace('Login') },
        ]);
      }
    } else {
      // Show the exact error returned by the backend (e.g., email already taken)
      setRegError(lastErrorMsg || 'Registration failed. Please try again.');
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

          {/* ERROR ALERT BANNER */}
          {regError ? (
            <View style={styles.authErrorCard}>
              <Ionicons name="alert-circle" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
              <Text style={styles.authErrorText}>{regError}</Text>
            </View>
          ) : null}

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
  authErrorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  authErrorText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

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