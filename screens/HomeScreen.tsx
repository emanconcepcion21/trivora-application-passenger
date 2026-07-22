import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';

import HomeHeader from '../components/HomeHeader';
import LocationCard from '../components/LocationCard';
import SearchCard from '../components/SearchCard';
import MapPreview from '../components/MapPreview';
import BookRideButton from '../components/BookRideButton';
import QuickServices from '../components/QuickServices';
import RecentTripCard from '../components/RecentTripCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader />

        <LocationCard />

        <SearchCard />

        <MapPreview />

        <BookRideButton />

        <QuickServices />

        <RecentTripCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 30,
  },
});
