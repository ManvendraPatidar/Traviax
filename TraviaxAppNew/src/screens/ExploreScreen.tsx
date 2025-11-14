import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {apiService} from '../services/api';

const {width} = Dimensions.get('window');

// Sample static data
const placesData = [
  {
    id: '1',
    title: 'Santorini, Greece',
    description: 'Beautiful white buildings and blue domes',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop',
    rating: 4.8,
    price: '$120/night',
  },
  {
    id: '2',
    title: 'Kyoto, Japan',
    description: 'Traditional temples and cherry blossoms',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop',
    rating: 4.9,
    price: '$95/night',
  },
  {
    id: '3',
    title: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches',
    image:
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop',
    rating: 4.7,
    price: '$80/night',
  },
  {
    id: '4',
    title: 'Paris, France',
    description: 'City of lights and romance',
    image:
      'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
    rating: 4.6,
    price: '$150/night',
  },
];

const hotelsData = [
  {
    id: '1',
    title: 'Grand Palace Hotel',
    description: 'Luxury 5-star hotel in city center',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
    rating: 4.9,
    price: '$299/night',
  },
  {
    id: '2',
    title: 'Seaside Resort',
    description: 'Beachfront resort with ocean views',
    image:
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
    rating: 4.7,
    price: '$189/night',
  },
  {
    id: '3',
    title: 'Mountain Lodge',
    description: 'Cozy lodge with mountain views',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop',
    rating: 4.8,
    price: '$129/night',
  },
  {
    id: '4',
    title: 'Urban Boutique',
    description: 'Modern boutique hotel downtown',
    image:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300&h=200&fit=crop',
    rating: 4.5,
    price: '$199/night',
  },
];

const activitiesData = [
  {
    id: '1',
    title: 'Scuba Diving',
    description: 'Explore underwater coral reefs',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
    rating: 4.8,
    price: '$75/person',
  },
  {
    id: '2',
    title: 'Hot Air Balloon',
    description: 'Scenic balloon ride over valleys',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    rating: 4.9,
    price: '$199/person',
  },
  {
    id: '3',
    title: 'City Food Tour',
    description: 'Taste local cuisine and street food',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
    rating: 4.6,
    price: '$45/person',
  },
  {
    id: '4',
    title: 'Mountain Hiking',
    description: 'Guided trek through scenic trails',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop',
    rating: 4.7,
    price: '$35/person',
  },
];

interface ExploreScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic data states
  const [hotels, setHotels] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Loading states
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Error states
  const [hotelsError, setHotelsError] = useState<string | null>(null);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchHotels(), fetchPlaces(), fetchActivities()]);
  };

  const fetchHotels = async () => {
    try {
      setHotelsLoading(true);
      setHotelsError(null);
      const data = await apiService.getHotels();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotelsError('Failed to load hotels');
      // Fallback to static data
      setHotels(hotelsData);
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      setPlacesLoading(true);
      setPlacesError(null);
      const data = await apiService.getPlaces();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlacesError('Failed to load places');
      // Fallback to static data
      setPlaces(placesData);
    } finally {
      setPlacesLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const data = await apiService.getActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivitiesError('Failed to load activities');
      // Fallback to static data
      setActivities(activitiesData);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const createPlaceData = (item: any) => ({
    id: item.id,
    name: item.name || item.title,
    location: item.location || item.description,
    rating: item.rating,
    reviews: item.reviews || Math.floor(Math.random() * 1000) + 100,
    image: item.image || (item.photos && item.photos[0]),
    description:
      item.description ||
      `${
        item.name || item.title
      } - Experience the beauty and culture of this amazing destination.`,
    visitingHours: item.visitingHours || {
      daily: '9:00 AM - 8:00 PM',
      prime: '10:00 AM - 6:00 PM',
    },
    facts: item.facts || [
      {
        icon: '🌟',
        text: `Rated ${item.rating} stars by thousands of visitors.`,
      },
      {
        icon: '📍',
        text: 'Prime location with easy access to major attractions.',
      },
    ],
    photos: item.photos || [item.image],
  });

  const renderPlaceCard = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation?.navigate('PlaceDetails', {
          place: createPlaceData(item),
        });
      }}>
      <Image
        source={{uri: item.image || (item.photos && item.photos[0])}}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHotelCard = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation?.navigate('PlaceDetails', {
          place: createPlaceData(item),
        });
      }}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActivityCard = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const renderErrorState = (error: string, retryFunction: () => void) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retryFunction}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  const renderSection = (
    title: string,
    data: any[],
    icon: string,
    loading: boolean,
    error: string | null,
    retryFunction: () => void,
  ) => {
    const getRenderFunction = () => {
      switch (title) {
        case 'Places':
          return renderPlaceCard;
        case 'Hotels':
          return renderHotelCard;
        case 'Activities':
          return renderActivityCard;
        default:
          return renderActivityCard;
      }
    };

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>{icon}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState(error, retryFunction)
        ) : data.length === 0 ? (
          renderEmptyState(`No ${title.toLowerCase()} available`)
        ) : (
          <FlatList
            data={data}
            renderItem={getRenderFunction()}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Discover amazing places</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations, hotels, activities..."
              placeholderTextColor="#888888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.filterChip, styles.activeFilter]}>
              <Text style={[styles.filterText, styles.activeFilterText]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>🏖️ Beach</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>🏔️ Mountain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>🏛️ Culture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>🍽️ Food</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Sections */}
        {renderSection(
          'Places',
          places,
          '🏝️',
          placesLoading,
          placesError,
          fetchPlaces,
        )}
        {renderSection(
          'Hotels',
          hotels,
          '🏨',
          hotelsLoading,
          hotelsError,
          fetchHotels,
        )}
        {renderSection(
          'Activities',
          activities,
          '🎯',
          activitiesLoading,
          activitiesError,
          fetchActivities,
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888888',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#888888',
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterChip: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  activeFilter: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#000000',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalList: {
    paddingLeft: 20,
  },
  card: {
    width: width * 0.7,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
  // UI State Styles
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExploreScreen;
