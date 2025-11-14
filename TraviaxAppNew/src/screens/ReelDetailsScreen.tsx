import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

interface ReelDetailsProps {
  route: {
    params: {
      reel: any;
    };
  };
  navigation: any;
}

const ReelDetailsScreen = ({route, navigation}: ReelDetailsProps) => {
  const {reel} = route.params;
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getReelTypeDetails = () => {
    // Determine reel type based on title/description keywords
    const content = `${reel.title} ${reel.description}`.toLowerCase();

    if (
      content.includes('hotel') ||
      content.includes('resort') ||
      content.includes('stay')
    ) {
      return {
        type: 'hotel',
        icon: '🏨',
        details: {
          name: reel.title,
          rating: 4.8,
          priceRange: '$150-300/night',
          amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
          checkIn: '3:00 PM',
          checkOut: '11:00 AM',
        },
      };
    } else if (
      content.includes('diving') ||
      content.includes('hiking') ||
      content.includes('tour') ||
      content.includes('balloon')
    ) {
      return {
        type: 'activity',
        icon: '🎯',
        details: {
          name: reel.title,
          duration: '3-4 hours',
          difficulty: 'Moderate',
          price: '$75-199/person',
          includes: ['Equipment', 'Guide', 'Photos', 'Refreshments'],
          bestTime: 'Morning (6:00 AM - 10:00 AM)',
        },
      };
    } else {
      return {
        type: 'location',
        icon: '📍',
        details: {
          name: reel.title,
          category: 'Tourist Destination',
          bestVisit: 'April - October',
          highlights: [
            'Sunset Views',
            'Photography',
            'Local Culture',
            'Architecture',
          ],
          nearbyAttractions: [
            'Ancient Ruins',
            'Local Markets',
            'Beaches',
            'Museums',
          ],
        },
      };
    }
  };

  const reelTypeDetails = getReelTypeDetails();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reel Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{uri: reel.image}} style={styles.mainImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />

          {/* User Info Overlay */}
          <View style={styles.userOverlay}>
            <Image source={{uri: reel.user.avatar}} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>@{reel.user.username}</Text>
              <Text style={styles.location}>{reel.location}</Text>
            </View>
          </View>
        </View>

        {/* Engagement Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={handleLike}>
            <Text style={[styles.statIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.statText}>{formatNumber(likes)} likes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statText}>
              {formatNumber(reel.comments)} comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statIcon}>↗️</Text>
            <Text style={styles.statText}>
              {formatNumber(reel.shares)} shares
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title and Description */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>{reel.title}</Text>
          <Text style={styles.description}>{reel.description}</Text>
        </View>

        {/* Type-specific Details */}
        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{reelTypeDetails.icon}</Text>
            <Text style={styles.sectionTitle}>
              {reelTypeDetails.type === 'hotel'
                ? 'Hotel Details'
                : reelTypeDetails.type === 'activity'
                ? 'Activity Details'
                : 'Location Details'}
            </Text>
          </View>

          <View style={styles.detailsCard}>
            {reelTypeDetails.type === 'hotel' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rating</Text>
                  <Text style={styles.detailValue}>
                    ⭐ {reelTypeDetails.details.rating}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price Range</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.priceRange}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check-in</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.checkIn}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check-out</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.checkOut}
                  </Text>
                </View>
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Amenities</Text>
                  <View style={styles.amenitiesList}>
                    {reelTypeDetails.details.amenities.map(
                      (amenity: string, index: number) => (
                        <View key={index} style={styles.amenityItem}>
                          <Text style={styles.amenityText}>• {amenity}</Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              </>
            )}

            {reelTypeDetails.type === 'activity' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.duration}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Difficulty</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.difficulty}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.price}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Best Time</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.bestTime}
                  </Text>
                </View>
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Includes</Text>
                  <View style={styles.amenitiesList}>
                    {reelTypeDetails?.details?.includes &&
                      reelTypeDetails?.details?.includes.map(
                        (item: string, index: number) => (
                          <View key={index} style={styles.amenityItem}>
                            <Text style={styles.amenityText}>• {item}</Text>
                          </View>
                        ),
                      )}
                  </View>
                </View>
              </>
            )}

            {reelTypeDetails.type === 'location' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.category}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Best Visit</Text>
                  <Text style={styles.detailValue}>
                    {reelTypeDetails.details.bestVisit}
                  </Text>
                </View>
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Highlights</Text>
                  <View style={styles.amenitiesList}>
                    {reelTypeDetails.details.highlights.map(
                      (highlight: string, index: number) => (
                        <View key={index} style={styles.amenityItem}>
                          <Text style={styles.amenityText}>• {highlight}</Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Nearby Attractions</Text>
                  <View style={styles.amenitiesList}>
                    {reelTypeDetails.details.nearbyAttractions.map(
                      (attraction: string, index: number) => (
                        <View key={index} style={styles.amenityItem}>
                          <Text style={styles.amenityText}>• {attraction}</Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {reelTypeDetails.type === 'hotel'
                ? 'Book Now'
                : reelTypeDetails.type === 'activity'
                ? 'Book Activity'
                : 'Explore Location'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Check In</Text>
          </TouchableOpacity>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  userOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  likedIcon: {
    transform: [{scale: 1.2}],
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  detailLabel: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  amenitiesSection: {
    marginTop: 20,
  },
  amenitiesTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    paddingVertical: 4,
  },
  amenityText: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ReelDetailsScreen;
