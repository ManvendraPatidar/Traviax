import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>Traviax</Text>
          <Text style={styles.greeting}>Good morning, Alex</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationIcon}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>✨</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Plan a trip to Tokyo..."
            placeholderTextColor="#666666"
          />
        </View>
      </View>

      {/* Ask TraviAI & Gift A Trip */}
      <View style={styles.section}>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Chat')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Ask TraviAI</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Gift')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Gift A Trip</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip Planner & Bookings */}
      <View style={styles.section}>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('PlanTrip')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Trip Planner</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Booking')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Bookings</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* For You Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For You</Text>
          <View style={styles.sectionTabs}>
            <Text style={[styles.tab, styles.activeTab]}>Trending Reels</Text>
            <Text style={styles.tab}>Recommended</Text>
          </View>
        </View>
        <View style={styles.reelsRow}>
          <View style={styles.reelCard}>
            <View style={styles.reelImage}>
              <Text style={styles.reelEmoji}>🏛️</Text>
            </View>
          </View>
          <View style={styles.reelCard}>
            <View style={styles.reelImage}>
              <Text style={styles.reelEmoji}>🏔️</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Trending Places */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Places</Text>
        <View style={styles.placesRow}>
          <TouchableOpacity
            style={styles.placeCard}
            onPress={() =>
              navigation?.navigate('PlaceDetails', {
                place: {
                  id: '1',
                  name: 'Kyoto Temple',
                  location: 'Historic District, Kyoto',
                  rating: 4.8,
                  reviews: 1245,
                  image:
                    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
                  description:
                    "Kyoto Temple is a magnificent historic temple complex showcasing traditional Japanese architecture. Experience centuries of spiritual heritage and breathtaking gardens in the heart of Japan's ancient capital.",
                  visitingHours: {
                    daily: '6:00 AM - 6:00 PM',
                    prime: '8:00 AM - 10:00 AM',
                  },
                  facts: [
                    {
                      icon: '🏛️',
                      text: 'Built over 1,000 years ago during the Heian period.',
                    },
                    {
                      icon: '🌸',
                      text: 'Famous for its stunning cherry blossom displays in spring.',
                    },
                    {
                      icon: '🧘',
                      text: 'Active meditation sessions available for visitors.',
                    },
                  ],
                  photos: [
                    'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=400&h=300&fit=crop',
                  ],
                },
              })
            }>
            <View style={styles.placeImage}>
              <Text style={styles.placeEmoji}>🏯</Text>
            </View>
            <Text style={styles.placeText}>Kyoto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.placeCard}
            onPress={() =>
              navigation?.navigate('PlaceDetails', {
                place: {
                  id: '2',
                  name: 'Sakura Gardens',
                  location: 'Cherry Blossom Park, Tokyo',
                  rating: 4.6,
                  reviews: 892,
                  image:
                    'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop',
                  description:
                    "Sakura Gardens offers one of Tokyo's most spectacular cherry blossom viewing experiences. Walk through thousands of blooming sakura trees and enjoy traditional Japanese tea ceremonies.",
                  visitingHours: {
                    daily: '5:00 AM - 9:00 PM',
                    prime: '6:00 AM - 8:00 AM',
                  },
                  facts: [
                    {
                      icon: '🌸',
                      text: 'Home to over 3,000 cherry blossom trees of 15 different varieties.',
                    },
                    {
                      icon: '📸',
                      text: 'Most photographed location during hanami season.',
                    },
                    {
                      icon: '🍵',
                      text: 'Traditional tea house with 400-year history on grounds.',
                    },
                  ],
                  photos: [
                    'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1583562835057-a62d1beffb8d?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=400&h=300&fit=crop',
                  ],
                },
              })
            }>
            <View style={styles.placeImage}>
              <Text style={styles.placeEmoji}>🌸</Text>
            </View>
            <Text style={styles.placeText}>Sakura</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Best Trip Itinerary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Trip Itinerary</Text>
        <View style={styles.itineraryList}>
          <TouchableOpacity
            style={styles.itineraryItem}
            onPress={() => navigation?.navigate('ItineraryDetails')}>
            <View style={styles.itineraryImage}>
              <Text style={styles.itineraryEmoji}>⛵</Text>
            </View>
            <View style={styles.itineraryInfo}>
              <Text style={styles.itineraryTitle}>Parisian Dream</Text>
              <Text style={styles.itinerarySubtitle}>Stay at Eiffel</Text>
              <Text style={styles.itineraryRating}>⭐ 4.9</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itineraryItem}
            onPress={() => navigation?.navigate('ItineraryDetails')}>
            <View style={styles.itineraryImage}>
              <Text style={styles.itineraryEmoji}>🏛️</Text>
            </View>
            <View style={styles.itineraryInfo}>
              <Text style={styles.itineraryTitle}>Roman Holiday</Text>
              <Text style={styles.itinerarySubtitle}>Ancient Rome</Text>
              <Text style={styles.itineraryRating}>⭐ 4.8</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itineraryItem}
            onPress={() => navigation?.navigate('ItineraryDetails')}>
            <View style={styles.itineraryImage}>
              <Text style={styles.itineraryEmoji}>🗼</Text>
            </View>
            <View style={styles.itineraryInfo}>
              <Text style={styles.itineraryTitle}>Tokyo Explorer</Text>
              <Text style={styles.itinerarySubtitle}>Modern Japan</Text>
              <Text style={styles.itineraryRating}>⭐ 4.9</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  tripPlannerCard: {
    backgroundColor: '#2A4A6B',
  },
  bookingsCard: {
    backgroundColor: '#4A6B4A',
  },
  cardIcon: {
    alignSelf: 'flex-start',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTabs: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    color: '#666666',
    fontSize: 14,
  },
  activeTab: {
    color: '#FFD700',
    fontWeight: '600',
  },
  reelsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reelCard: {
    flex: 1,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reelImage: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelEmoji: {
    fontSize: 32,
  },
  placesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  placeCard: {
    flex: 1,
    alignItems: 'center',
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeEmoji: {
    fontSize: 24,
  },
  placeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  itineraryList: {
    gap: 12,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  itineraryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itineraryEmoji: {
    fontSize: 20,
  },
  itineraryInfo: {
    flex: 1,
  },
  itineraryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  itinerarySubtitle: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
  },
  itineraryRating: {
    color: '#FFD700',
    fontSize: 12,
  },
  // Hero section styles
  heroImage: {
    height: 120,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: 12,
  },
  heroGradient: {
    padding: 16,
    borderRadius: 12,
  },
  // Quick access card styles
  quickAccessCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickAccessImage: {
    height: 100,
    justifyContent: 'flex-end',
  },
  quickAccessImageStyle: {
    borderRadius: 12,
  },
  quickAccessGradient: {
    padding: 12,
    borderRadius: 12,
  },
  quickAccessText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
