import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {

    // CHECK EMPTY FIELDS

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        'Required Fields',
        'Please fill in all password fields.'
      );

      return;
    }

    // CHECK PASSWORD LENGTH

    if (newPassword.length < 6) {
      Alert.alert(
        'Weak Password',
        'New password must be at least 6 characters.'
      );

      return;
    }

    // CHECK PASSWORD MATCH

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Mismatch',
        'New password and confirm password do not match.'
      );

      return;
    }

    // CHECK SAME PASSWORD

    if (currentPassword === newPassword) {
      Alert.alert(
        'Invalid Password',
        'New password must be different from current password.'
      );

      return;
    }

    setLoading(true);

    try {

      // IMPORTANT:
      // TEMPORARY PASSENGER ID
      //
      // Since we removed AsyncStorage,
      // use the logged-in passenger ID here.
      //
      // Palitan ito kapag may proper session/user state na tayo.

      const passengerId = 2;

      const response = await fetch(
        'http://192.168.8.33/passenger_api/change_password.php',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            id: passengerId,
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(
        'CHANGE PASSWORD RESPONSE:',
        data
      );

      if (data.success) {

        Alert.alert(
          'Success',
          data.message ||
            'Your password has been changed successfully.',
          [
            {
              text: 'OK',
              onPress: () => {

                // CLEAR PASSWORD FIELDS

                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // GO BACK

                navigation.goBack();

              },
            },
          ]
        );

      } else {

        Alert.alert(
          'Change Password Failed',
          data.message ||
            'Unable to change password.'
        );

      }

    } catch (error) {

      console.log(
        'CHANGE PASSWORD ERROR:',
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

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >

          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.black}
          />

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Change Password
        </Text>

        <View style={{ width: 40 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* BANNER HEADER */}

        <View style={styles.bannerContainer}>

          <View style={styles.iconCircle}>

            <Ionicons
              name="key"
              size={36}
              color="#FFFFFF"
            />

          </View>

          <Text style={styles.title}>
            Update Your Password
          </Text>

          <Text style={styles.subtitle}>
            Enter your current password and choose a strong new password to protect your account.
          </Text>

        </View>

        {/* CARD */}

        <View style={styles.card}>

          {/* CURRENT PASSWORD */}

          <Text style={styles.label}>
            Current Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              placeholder="Enter current password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowCurrent(!showCurrent)
              }
            >

              <Ionicons
                name={
                  showCurrent
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color={COLORS.gray}
              />

            </TouchableOpacity>

          </View>

          {/* NEW PASSWORD */}

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="key-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowNew(!showNew)
              }
            >

              <Ionicons
                name={
                  showNew
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color={COLORS.gray}
              />

            </TouchableOpacity>

          </View>

          {/* CONFIRM NEW PASSWORD */}

          <Text style={styles.label}>
            Confirm New Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={COLORS.gray}
            />

            <TextInput
              placeholder="Re-enter new password"
              placeholderTextColor="#999"
              style={styles.input}
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

          {/* UPDATE BUTTON */}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleChangePassword}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <Text style={styles.buttonText}>
                UPDATE PASSWORD
              </Text>

            )}

          </TouchableOpacity>

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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },

  scroll: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  bannerContainer: {
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 25,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
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
    marginTop: 12,
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
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },

  primaryButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

});