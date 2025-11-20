import React, {useState, useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
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
import ActivityDetailsScreen from '../screens/ActivityDetailsScreen';
import GeneratedItineraryDetailsScreen from '../screens/GeneratedItineraryDetailsScreen';
import ExpiryScreen from '../screens/ExpiryScreen';
import SimpleTabBar from '../components/SimpleTabBar';
import {isAppExpired} from '../services/expiryService';

type StackEntry = {
  name: string;
  params?: any;
};

const SimpleNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [stack, setStack] = useState<StackEntry[]>([{name: 'tab'}]);
  const [appExpired, setAppExpired] = useState(false);

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

  // Check for app expiry on component mount and periodically
  useEffect(() => {
    const checkExpiry = () => {
      setAppExpired(isAppExpired());
    };

    // Check immediately
    checkExpiry();

    // Check every minute to ensure real-time expiry detection
    const interval = setInterval(checkExpiry, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // If app is expired, don't allow back navigation
        if (appExpired) {
          return true; // Block back press
        }

        // If we're on a tab screen (stack length is 1), don't handle the back press
        // This allows the app to close when on the main tab screen
        if (stack.length <= 1) {
          return false; // Let Android handle it (close app)
        }

        // Otherwise, navigate back in our custom stack
        goBack();
        return true; // We handled the back press
      },
    );

    // Cleanup the listener when component unmounts
    return () => backHandler.remove();
  }, [stack.length, appExpired]); // Re-run when stack length or expiry status changes

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Explore':
        return <ExploreScreen navigation={navigation} />;
      case 'Reels':
        return <ReelsScreen navigation={navigation} />;
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
    if (currentScreen === 'ActivityDetails') {
      return (
        <ActivityDetailsScreen
          route={{params: screenParams}}
          navigation={navigation}
        />
      );
    }
    if (currentScreen === 'GeneratedItineraryDetails') {
      return (
        <GeneratedItineraryDetailsScreen
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

  const showTabBar = currentScreen === 'tab' && !appExpired;

  // If app is expired, show only the expiry screen
  if (appExpired) {
    return (
      <View style={styles.container}>
        <ExpiryScreen />
      </View>
    );
  }

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
