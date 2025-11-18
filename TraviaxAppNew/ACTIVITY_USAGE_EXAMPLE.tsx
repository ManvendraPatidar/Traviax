/**
 * EXAMPLE: How to use ActivityCard and navigate to ActivityDetailsScreen
 *
 * This is a reference implementation showing how to:
 * 1. Display activity cards in a grid
 * 2. Navigate to ActivityDetailsScreen when tapped
 * 3. Pass activity data properly
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ActivityCard from './src/components/ActivityCard';

// Example activities data (from your mock.json)
const ACTIVITIES = [
  {
    id: 'a1',
    name: 'Scuba Diving Adventure',
    description: 'Explore underwater coral reefs and marine life',
    rating: 4.8,
    reviews: 567,
    price: '$75/person',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    location: 'Maldives',
    duration: '3-4 hours',
    timings: {
      daily: '8:00 AM - 5:00 PM',
      bestTime: '9:00 AM - 11:00 AM (Best visibility)',
    },
    highlights: [
      'Professional PADI-certified instructors',
      'All equipment provided',
      'Underwater photography included',
      'Small group sizes (max 6 people)',
    ],
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    ],
  },
  {
    id: 'a2',
    name: 'Hot Air Balloon Ride',
    description: 'Scenic balloon ride over valleys and mountains',
    rating: 4.9,
    reviews: 423,
    price: '$199/person',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    location: 'Cappadocia, Turkey',
    duration: '2-3 hours',
    timings: {
      daily: '5:00 AM - 8:00 AM',
      bestTime: '5:30 AM - 6:30 AM (Sunrise)',
    },
    highlights: [
      'Sunrise flight experience',
      'Champagne celebration included',
      'Professional pilot with 10+ years experience',
      'Hotel pickup and drop-off',
    ],
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    ],
  },
  {
    id: 'a3',
    name: 'City Food Tour',
    description: 'Taste local cuisine and street food specialties',
    rating: 4.6,
    reviews: 789,
    price: '$45/person',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    location: 'Bangkok, Thailand',
    duration: '4 hours',
    timings: {
      daily: '10:00 AM - 2:00 PM, 5:00 PM - 9:00 PM',
      bestTime: '5:00 PM - 9:00 PM (Evening tour)',
    },
    highlights: [
      'Visit 8+ local food spots',
      'Expert local guide',
      'All food tastings included',
      'Vegetarian options available',
    ],
  },
];

interface ActivitiesScreenExampleProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const ActivitiesScreenExample: React.FC<ActivitiesScreenExampleProps> = ({
  navigation,
}) => {
  const handleActivityPress = (activity: any) => {
    // Navigate to ActivityDetailsScreen with activity data
    navigation.navigate('ActivityDetails', {
      activity: activity,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Activities</Text>
        <Text style={styles.subtitle}>
          Discover amazing experiences around the world
        </Text>
      </View>

      <View style={styles.grid}>
        {ACTIVITIES.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() => handleActivityPress(activity)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999999',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
});

export default ActivitiesScreenExample;

/**
 * INTEGRATION STEPS:
 *
 * 1. Import ActivityCard component:
 *    import ActivityCard from './src/components/ActivityCard';
 *
 * 2. Fetch or define your activities data:
 *    const activities = await apiService.getActivities();
 *
 * 3. Render ActivityCard with navigation:
 *    <ActivityCard
 *      activity={activity}
 *      onPress={() => navigation.navigate('ActivityDetails', { activity })}
 *    />
 *
 * 4. The ActivityDetailsScreen will automatically:
 *    - Display the hero image
 *    - Show all activity information
 *    - Handle missing fields gracefully
 *    - Provide tabs for Overview, Highlights, and Community Rating
 *
 * MINIMAL DATA REQUIRED:
 * {
 *   name: 'Activity Name',
 *   image: 'https://...',
 *   price: '$XX/person'
 * }
 *
 * FULL DATA STRUCTURE:
 * {
 *   id: string,
 *   name: string,
 *   location: string,
 *   rating: number,
 *   reviews: number,
 *   price: string,
 *   image: string,
 *   description: string,
 *   duration: string,
 *   timings: {
 *     daily: string,
 *     bestTime: string
 *   },
 *   highlights: string[],
 *   photos: string[]
 * }
 */
