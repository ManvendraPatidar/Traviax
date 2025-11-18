import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import BackButton from '../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

interface PlaceDetailsScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: {
      place: {
        id: string;
        name: string;
        location: string;
        rating: number;
        reviews: number;
        image: string;
        description: string;
        visitingHours: {
          daily: string;
          prime: string;
        };
        facts: Array<{
          icon: string;
          text: string;
        }>;
        photos: string[];
      };
    };
  };
}

const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'activities' | 'community'
  >('overview');

  // Default place data if not provided
  const defaultPlace = {
    id: '1',
    name: 'Burj Khalifa',
    location: 'Landmark in Dubai',
    rating: 4.7,
    reviews: 321,
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    description:
      'The Burj Khalifa, a megatall skyscraper in Dubai, is the tallest building in the world. Its observation decks offer breathtaking panoramic views of the city, desert, and ocean. A true marvel of modern engineering and design.',
    visitingHours: {
      daily: '10:00 AM - 11:00 PM',
      prime: '4:00 PM - 6:30 PM',
    },
    facts: [
      {
        icon: '📏',
        text: 'Stands at a staggering height of 828 meters (2,717 feet).',
      },
      {
        icon: '⚡',
        text: "Features one of the world's fastest elevators, traveling at 10 meters per second.",
      },
      {
        icon: '⏱️',
        text: 'Took over 6 years and 22 million man-hours to complete.',
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    ],
  };

  const place = route?.params?.place || defaultPlace;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${place.name} in ${place.location}! ${place.description}`,
        title: place.name,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          ⭐
        </Text>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Text key="half" style={styles.star}>
          ⭐
        </Text>,
      );
    }

    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{place.description}</Text>

            {/* Visiting Hours */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visiting Hours</Text>
              <View style={styles.hoursContainer}>
                <View style={styles.hourItem}>
                  <View style={styles.hourIcon}>
                    <Text style={styles.hourIconText}>🕙</Text>
                  </View>
                  <Text style={styles.hourText}>
                    Daily: {place.visitingHours.daily}
                  </Text>
                </View>
                <View style={styles.hourItem}>
                  <View style={styles.hourIcon}>
                    <Text style={styles.hourIconText}>👥</Text>
                  </View>
                  <Text style={styles.hourText}>
                    Prime Hours: {place.visitingHours.prime}
                  </Text>
                </View>
              </View>
            </View>

            {/* Interesting Facts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interesting Facts</Text>
              {place.facts.map((fact, index) => (
                <View key={index} style={styles.factItem}>
                  <View style={styles.factIcon}>
                    <Text style={styles.factIconText}>{fact.icon}</Text>
                  </View>
                  <Text style={styles.factText}>{fact.text}</Text>
                </View>
              ))}
            </View>

            {/* Photos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <View style={styles.photosGrid}>
                {place.photos.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.photoContainer}>
                    <Image source={{uri: photo}} style={styles.photo} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'activities':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>
              Activities & Events coming soon...
            </Text>
          </View>
        );
      case 'community':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>
              Community Ratings coming soon...
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{uri: place.image}} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}>
            {/* Back Button */}
            <BackButton onPress={navigation.goBack} style={styles.backButton} />

            {/* Place Info */}
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeLocation}>{place.location}</Text>

              {/* Rating */}
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(place.rating)}
                </View>
                <Text style={styles.ratingText}>
                  {place.rating} ({place.reviews} reviews)
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.checkInButton}>
            <TouchableOpacity style={styles.buttonInner}>
              <Text style={styles.checkInText}>Check-In</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>🔖</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Text style={styles.iconButtonText}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' && styles.activeTabText,
              ]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
            onPress={() => setActiveTab('activities')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'activities' && styles.activeTabText,
              ]}>
              Activities & Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'community' && styles.activeTab]}
            onPress={() => setActiveTab('community')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'community' && styles.activeTabText,
              ]}>
              Community Rating
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
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
  heroContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  placeInfo: {
    alignSelf: 'stretch',
  },
  placeName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placeLocation: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  checkInButton: {
    flex: 1,
    borderRadius: 12,
    elevation: 5,
  },
  buttonInner: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  iconButtonText: {
    fontSize: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 20,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hoursContainer: {
    gap: 15,
  },
  hourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  hourIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourIconText: {
    fontSize: 18,
  },
  hourText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 15,
  },
  factIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factIconText: {
    fontSize: 18,
  },
  factText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoContainer: {
    width: (width - 60) / 2,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  comingSoon: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PlaceDetailsScreen;
