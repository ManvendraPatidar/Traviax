import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '@/theme';
import { fetchItineraryById } from '@/services/apiService';
import { Itinerary, Activity, Day } from '@/services/itineraryService';

interface RouteParams {
  itineraryId: string;
}

export const ItineraryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itineraryId } = route.params as RouteParams;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number>(1);

  useEffect(() => {
    const loadItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching itinerary with ID:', itineraryId);
        
        const fetchedItinerary = await fetchItineraryById(itineraryId);
        
        if (fetchedItinerary) {
          setItinerary(fetchedItinerary);
        } else {
          setError('Itinerary not found');
        }
      } catch (err) {
        console.error('Error loading itinerary:', err);
        setError('Failed to load itinerary. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadItinerary();
  }, [itineraryId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading itinerary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              const loadItinerary = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  const fetchedItinerary = await fetchItineraryById(itineraryId);
                  if (fetchedItinerary) {
                    setItinerary(fetchedItinerary);
                  } else {
                    setError('Itinerary not found');
                  }
                } catch (err) {
                  setError('Failed to load itinerary. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              loadItinerary();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Itinerary not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? 0 : dayNumber);
  };

  const renderActivity = (activity: Activity, index: number) => (
    <TouchableOpacity key={index} style={styles.activityItem}>
      <Image source={{ uri: activity.image }} style={styles.activityImage} />
      <View style={styles.activityContent}>
        <Text style={styles.activityTime}>{activity.time}</Text>
        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );

  const renderDay = (day: Day) => (
    <View key={day.day} style={styles.dayCard}>
      <TouchableOpacity
        style={styles.dayHeader}
        onPress={() => toggleDay(day.day)}
      >
        <View style={styles.dayHeaderContent}>
          <Text style={styles.dayTitle}>
            Day {day.day}: {day.title}
          </Text>
          <Text style={styles.daySubtitle}>
            {day.date} • {day.locationCount} Locations
          </Text>
        </View>
        <Ionicons
          name={expandedDay === day.day ? "chevron-up" : "chevron-down"}
          size={24}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>
      
      {expandedDay === day.day && (
        <View style={styles.dayContent}>
          {day.activities.map((activity, index) => renderActivity(activity, index))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: itinerary.heroImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.locationText}>{itinerary.location}</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Hero Content */}
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{itinerary.title}</Text>
                <Text style={styles.heroDateRange}>{itinerary.dateRange}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Itinerary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Days List */}
        <View style={styles.daysContainer}>
          {itinerary.days.map(renderDay)}
        </View>

        {/* Regenerate Button */}
        <View style={styles.regenerateContainer}>
          <TouchableOpacity style={styles.regenerateButton}>
            <Ionicons name="refresh" size={20} color="#000" style={styles.regenerateIcon} />
            <Text style={styles.regenerateText}>Regenerate</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroDateRange: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  shareButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dayCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayHeaderContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  daySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  dayContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  activityContent: {
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  regenerateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  regenerateIcon: {
    marginRight: 4,
  },
  regenerateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomPadding: {
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
