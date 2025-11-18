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

interface ActivityDetailsScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: {
      activity: {
        id: string;
        name: string;
        title?: string;
        location?: string;
        rating?: number;
        reviews?: number;
        price?: string;
        image?: string;
        images?: string[];
        description?: string;
        highlights?: string[];
        timings?: {
          daily?: string;
          bestTime?: string;
        };
        duration?: string;
        photos?: string[];
      };
    };
  };
}

const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'highlights' | 'community'
  >('overview');

  // Default activity data if not provided
  const defaultActivity = {
    id: 'a1',
    name: 'Scuba Diving Adventure',
    location: 'Maldives',
    rating: 4.8,
    reviews: 567,
    price: '$75/person',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    description:
      'Dive into crystal-clear waters and explore vibrant coral reefs teeming with marine life. This unforgettable scuba diving experience is perfect for both beginners and experienced divers. Professional instructors will guide you through the underwater world, ensuring safety and maximum enjoyment.',
    timings: {
      daily: '8:00 AM - 5:00 PM',
      bestTime: '9:00 AM - 11:00 AM (Best visibility)',
    },
    duration: '3-4 hours',
    highlights: [
      'Professional PADI-certified instructors',
      'All equipment provided (wetsuit, tank, fins, mask)',
      'Underwater photography included',
      'Small group sizes (max 6 people)',
      'Safety briefing and training session',
      'Refreshments and snacks provided',
    ],
    photos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop',
    ],
  };

  const activity = route?.params?.activity || defaultActivity;

  // Normalize activity data
  const activityName = activity.title || activity.name || 'Activity';
  const activityLocation = activity.location || 'Location';
  const activityRating = activity.rating || 4.5;
  const activityReviews = activity.reviews || 0;
  const activityPrice = activity.price || 'Price on request';
  const activityImage =
    activity.image ||
    (activity.images && activity.images[0]) ||
    defaultActivity.image;
  const activityDescription =
    activity.description || 'No description available';
  const activityTimings = activity.timings || defaultActivity.timings;
  const activityDuration = activity.duration || 'Duration varies';
  const activityHighlights = activity.highlights || defaultActivity.highlights;
  const activityPhotos =
    activity.photos ||
    activity.images ||
    (activity.image ? [activity.image] : defaultActivity.photos);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${activityName} in ${activityLocation}! ${activityDescription}`,
        title: activityName,
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
            <Text style={styles.description}>{activityDescription}</Text>

            {/* Timing & Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Timing & Duration</Text>
              <View style={styles.hoursContainer}>
                <View style={styles.hourItem}>
                  <View style={styles.hourIcon}>
                    <Text style={styles.hourIconText}>🕙</Text>
                  </View>
                  <View style={styles.hourTextContainer}>
                    <Text style={styles.hourLabel}>Operating Hours</Text>
                    <Text style={styles.hourText}>{activityTimings.daily}</Text>
                  </View>
                </View>
                <View style={styles.hourItem}>
                  <View style={styles.hourIcon}>
                    <Text style={styles.hourIconText}>⏱️</Text>
                  </View>
                  <View style={styles.hourTextContainer}>
                    <Text style={styles.hourLabel}>Duration</Text>
                    <Text style={styles.hourText}>{activityDuration}</Text>
                  </View>
                </View>
                {activityTimings.bestTime && (
                  <View style={styles.hourItem}>
                    <View style={styles.hourIcon}>
                      <Text style={styles.hourIconText}>👥</Text>
                    </View>
                    <View style={styles.hourTextContainer}>
                      <Text style={styles.hourLabel}>Best Time</Text>
                      <Text style={styles.hourText}>
                        {activityTimings.bestTime}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Photos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <View style={styles.photosGrid}>
                {activityPhotos.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.photoContainer}>
                    <Image
                      source={{uri: photo}}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 'highlights':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              {activityHighlights.map((highlight, index) => (
                <View key={index} style={styles.factItem}>
                  <View style={styles.factIcon}>
                    <Text style={styles.factIconText}>✓</Text>
                  </View>
                  <Text style={styles.factText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'community':
        return (
          <View style={styles.tabContent}>
            <View style={styles.ratingSection}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingScore}>{activityRating}</Text>
                <View style={styles.ratingDetails}>
                  <View style={styles.starsContainer}>
                    {renderStars(activityRating)}
                  </View>
                  <Text style={styles.ratingCount}>
                    Based on {activityReviews} reviews
                  </Text>
                </View>
              </View>
              <Text style={styles.comingSoon}>
                Detailed reviews coming soon...
              </Text>
            </View>
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
          <Image
            source={{uri: activityImage}}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}>
            {/* Back Button */}
            <BackButton onPress={navigation.goBack} style={styles.backButton} />

            {/* Activity Info */}
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{activityName}</Text>
              <Text style={styles.activityLocation}>{activityLocation}</Text>

              {/* Rating & Price */}
              <View style={styles.ratingPriceContainer}>
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(activityRating)}
                  </View>
                  <Text style={styles.ratingText}>
                    {activityRating} ({activityReviews} reviews)
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>From</Text>
                  <Text style={styles.priceText}>{activityPrice}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.bookButton}>
            <TouchableOpacity style={styles.buttonInner}>
              <Text style={styles.bookText}>Book Now</Text>
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
            style={[styles.tab, activeTab === 'highlights' && styles.activeTab]}
            onPress={() => setActiveTab('highlights')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'highlights' && styles.activeTabText,
              ]}>
              Highlights
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
  activityInfo: {
    alignSelf: 'stretch',
  },
  activityName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityLocation: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 15,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  priceText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  bookButton: {
    flex: 1,
    borderRadius: 12,
    elevation: 5,
  },
  buttonInner: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
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
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
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
  hourTextContainer: {
    flex: 1,
  },
  hourLabel: {
    color: '#999999',
    fontSize: 12,
    marginBottom: 4,
  },
  hourText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
    fontWeight: 'bold',
    color: '#000000',
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
    backgroundColor: '#1A1A1A',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  ratingSection: {
    gap: 20,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  ratingScore: {
    color: '#FFD700',
    fontSize: 48,
    fontWeight: 'bold',
  },
  ratingDetails: {
    flex: 1,
  },
  ratingCount: {
    color: '#999999',
    fontSize: 14,
    marginTop: 5,
  },
  comingSoon: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ActivityDetailsScreen;
