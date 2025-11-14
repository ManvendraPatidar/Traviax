import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {apiService} from '../services/api';

interface ItineraryDetailsScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      itineraryId?: string;
    };
  };
}

interface Activity {
  time: string;
  title: string;
  description: string;
  image: string;
}

interface Day {
  day: number;
  title: string;
  date: string;
  locations: number;
  activities: Activity[];
  expanded: boolean;
}

const DEFAULT_HEADER_IMAGE =
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=400&fit=crop';
const DEFAULT_LOCATION = 'Kyoto, Japan';
const DEFAULT_TITLE = '4 Days in Kyoto';
const DEFAULT_DATES = 'October 26 - October 29';

const ItineraryDetailsScreen: React.FC<ItineraryDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  // Header state (dynamic but same UI)
  const [headerImage, setHeaderImage] = useState<string>(DEFAULT_HEADER_IMAGE);
  const [headerLocation, setHeaderLocation] =
    useState<string>(DEFAULT_LOCATION);
  const [tripTitle, setTripTitle] = useState<string>(DEFAULT_TITLE);
  const [tripDates, setTripDates] = useState<string>(DEFAULT_DATES);

  // Days state
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const itineraryId = route?.params?.itineraryId;
    if (!itineraryId) {
      return;
    }
    let isCancelled = false;
    const fetchItinerary = async () => {
      try {
        const itinerary = await apiService.getItineraryById(itineraryId);
        if (isCancelled || !itinerary) return;

        // Header details
        setHeaderImage(itinerary.heroImage || DEFAULT_HEADER_IMAGE);
        setHeaderLocation(itinerary.location || DEFAULT_LOCATION);
        setTripTitle(itinerary.title || DEFAULT_TITLE);
        setTripDates(itinerary.dateRange || DEFAULT_DATES);

        // Map days to UI shape
        const mappedDays: Day[] = (itinerary.days || []).map(
          (d: any, index: number) => ({
            day: d?.day ?? index + 1,
            title: d?.title ?? '',
            date: d?.date ?? '',
            locations:
              d?.locationCount ??
              d?.locations ??
              (Array.isArray(d?.activities) ? d.activities.length : 0),
            activities: Array.isArray(d?.activities)
              ? d.activities.map((a: any) => ({
                  time: a?.time ?? '',
                  title: a?.name ?? a?.title ?? '',
                  description: a?.description ?? '',
                  image:
                    a?.image ||
                    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
                }))
              : [],
            expanded: index === 0,
          }),
        );
        setDays(mappedDays);
      } catch (e) {
        console.log('Failed to load itinerary details', e);
      }
    };
    fetchItinerary();
    return () => {
      isCancelled = true;
    };
  }, [route?.params?.itineraryId]);

  const toggleDay = (dayIndex: number) => {
    setDays(prevDays =>
      prevDays.map((day, index) =>
        index === dayIndex ? {...day, expanded: !day.expanded} : day,
      ),
    );
  };

  const handleSaveItinerary = () => {
    console.log('Save Itinerary');
  };

  const renderActivity = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityContainer}>
      <View style={styles.activityContent}>
        <Image source={{uri: activity.image}} style={styles.activityImage} />
        <View style={styles.activityInfo}>
          <Text style={styles.activityTime}>{activity.time}</Text>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderDay = (day: Day, index: number) => (
    <View key={index} style={styles.dayContainer}>
      <TouchableOpacity
        style={styles.dayHeader}
        onPress={() => toggleDay(index)}>
        <View style={styles.dayHeaderLeft}>
          <Text style={styles.dayTitle}>
            Day {day.day}: {day.title}
          </Text>
          <Text style={styles.daySubtitle}>
            {day.date} • {day.locations} locations
          </Text>
        </View>
        <Text
          style={[
            styles.expandIcon,
            {transform: [{rotate: day.expanded ? '180deg' : '0deg'}]},
          ]}>
          ▲
        </Text>
      </TouchableOpacity>

      {day.expanded && (
        <View style={styles.dayContent}>
          {day.activities.map(renderActivity)}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Background Image */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={{uri: headerImage}}
          style={styles.headerBackground}
          imageStyle={styles.headerImageStyle}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}>
            {/* Navigation */}
            <View style={styles.headerNav}>
              <TouchableOpacity
                onPress={navigation.goBack}
                style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerLocation}>{headerLocation}</Text>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareIcon}>⤴</Text>
              </TouchableOpacity>
            </View>

            {/* Trip Info */}
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{tripTitle}</Text>
              <Text style={styles.tripDates}>{tripDates}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveItinerary}>
              <Text style={styles.saveButtonText}>Save Itinerary</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Days List */}
      <ScrollView
        style={styles.daysContainer}
        showsVerticalScrollIndicator={false}>
        {days.map(renderDay)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    height: 300,
  },
  headerBackground: {
    flex: 1,
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerLocation: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripInfo: {
    alignItems: 'flex-start',
  },
  tripTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tripDates: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayContainer: {
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  daySubtitle: {
    color: '#999999',
    fontSize: 14,
  },
  expandIcon: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  activityContainer: {
    marginBottom: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTime: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ItineraryDetailsScreen;
