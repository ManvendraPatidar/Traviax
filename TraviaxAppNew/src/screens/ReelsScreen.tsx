import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('screen');

// Sample reels data with travel content
const initialReelsData = [
  {
    id: '1',
    title: 'Chasing the Aegean Sun',
    description:
      'Santorini, you have my heart. #travel #sunset #greece #wanderlust',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=800&fit=crop',
    user: {
      username: 'TravelExplorer',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    },
    location: 'Santorini, Greece',
    likes: 12100,
    comments: 1204,
    shares: 89,
    isLiked: false,
  },
  {
    id: '2',
    title: 'Tokyo Nights',
    description:
      'The neon lights of Shibuya never fail to amaze me. This city is pure magic! ✨',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=800&fit=crop',
    user: {
      username: 'CityWanderer',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    },
    location: 'Tokyo, Japan',
    likes: 8500,
    comments: 432,
    shares: 156,
    isLiked: true,
  },
  {
    id: '3',
    title: 'Bali Paradise',
    description:
      'Rice terraces that stretch to infinity. Bali, you are breathtaking! 🌾',
    image:
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=800&fit=crop',
    user: {
      username: 'NatureSeeker',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    location: 'Ubud, Bali',
    likes: 15600,
    comments: 892,
    shares: 234,
    isLiked: false,
  },
  {
    id: '4',
    title: 'Northern Lights Magic',
    description:
      "Dancing auroras in the Arctic sky. Nature's most spectacular show! 🌌",
    image:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=800&fit=crop',
    user: {
      username: 'ArcticExplorer',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    location: 'Tromsø, Norway',
    likes: 22300,
    comments: 1567,
    shares: 445,
    isLiked: true,
  },
  {
    id: '5',
    title: 'Parisian Dreams',
    description:
      'Golden hour at the Eiffel Tower. Some moments are pure poetry 🗼',
    image:
      'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=800&fit=crop',
    user: {
      username: 'EuropeanVibes',
      avatar:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face',
    },
    location: 'Paris, France',
    likes: 9800,
    comments: 678,
    shares: 123,
    isLiked: false,
  },
];

interface ReelsScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

const ReelsScreen = ({navigation}: ReelsScreenProps) => {
  const [reelsData, setReelsData] = useState(initialReelsData);
  const [_currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleLike = useCallback((id: string) => {
    setReelsData(prevData =>
      prevData.map(reel =>
        reel.id === id
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel,
      ),
    );
  }, []);

  const loadMoreReels = useCallback(() => {
    // Simulate loading more reels by duplicating existing ones with new IDs
    const newReels = initialReelsData.map((reel, index) => ({
      ...reel,
      id: `${Date.now()}_${index}`,
      likes: Math.floor(Math.random() * 50000) + 1000,
      comments: Math.floor(Math.random() * 2000) + 100,
      shares: Math.floor(Math.random() * 500) + 10,
      isLiked: Math.random() > 0.5,
    }));
    setReelsData(prevData => [...prevData, ...newReels]);
  }, []);

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
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

  const renderReel = ({item}: {item: any; index: number}) => (
    <View style={styles.reelContainer}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.backgroundImage}>
        {/* Top gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.topGradient}
        />

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bottomGradient}
        />

        {/* Top tabs */}
        <SafeAreaView style={styles.topSection}>
          <View style={styles.topTabs}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.activeTabText}>For You</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Following</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Right side actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}>
            <Text style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
              {item.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗️</Text>
            <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          {/* User info */}
          <View style={styles.userInfo}>
            <Image source={{uri: item.user.avatar}} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.username}>@{item.user.username}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>

          {/* Title and description */}
          <TouchableOpacity
            style={styles.textContent}
            onPress={() => navigation?.navigate('ReelDetails', {reel: item})}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>

          {/* Check-in button */}
          <TouchableOpacity style={styles.checkInButton}>
            <Text style={styles.checkInIcon}>📍</Text>
            <Text style={styles.checkInText}>Check-In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        hidden={true}
      />
      <FlatList
        ref={flatListRef}
        data={reelsData}
        renderItem={renderReel}
        keyExtractor={item => item.id}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreReels}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={16}
        bounces={false}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        removeClippedSubviews={false}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        disableIntervalMomentum={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  reelContainer: {
    width: width,
    height: height,
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: 'space-between',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  topSection: {
    zIndex: 2,
  },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    gap: 30,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightActions: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    zIndex: 2,
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    fontSize: 28,
    textAlign: 'center',
  },
  likedIcon: {
    transform: [{scale: 1.2}],
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
    zIndex: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userDetails: {
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
  textContent: {
    marginBottom: 15,
    paddingRight: 80,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 22,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  checkInIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  checkInText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReelsScreen;
