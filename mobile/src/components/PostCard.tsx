import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: {
    id: string;
    image?: string;
    location: string;
    title: string;
    description: string;
    timestamp: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
}) => {
  const colors = {
    background: '#0d0d0d',
    surface: '#1a1a1a',
    cardBackground: '#252525',
    primary: '#FFD700',
    text: '#ffffff',
    textSecondary: '#888888',
    border: 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <View style={styles.container}>
      {/* Conditional Image */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Location and Timestamp */}
        <View style={styles.locationRow}>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={styles.locationText}>{post.location}</Text>
          </View>
          <Text style={styles.timestampText}>{post.timestamp}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {post.description}
        </Text>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onLike?.(post.id)}
          >
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={post.isLiked ? colors.primary : colors.textSecondary}
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment?.(post.id)}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare?.(post.id)}
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252525',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#888888',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 6,
  },
});

export default PostCard;
