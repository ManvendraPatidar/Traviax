import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  SlideInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { StackScreenProps } from "@react-navigation/stack";
import { VideoPlayer } from "@/components/reels/VideoPlayer";
import { theme } from "@/theme";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { apiService } from "@/services/api";

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
  creator?: {
    id: string;
    username: string;
    avatar: string;
    full_name: string;
  };
  comments_list?: any[];
}

type ReelDetailsScreenProps = StackScreenProps<RootStackParamList, 'ReelDetails'>;

export const ReelDetailsScreen: React.FC<ReelDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { reelId } = route.params;
  const [reel, setReel] = useState<ReelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [travelerMessage, setTravelerMessage] = useState("");
  
  const likeScale = useSharedValue(1);
  const heartOpacity = useSharedValue(0);
  const modalOpacity = useSharedValue(0);

  // Fetch reel data from API
  useEffect(() => {
    const fetchReelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const reelData = await apiService.getReelDetails(reelId);
        setReel(reelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reel');
      } finally {
        setLoading(false);
      }
    };

    if (reelId) {
      fetchReelData();
    }
  }, [reelId]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleLike = async () => {
    if (!reel) return;
    
    try {
      const result = await apiService.likeReel(reel.id);
      setReel(prev => prev ? { ...prev, likes: result.likes } : null);
      setLiked(result.liked);
    } catch (error) {
      console.error('Failed to like reel:', error);
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate like button
    likeScale.value = withSpring(1.2, {}, () => {
      likeScale.value = withSpring(1);
    });

    // Show floating heart
    heartOpacity.value = withTiming(1, { duration: 200 }, () => {
      heartOpacity.value = withTiming(0, { duration: 800 });
    });
  };

  const handleComment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to comments or show comments modal
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Implement share functionality
  };

  const handleAskTraveler = () => {
    setShowTravelerModal(true);
    modalOpacity.value = withTiming(1, { duration: 300 });
  };

  const handleSendMessage = async () => {
    if (travelerMessage.trim()) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Implement send message functionality
      setTravelerMessage("");
      setShowTravelerModal(false);
      modalOpacity.value = withTiming(0, { duration: 300 });
    }
  };

  const handleCloseModal = () => {
    setShowTravelerModal(false);
    modalOpacity.value = withTiming(0, { duration: 300 });
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

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading reel...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar style="light" />
        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // Trigger refetch
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No reel data
  if (!reel) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar style="light" />
        <Ionicons name="film-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={styles.errorText}>Reel not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <Animated.View entering={FadeIn.delay(200)} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reel Details</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Video Player */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.videoContainer}>
        <VideoPlayer
          videoUrl={reel.videoUrl}
          isVisible={true}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />

        {/* Floating heart animation */}
        <Animated.View style={[styles.floatingHeart, heartAnimatedStyle]}>
          <Ionicons name="heart" size={60} color={theme.colors.like} />
        </Animated.View>

        {/* Video overlay controls */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          style={styles.videoOverlay}
        >
          <View style={styles.videoActions}>
            {/* Like button */}
            <Animated.View style={likeAnimatedStyle}>
              <TouchableOpacity style={styles.videoActionButton} onPress={handleLike}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={32}
                  color={liked ? theme.colors.like : theme.colors.text}
                />
                <Text style={styles.videoActionText}>
                  {formatNumber(reel.likes)}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Comment button */}
            <TouchableOpacity style={styles.videoActionButton} onPress={handleComment}>
              <Ionicons name="chatbubble-outline" size={32} color={theme.colors.text} />
              <Text style={styles.videoActionText}>
                {formatNumber(reel.comments)}
              </Text>
            </TouchableOpacity>

            {/* Share button */}
            <TouchableOpacity style={styles.videoActionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={32} color={theme.colors.text} />
              <Text style={styles.videoActionText}>
                {formatNumber(reel.shares)}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Content Details */}
      <Animated.View entering={SlideInUp.delay(300)} style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Title and Location */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{reel.title}</Text>
            <Text style={styles.location}>📍 {reel.location}</Text>
            <Text style={styles.views}>👁️ {formatNumber(reel.views)} views</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{reel.description}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {reel.tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Engagement</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={20} color={theme.colors.like} />
                <Text style={styles.statNumber}>{formatNumber(reel.likes)}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={20} color={theme.colors.accent} />
                <Text style={styles.statNumber}>{formatNumber(reel.comments)}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="share" size={20} color={theme.colors.text} />
                <Text style={styles.statNumber}>{formatNumber(reel.shares)}</Text>
                <Text style={styles.statLabel}>Shares</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.statNumber}>{formatNumber(reel.views)}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Ask the Traveler Button */}
      <Animated.View entering={SlideInUp.delay(500)} style={styles.askTravelerContainer}>
        <TouchableOpacity
          style={styles.askTravelerButton}
          onPress={handleAskTraveler}
        >
          <LinearGradient
            colors={[theme.colors.accent, theme.colors.primary]}
            style={styles.askTravelerGradient}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.text} />
            <Text style={styles.askTravelerText}>Ask the Traveler</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Ask Traveler Modal */}
      <Modal
        visible={showTravelerModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <Animated.View style={[styles.modalBackdrop, modalAnimatedStyle]}>
            <TouchableOpacity
              style={styles.modalBackdropTouch}
              onPress={handleCloseModal}
            />
          </Animated.View>
          
          <Animated.View entering={SlideInUp} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ask the Traveler</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Have a question about this place? Ask the traveler!
            </Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor={theme.colors.textSecondary}
              value={travelerMessage}
              onChangeText={setTravelerMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: travelerMessage.trim() ? 1 : 0.5 }
              ]}
              onPress={handleSendMessage}
              disabled={!travelerMessage.trim()}
            >
              <LinearGradient
                colors={[theme.colors.accent, theme.colors.primary]}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>Send Message</Text>
                <Ionicons name="send" size={20} color={theme.colors.text} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    height: screenHeight * 0.5,
    position: "relative",
  },
  floatingHeart: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -30,
    marginTop: -30,
    zIndex: 5,
  },
  videoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: theme.spacing.md,
  },
  videoActions: {
    alignItems: "center",
    gap: theme.spacing.md,
  },
  videoActionButton: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  videoActionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.spacing.borderRadius.xl,
    borderTopRightRadius: theme.spacing.borderRadius.xl,
    marginTop: -theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  titleSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  views: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  descriptionSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tagsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  tagChip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  tagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  askTravelerContainer: {
    position: "absolute",
    bottom: 30,
    right: theme.spacing.md,
    zIndex: 10,
  },
  askTravelerButton: {
    borderRadius: theme.spacing.borderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  askTravelerGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.full,
    gap: theme.spacing.sm,
  },
  askTravelerText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdropTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.spacing.borderRadius.xl,
    borderTopRightRadius: theme.spacing.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  messageInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    minHeight: 100,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    borderRadius: theme.spacing.borderRadius.lg,
  },
  sendButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  sendButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
});