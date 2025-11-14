import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { VideoPlayer } from "./VideoPlayer";
import { theme } from "@/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ReelData {
  id: string;
  title: string;
  description: string;
  location: string;
  videoUrl: string;
  thumbnail: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  duration: number;
  creator_id: string;
  tags: string[];
  created_at: string;
}

interface ReelVideoCardProps {
  reel: ReelData;
  isVisible: boolean;
  isMuted: boolean;
  isLiked?: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onCheckIn?: () => void;
  onTap?: () => void;
}

export const ReelVideoCard: React.FC<ReelVideoCardProps> = ({
  reel,
  isVisible,
  isMuted,
  isLiked = false,
  onToggleMute,
  onLike,
  onComment,
  onShare,
  onCheckIn,
  onTap,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const likeScale = useSharedValue(1);
  const heartOpacity = useSharedValue(0);

  const handleLike = async () => {
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate like button
    likeScale.value = withSequence(withSpring(1.3), withSpring(1));

    // Show floating heart if liking
    if (!liked) {
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
    }

    setLiked(!liked);
    onLike();
  };

  // Update local state when prop changes
  React.useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleComment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComment();
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare();
  };

  const handleCheckIn = async () => {
    if (onCheckIn) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onCheckIn();
    }
  };

  const handleTap = () => {
    if (onTap) {
      onTap();
    }
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [
      { scale: heartOpacity.value * 2 },
      { translateY: -heartOpacity.value * 100 },
    ],
  }));

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleTap}
    >
      {/* Video Player */}
      <VideoPlayer
        videoUrl={reel.videoUrl}
        thumbnail={reel.thumbnail}
        isVisible={isVisible}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />

      {/* Floating heart animation */}
      <Animated.View style={[styles.floatingHeart, heartAnimatedStyle]}>
        <Ionicons name="heart" size={60} color={theme.colors.like} />
      </Animated.View>

      {/* Content overlay */}
      <LinearGradient
        colors={["transparent", "transparent", "rgba(0,0,0,0.7)"]}
        style={styles.contentOverlay}
      >
        <View style={styles.bottomContent}>
          {/* Left side - User info and location */}
          <View style={styles.leftContent}>
            {/* Title section with chips */}
            <View style={styles.titleSection}>
              {/* Location and category chips */}
              <View style={styles.chipsContainer}>
                <View style={styles.chip}>
                  <Ionicons name="location-outline" size={12} color="#FFD700" />
                  <Text style={styles.chipText}>{reel.location}</Text>
                </View>
                {reel.tags && reel.tags.length > 0 && (
                  <View style={styles.chip}>
                    <Ionicons name="pricetag-outline" size={12} color="#FFD700" />
                    <Text style={styles.chipText}>{reel.tags[0].replace('_', ' ')}</Text>
                  </View>
                )}
              </View>

              {/* Title */}
              <Text style={styles.titleText}>{reel.title}</Text>

              {/* Description */}
              <Text style={styles.descriptionText}>
                {reel.description}
              </Text>

              {/* Hashtags */}
              {reel.tags && reel.tags.length > 0 && (
                <View style={styles.hashtagsContainer}>
                  {reel.tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} style={styles.hashtag}>
                      #{tag}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Check-In button */}
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={handleCheckIn}
            >
              <Ionicons name="location" size={16} color="#000" />
              <Text style={styles.checkInText}>Check-In</Text>
            </TouchableOpacity>
          </View>

          {/* Right side - Stats */}
          <View style={styles.rightStats}>
            <Animated.View style={likeAnimatedStyle}>
              <TouchableOpacity style={styles.statButton} onPress={handleLike}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? theme.colors.like : theme.colors.text}
                />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.statNumber}>{formatNumber(reel.likes)}</Text>

            <TouchableOpacity style={styles.statButton} onPress={handleComment}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.statNumber}>{formatNumber(reel.comments)}</Text>

            <TouchableOpacity style={styles.statButton} onPress={handleShare}>
              <Ionicons
                name="share-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.statNumber}>{formatNumber(reel.shares)}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: theme.colors.background,
    position: "relative",
  },
  floatingHeart: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -30,
    marginTop: -30,
    zIndex: 10,
  },
  topTabs: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xl,
    zIndex: 5,
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  tabText: {
    fontSize: theme.typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: theme.typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  activeTab: {
    color: theme.colors.text,
  },
  tabIndicator: {
    width: 30,
    height: 2,
    backgroundColor: theme.colors.accent,
    marginTop: theme.spacing.xs,
    borderRadius: 1,
  },
  contentOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    justifyContent: "flex-end",
  },
  bottomContent: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginBottom: 60, // Reduced space to navbar
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  username: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  location: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.borderRadius.full,
    gap: theme.spacing.xs,
    alignSelf: "flex-start",
  },
  checkInText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#000",
    fontWeight: theme.typography.fontWeight.semibold,
  },
  titleSection: {
    marginBottom: theme.spacing.md,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.borderRadius.full,
    gap: theme.spacing.xs,
  },
  chipText: {
    fontSize: theme.typography.fontSize.xs,
    color: "#FFD700",
    fontWeight: theme.typography.fontWeight.medium,
  },
  titleText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  hashtag: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightStats: {
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: 140,
  },
  statButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: theme.spacing.sm,
  },
});
