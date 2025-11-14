import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {apiService, UserProfile, WallPost} from '../services/api';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('wall');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wallPosts, setWallPosts] = useState<WallPost[]>([]);
  const [_visitedPlaces, setVisitedPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Using demo user ID from backend mock data
  const userId = 'u1';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await apiService.getUserProfile(userId);

        setUserProfile(profile);
        setWallPosts(profile.posts || []);
        setVisitedPlaces(profile.visited_places_list || []);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Create user stats from profile data
  const userStats = userProfile
    ? [
        {label: 'Posts', value: userProfile.posts_count?.toString() || '0'},
        {label: 'Following', value: formatNumber(userProfile.following)},
        {label: 'Followers', value: formatNumber(userProfile.followers)},
        {label: 'Likes', value: formatNumber(userProfile.likes)},
        {label: 'Places', value: formatNumber(userProfile.visited_places)},
        {label: 'Cities', value: formatNumber(userProfile.cities)},
      ]
    : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header Section with Map Background */}
        <ImageBackground
          source={require('../../assets/map.jpg')}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={styles.headerGradient}>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      userProfile.avatar ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                  }}
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.username}>@{userProfile.username}</Text>
              <Text style={styles.bio}>
                {userProfile.bio || 'Travel enthusiast'}
              </Text>
              <Text style={styles.location}>
                {userProfile.city || 'Location not specified'}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageButton}>
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {userStats.slice(0, 3).map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.statsRow}>
            {userStats.slice(3, 6).map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabbed Wall Section */}
        <View style={styles.wallSection}>
          {/* Tab Headers */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'wall' && styles.activeTab]}
              onPress={() => setActiveTab('wall')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'wall' && styles.activeTabText,
                ]}>
                Wall
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'rated' && styles.activeTab]}
              onPress={() => setActiveTab('rated')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'rated' && styles.activeTabText,
                ]}>
                Rated Places
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'wall' && (
            <View style={styles.tabContent}>
              {wallPosts.length > 0 ? (
                wallPosts.map(post => (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <Image
                        source={{uri: userProfile?.avatar}}
                        style={styles.postAvatar}
                      />
                      <View style={styles.postUserInfo}>
                        <Text style={styles.postUsername}>
                          {userProfile?.username}
                        </Text>
                        <Text style={styles.postTimestamp}>
                          {post.location} • {post.timestamp}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.postTextContainer}>
                      <Text style={styles.postTitle}>{post.title}</Text>
                      <Text style={styles.postContent}>{post.description}</Text>
                    </View>

                    {post.image && (
                      <Image
                        source={{uri: post.image}}
                        style={styles.postImage}
                      />
                    )}

                    <View style={styles.postActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>♥ {post.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>
                          💬 {post.comments}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>↗ Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No posts yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Share your travel experiences to see them here
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'rated' && (
            <View style={styles.tabContent}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No rated places yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Start exploring and rating places to see them here
                </Text>
              </View>
            </View>
          )}
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
  headerBackground: {
    minHeight: 300,
  },
  headerBackgroundImage: {
    resizeMode: 'cover',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  location: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  followButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'capitalize',
  },
  wallSection: {
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tabContent: {
    paddingTop: 10,
  },
  postCard: {
    backgroundColor: '#1A1A1A',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  postImageContainer: {
    position: 'relative',
    height: 200,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  postLocation: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 5,
  },
  postTitleOld: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 18,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#888888',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUsername: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTimestamp: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 20,
  },
  postTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ProfileScreen;
