import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import COLORS from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && { opacity: 0.6 },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 55,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,

    shadowColor: '#000',

    shadowOpacity: 0.1,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  text: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
