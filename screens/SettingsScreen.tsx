import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:COLORS.background,
  },
  title:{
    fontSize:28,
    fontWeight:'bold',
    color:COLORS.primary,
  },
});