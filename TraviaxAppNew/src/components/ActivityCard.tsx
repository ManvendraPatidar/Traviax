import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    title?: string;
    location?: string;
    rating?: number;
    reviews?: number;
    price?: string;
    image?: string;
    description?: string;
    highlights?: string[];
    timings?: {
      daily?: string;
      bestTime?: string;
    };
    duration?: string;
    photos?: string[];
  };
  onPress: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({activity, onPress}) => {
  const activityName = activity.title || activity.name;
  const activityRating = activity.rating || 0;
  const activityPrice = activity.price || 'Price on request';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{uri: activity.image}}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {activityRating}</Text>
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {activityName}
          </Text>
          <Text style={styles.price}>{activityPrice}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  content: {
    gap: 6,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  price: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ActivityCard;
