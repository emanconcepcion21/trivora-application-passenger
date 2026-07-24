import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Eman Esguerra');
  const [email] = useState('emanc6620@gmail.com');
  const [phone, setPhone] = useState('09678216267');
  const [address, setAddress] = useState('Nasugbu, Batangas');
  const [emergency, setEmergency] = useState('09123456789');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert(
      'Success',
      'Profile updated successfully.'
    );
  };

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
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
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

            <TouchableOpacity style={styles.cameraButton}>

              <Ionicons
                name="camera"
                size={18}
                color="#fff"
              />

            </TouchableOpacity>

          </View>

          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.email}>
            {email}
          </Text>

        </View>

        {/* PROFILE CARD */}

        <View style={styles.card}>

          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons name={isEditing ? "close" : "pencil"} size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditing}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>
            Mobile Number
          </Text>

          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <Text style={styles.label}>
            Address
          </Text>

          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={address}
            onChangeText={setAddress}
            editable={isEditing}
          />

          <Text style={styles.label}>
            Emergency Contact
          </Text>

          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={emergency}
            onChangeText={setEmergency}
            keyboardType="phone-pad"
            editable={isEditing}
          />

        </View>
        {/* SAVE CHANGES */}

        {isEditing && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
          >

            <Ionicons
              name="save"
              size={22}
              color="#fff"
            />

            <Text style={styles.buttonText}>
              Save Changes
            </Text>

          </TouchableOpacity>
        )}

        {/* CHANGE PASSWORD */}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ChangePassword')}
        >

          <Ionicons
            name="lock-closed"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.secondaryButtonText}>
            Change Password
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
    backgroundColor: COLORS.primary,
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
    borderColor: COLORS.primary,
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
    backgroundColor: '#E63946',
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
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});