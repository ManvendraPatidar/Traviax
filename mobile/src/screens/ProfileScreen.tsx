import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PostCardComponent from "../components/PostCard";
import { apiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth } = Dimensions.get("window");

// UserProfile type definition
interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar: string;
  bio: string;
  city: string;
  visited_places: number;
  checkins: number;
  cities: number;
  followers: string;
  following: number;
  likes: string;
  rated_places: number;
  badges: string[];
  posts: Array<{
    id: string;
    location: string;
    timestamp: string;
    title: string;
    description: string;
    image?: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
  }>;
}

// Color scheme matching the reference design
const colors = {
  background: "#0d0d0d",
  surface: "#1a1a1a",
  cardBackground: "#252525",
  primary: "#f4c430",
  textPrimary: "#ffffff",
  textSecondary: "#999999",
  textMuted: "#666666",
};

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Wall" | "Rated Places">("Wall");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated first
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        // For development, use mock data when not authenticated
        const mockProfileData = {
          id: "u1",
          username: "alexwanderer",
          full_name: "Alex Wanderer",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          bio: "Cinematic storyteller exploring one city at a time",
          city: "New York, USA",
          visited_places: 128,
          checkins: 342,
          cities: 42,
          followers: "1.2K",
          following: 320,
          likes: "8.5K",
          rated_places: 67,
          badges: ["Explorer", "Photographer", "Storyteller"],
          posts: [
            {
              id: "1",
              location: "Kyoto, Japan",
              timestamp: "2h ago",
              title: "Just landed in Kyoto!",
              description: "The autumn colors are unreal. So excited to explore and capture the beauty of this city.",
              image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
              likes: 231,
              comments: 12,
              isLiked: false,
            },
            {
              id: "2",
              location: "Paris, France",
              timestamp: "1 day ago",
              title: "Found the most amazing little cafe in Montmartre.",
              description: "Sometimes the best discoveries are the ones you don't plan for. The espresso here is life-changing!",
              image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
              likes: 544,
              comments: 62,
              isLiked: true,
            },
            {
              id: "3",
              location: "Reykjavik, Iceland",
              timestamp: "3 days ago",
              title: "Chasing lights.",
              description: "Speechless. The aurora borealis is something you have to see to believe. Truly a magical experience.",
              image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
              likes: 912,
              comments: 88,
              isLiked: false,
            },
            {
              id: "4",
              location: "Tokyo, Japan",
              timestamp: "5 days ago",
              title: "Neon dreams in Shibuya",
              description: "The energy of this city is unmatched. Every corner tells a different story, every light paints a new scene.",
              likes: 678,
              comments: 45,
              isLiked: true,
            },
          ]
        };
        setProfile(mockProfileData);
        return;
      }
      
      // Get current user profile
      const currentUser = await apiService.getCurrentUser();
      
      // Get user's wall posts
      const wallPosts = await apiService.getUserWall(currentUser.id);
      
      // Combine profile data with posts
      const profileData = {
        ...currentUser,
        posts: wallPosts || []
      };
      
      setProfile(profileData);
    } catch (error: any) {
      console.error("Error loading profile:", error);
      
      // If it's a 403 error, show authentication-specific message
      if (error.response?.status === 403) {
        setError("Authentication required. Please log in to view your profile.");
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>No profile data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section with Map Background */}
        <ImageBackground
          source={require("../../assets/map.jpg")}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)", "rgba(13,13,13,1)"]}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              {/* Profile Image */}
              <ProfilePicture uri={profile.avatar} size={100} />

              {/* Username */}
              <Text style={styles.username}>@{profile.username}</Text>

              {/* Bio */}
              <Text style={styles.bio}>{profile.bio}</Text>

              {/* Location */}
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.location}>{profile.city}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
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

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatItem label="Visited" value={profile.visited_places} />
            </View>
            <View style={styles.statCard}>
              <StatItem label="Check-ins" value={profile.checkins} />
            </View>
            <View style={styles.statCard}>
              <StatItem label="Cities" value={profile.cities} />
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatItem label="Followers" value={profile.followers} />
            </View>
            <View style={styles.statCard}>
              <StatItem label="Following" value={profile.following} />
            </View>
            <View style={styles.statCard}>
              <StatItem label="Likes" value={profile.likes} />
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Wall" && styles.activeTab]}
            onPress={() => setActiveTab("Wall")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Wall" && styles.activeTabText,
              ]}
            >
              Wall
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "Rated Places" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Rated Places")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Rated Places" && styles.activeTabText,
              ]}
            >
              Rated Places
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Feed */}
        <View style={styles.contentContainer}>
          {activeTab === "Wall" && profile.posts && (
            <View>
              {profile.posts.map((post) => (
                <PostCardComponent
                  key={post.id}
                  post={post}
                  onLike={(postId: string) => console.log("Like post:", postId)}
                  onComment={(postId: string) =>
                    console.log("Comment on post:", postId)
                  }
                  onShare={(postId: string) =>
                    console.log("Share post:", postId)
                  }
                />
              ))}
            </View>
          )}
          {activeTab === "Rated Places" && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Rated places will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfilePicture: React.FC<{ uri: string; size?: number }> = ({
  uri,
  size = 100,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View
      style={[
        styles.profilePictureContainer,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {!imageError && uri && false ? (
        <Image
          source={{ uri }}
          style={[
            styles.profilePicture,
            {
              width: size,
              height: size,
              backgroundColor: "#ffffff",
              borderRadius: size / 2,
            },
          ]}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            styles.profilePicturePlaceholder,
            {
              width: size,
              height: size,
              backgroundColor: colors.cardBackground,
              borderRadius: size / 2,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={size * 0.5}
            color={colors.textSecondary}
          />
        </View>
      )}
    </View>
  );
};

const StatItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  headerBackground: {
    minHeight: 350,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePictureContainer: {
    // borderWidth: 3,
    // borderColor: colors.primary,
    marginBottom: 16,
  },
  profilePicture: {
    // Dynamic styles applied inline
  },
  profilePicturePlaceholder: {
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 20,
  },
  followButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: colors.textSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  followButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    backgroundColor: colors.background,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(37, 37, 37, 0.8)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    alignItems: "center",
    width: "100%",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: "row",
    // backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    marginBottom: 8,
  },
  postLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    gap: 20,
  },
  postAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  postActionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
  },
});
