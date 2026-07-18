import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.white,
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,

    borderWidth: 1,

    borderColor: COLORS.lightGray,
  },

});
