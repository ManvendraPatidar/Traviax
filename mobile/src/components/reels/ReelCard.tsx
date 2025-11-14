import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/theme';

const { width: screenWidth } = Dimensions.get('window');

interface ReelCardProps {
  reel: {
    id: string;
    title: string;
    location: string;
    thumbnail: string;
    likes: number;
    comments: number;
    views: number;
    creator?: {
      username: string;
      avatar: string;
      full_name: string;
    };
  };
  onPress: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  onPress,
  onLike,
  onComment,
  onShare,
}) => {
  const [liked, setLiked] = useState(false);
  const likeScale = useSharedValue(1);
  const heartOpacity = useSharedValue(0);

  const handleLike = () => {
    setLiked(!liked);
    
    // Animate like button
    likeScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    
    // Show floating heart
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 800 })
    );
    
    onLike();
  };

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [
      { scale: heartOpacity.value * 1.5 },
      { translateY: -heartOpacity.value * 50 },
    ],
  }));

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: reel.thumbnail }} style={styles.thumbnail} />
        
        {/* Play button overlay */}
        <View style={styles.playOverlay}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color={theme.colors.text} />
          </View>
        </View>

        {/* Floating heart animation */}
        <Animated.View style={[styles.floatingHeart, heartAnimatedStyle]}>
          <Ionicons name="heart" size={40} color={theme.colors.like} />
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {reel.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {reel.location}
        </Text>

        {/* Creator info */}
        {reel.creator && (
          <View style={styles.creator}>
            <Image source={{ uri: reel.creator.avatar }} style={styles.avatar} />
            <Text style={styles.username}>@{reel.creator.username}</Text>
          </View>
        )}

        {/* Stats and actions */}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.stat}>{formatNumber(reel.views)} views</Text>
          </View>

          <View style={styles.actions}>
            <Animated.View style={likeAnimatedStyle}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons 
                  name={liked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={liked ? theme.colors.like : theme.colors.textSecondary} 
                />
                <Text style={styles.actionText}>{formatNumber(reel.likes)}</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.actionButton} onPress={onComment}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>{formatNumber(reel.comments)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.spacing.shadow.md,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.spacing.borderRadius.full,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  floatingHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: theme.spacing.sm,
  },
  username: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flex: 1,
  },
  stat: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
});
