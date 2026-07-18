import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = () => {

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    Alert.alert(
      'Required',
      'Please complete all fields.'
    );
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert(
      'Password Error',
      'Passwords do not match.'
    );
    return;
  }

  setLoading(true);

  setTimeout(() => {

    setLoading(false);

   Alert.alert(
  'Success',
  'Passenger account created successfully!',
  [
    {
      text: 'OK',
      onPress: () => navigation.replace('Login'),
    },
  ]
);

  }, 1500);
};

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        <View style={styles.logoContainer}>

          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
            }}
            style={styles.logo}
          />

          <Text style={styles.appName}>
            TRIVORA
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Register as a passenger and enjoy safe tricycle rides.
          </Text>

        </View>

        <View style={styles.card}>

          {/* First Name */}

          <Text style={styles.label}>
            First Name
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={firstName}
              onChangeText={setFirstName}
            />

          </View>

          {/* Last Name */}

          <Text style={styles.label}>
            Last Name
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={lastName}
              onChangeText={setLastName}
            />

          </View>

          {/* Email */}

          <Text style={styles.label}>
            Email Address
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="mail-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

          </View>

          {/* Mobile */}

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="call-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="09XXXXXXXXX"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

          </View>

          {/* Password */}

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
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

          {/* Confirm Password */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirm(!showConfirm)
              }
            >
              <Ionicons
                name={
                  showConfirm
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color={COLORS.gray}
              />
            </TouchableOpacity>

          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerText}>
                CREATE ACCOUNT
              </Text>
            )}

          </TouchableOpacity>

          <View style={styles.bottom}>

            <Text style={styles.bottomText}>
              Already have an account?
            </Text>

            <TouchableOpacity
  onPress={() => navigation.navigate('Login')}
>
  <Text style={styles.login}>
    Login
  </Text>
</TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },

  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 35,
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,

    elevation: 8,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    marginTop: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 15,

    paddingHorizontal: 15,

    height: 58,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
  },

  registerButton: {
    marginTop: 30,

    backgroundColor: COLORS.primary,

    height: 58,

    borderRadius: 15,

    justifyContent: 'center',

    alignItems: 'center',

    elevation: 5,
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  bottom: {
    marginTop: 30,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',
  },

  bottomText: {
    color: COLORS.gray,
    fontSize: 15,
  },

  login: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
