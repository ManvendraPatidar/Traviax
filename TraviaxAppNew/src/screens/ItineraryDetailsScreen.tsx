import React, {useState} from 'react';
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

interface ItineraryDetailsScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
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

const ItineraryDetailsScreen: React.FC<ItineraryDetailsScreenProps> = ({navigation}) => {
  const [days, setDays] = useState<Day[]>([
    {
      day: 1,
      title: 'Historic Temples & Gion',
      date: 'Oct 26',
      locations: 4,
      activities: [
        {
          time: 'MORNING',
          title: 'Kiyomizu-dera Temple',
          description: 'Iconic wooden temple with city views',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
        },
        {
          time: 'LATE MORNING',
          title: 'Sannenzaka & Ninenzaka',
          description: 'Stroll through preserved historic streets',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        },
        {
          time: 'EVENING',
          title: 'Gion District',
          description: 'Explore the famous geisha district',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
        },
      ],
      expanded: true,
    },
    {
      day: 2,
      title: 'Arashiyama Bamboo Grove',
      date: 'Oct 27',
      locations: 4,
      activities: [
        {
          time: 'MORNING',
          title: 'Bamboo Grove Walk',
          description: 'Stroll through the famous bamboo forest',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&fit=crop',
        },
        {
          time: 'LATE MORNING',
          title: 'Tenryu-ji Temple',
          description: 'Historic Zen temple with beautiful gardens',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
        },
        {
          time: 'AFTERNOON',
          title: 'Togetsukyo Bridge',
          description: 'Iconic bridge with mountain views',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        },
        {
          time: 'EVENING',
          title: 'Monkey Park Iwatayama',
          description: 'Mountain park with city views and monkeys',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
        },
      ],
      expanded: false,
    },
    {
      day: 3,
      title: 'Fushimi Inari Shrine',
      date: 'Oct 28',
      locations: 3,
      activities: [
        {
          time: 'EARLY MORNING',
          title: 'Fushimi Inari Hike',
          description: 'Climb through thousands of torii gates',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&fit=crop',
        },
        {
          time: 'AFTERNOON',
          title: 'Fushimi Sake District',
          description: 'Traditional sake brewing district tour',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
        },
        {
          time: 'EVENING',
          title: 'Gekkeikan Okura Museum',
          description: 'Learn about sake history and tasting',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        },
      ],
      expanded: false,
    },
    {
      day: 4,
      title: 'Golden Pavilion & Departure',
      date: 'Oct 29',
      locations: 5,
      activities: [
        {
          time: 'MORNING',
          title: 'Kinkaku-ji (Golden Pavilion)',
          description: 'Famous golden temple reflected in pond',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
        },
        {
          time: 'LATE MORNING',
          title: 'Ryoan-ji Temple',
          description: 'Famous rock garden meditation temple',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
        },
        {
          time: 'AFTERNOON',
          title: 'Nijo Castle',
          description: 'Historic shogun palace with gardens',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
        },
        {
          time: 'LATE AFTERNOON',
          title: 'Kyoto Station Shopping',
          description: 'Last-minute souvenir shopping',
          image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400&h=300&fit=crop',
        },
        {
          time: 'EVENING',
          title: 'Departure',
          description: 'Transfer to airport for departure',
          image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop',
        },
      ],
      expanded: false,
    },
  ]);

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
          <Text style={styles.dayTitle}>Day {day.day}: {day.title}</Text>
          <Text style={styles.daySubtitle}>{day.date} • {day.locations} locations</Text>
        </View>
        <Text style={[styles.expandIcon, {transform: [{rotate: day.expanded ? '180deg' : '0deg'}]}]}>
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
          source={{
            uri: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=400&fit=crop',
          }}
          style={styles.headerBackground}
          imageStyle={styles.headerImageStyle}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}>
            {/* Navigation */}
            <View style={styles.headerNav}>
              <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerLocation}>Kyoto, Japan</Text>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareIcon}>⤴</Text>
              </TouchableOpacity>
            </View>

            {/* Trip Info */}
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>4 Days in Kyoto</Text>
              <Text style={styles.tripDates}>October 26 - October 29</Text>
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
      <ScrollView style={styles.daysContainer} showsVerticalScrollIndicator={false}>
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
