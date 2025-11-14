import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample static data
  const placesData = [
    {
      id: '1',
      title: 'Kyoto, Japan',
      description: 'Ancient temples and beautiful gardens',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Santorini, Greece',
      description: 'Stunning sunsets and white architecture',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Bali, Indonesia',
      description: 'Tropical paradise with rich culture',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Paris, France',
      description: 'City of lights and romance',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop',
      rating: 4.6,
    },
  ];

  const hotelsData = [
    {
      id: '1',
      title: 'Grand Palace Hotel',
      description: 'Luxury stay in the heart of the city',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
      price: '$299/night',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Ocean View Resort',
      description: 'Beachfront paradise with spa',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop',
      price: '$450/night',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Mountain Lodge',
      description: 'Cozy retreat in the mountains',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop',
      price: '$180/night',
      rating: 4.7,
    },
    {
      id: '4',
      title: 'Urban Boutique Hotel',
      description: 'Modern design meets comfort',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
      price: '$220/night',
      rating: 4.5,
    },
  ];

  const activitiesData = [
    {
      id: '1',
      title: 'Sunset Helicopter Tour',
      description: 'Breathtaking aerial views of the city',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop',
      duration: '2 hours',
      price: '$299',
      rating: 4.9,
    },
    {
      id: '2',
      title: 'Wine Tasting Experience',
      description: 'Sample local wines with expert guide',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=250&fit=crop',
      duration: '3 hours',
      price: '$85',
      rating: 4.6,
    },
    {
      id: '3',
      title: 'Scuba Diving Adventure',
      description: 'Explore underwater coral reefs',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
      duration: '4 hours',
      price: '$120',
      rating: 4.8,
    },
    {
      id: '4',
      title: 'Cultural Walking Tour',
      description: 'Discover hidden gems and local stories',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop',
      duration: '2.5 hours',
      price: '$45',
      rating: 4.7,
    },
  ];

  const renderPlaceCard = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHotelCard = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityCard = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{uri: item.image}} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.activityDetails}>
          <Text style={styles.durationText}>{item.duration}</Text>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          </View>
        </View>

        {/* Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Places</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={placesData}
            renderItem={renderPlaceCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>

        {/* Hotels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hotels</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={hotelsData}
            renderItem={renderHotelCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={activitiesData}
            renderItem={renderActivityCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  flatListContainer: {
    paddingLeft: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  activityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    color: '#888888',
  },
});

export default SearchScreen;
