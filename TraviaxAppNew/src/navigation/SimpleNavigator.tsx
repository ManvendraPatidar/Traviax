import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ReelsScreen from '../screens/ReelsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReelDetailsScreen from '../screens/ReelDetailsScreen';
import PlanTripScreen from '../screens/PlanTripScreen';
import ItineraryScreen from '../screens/ItineraryScreen';
import ChatScreen from '../screens/ChatScreen';
import GiftScreen from '../screens/GiftScreen';
import ItineraryDetailsScreen from '../screens/ItineraryDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import SimpleTabBar from '../components/SimpleTabBar';

const SimpleNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('tab');
  const [screenParams, setScreenParams] = useState<any>(null);

  const navigate = (screenName: string, params?: any) => {
    setCurrentScreen(screenName);
    setScreenParams(params);
  };

  const goBack = () => {
    setCurrentScreen('tab');
    setScreenParams(null);
  };

  const navigation = {
    navigate,
    goBack,
  };

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Explore':
        return <ExploreScreen navigation={navigation} />;
      case 'Reels':
        return <ReelsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  const renderScreen = () => {
    if (currentScreen === 'ReelDetails') {
      return (
        <ReelDetailsScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    if (currentScreen === 'PlanTrip') {
      return <PlanTripScreen navigation={navigation} />;
    }
    if (currentScreen === 'Chat') {
      return <ChatScreen navigation={navigation} />;
    }
    if (currentScreen === 'Gift') {
      return <GiftScreen navigation={navigation} />;
    }
    if (currentScreen === 'ItineraryDetails') {
      return <ItineraryDetailsScreen navigation={navigation} />;
    }
    if (currentScreen === 'Booking') {
      return <BookingScreen navigation={navigation} />;
    }
    if (currentScreen === 'PlaceDetails') {
      return (
        <PlaceDetailsScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    if (currentScreen === 'Itinerary') {
      return (
        <ItineraryScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    return renderTabScreen();
  };

  const showTabBar = currentScreen === 'tab';

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {showTabBar && (
        <SimpleTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screenContainer: {
    flex: 1,
  },
});

export default SimpleNavigator;
