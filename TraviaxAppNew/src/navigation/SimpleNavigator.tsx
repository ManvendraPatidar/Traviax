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
import ItenaryListScreen from '../screens/ItenaryListScreen';
import ItineraryDetailsScreen from '../screens/ItineraryDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import SimpleTabBar from '../components/SimpleTabBar';

type StackEntry = {
  name: string;
  params?: any;
};

const SimpleNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [stack, setStack] = useState<StackEntry[]>([{name: 'tab'}]);

  const currentEntry = stack[stack.length - 1];
  const currentScreen = currentEntry.name;
  const screenParams = currentEntry.params;

  const navigate = (screenName: string, params?: any) => {
    setStack(prev => [...prev, {name: screenName, params}]);
  };

  const goBack = () => {
    setStack(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.slice(0, prev.length - 1);
    });
  };

  const navigateToHome = () => {
    setActiveTab('Home');
    setStack([{name: 'tab'}]);
  };

  const navigation = {
    navigate,
    goBack,
    navigateToHome,
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
    if (currentScreen === 'tab') {
      return renderTabScreen();
    }
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
      return (
        <GiftScreen route={{params: screenParams}} navigation={navigation} />
      );
    }
    if (currentScreen === 'ItenaryList') {
      return (
        <ItenaryListScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    if (currentScreen === 'ItineraryDetails') {
      return (
        <ItineraryDetailsScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    if (currentScreen === 'Booking') {
      return <BookingScreen navigation={navigation} />;
    }
    if (currentScreen === 'SearchResults') {
      return (
        <SearchResultsScreen
          navigation={navigation}
          route={{params: screenParams}}
        />
      );
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

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    setStack([{name: 'tab'}]);
  };

  const showTabBar = currentScreen === 'tab';

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {showTabBar && (
        <SimpleTabBar activeTab={activeTab} onTabPress={handleTabPress} />
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
