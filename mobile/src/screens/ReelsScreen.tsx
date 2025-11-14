import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ReelVideoCard } from "@/components/reels/ReelVideoCard";
import { apiService } from "@/services/api";
import { likedReelsStorage } from "@/utils/likedReelsStorage";
import { theme } from "@/theme";
import { RootStackParamList } from "@/navigation/AppNavigator";

const { height: screenHeight } = Dimensions.get("window");

type ReelsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;

interface Reel {
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

export const ReelsScreen: React.FC = () => {
  const navigation = useNavigation<ReelsScreenNavigationProp>();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  const loadReels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getReels();
      console.log("API Response:", response);
      setReels(response.data?.reels || []);

      // Load liked reels from storage
      const liked = await likedReelsStorage.getLikedReels();
      setLikedReels(new Set(liked));
    } catch (error) {
      console.error("Error loading reels:", error);
      setReels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleIndex = viewableItems[0].index;
        if (visibleIndex !== null) {
          setCurrentIndex(visibleIndex);
        }
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = async (reelId: string) => {
    try {
      const isLiked = likedReels.has(reelId);
      const newLikedReels = new Set(likedReels);

      if (isLiked) {
        newLikedReels.delete(reelId);
        // Update local state optimistically
        setReels((prev) =>
          prev.map((reel) =>
            reel.id === reelId ? { ...reel, likes: reel.likes - 1 } : reel
          )
        );
      } else {
        newLikedReels.add(reelId);
        // Update local state optimistically
        setReels((prev) =>
          prev.map((reel) =>
            reel.id === reelId ? { ...reel, likes: reel.likes + 1 } : reel
          )
        );
      }

      setLikedReels(newLikedReels);
      await likedReelsStorage.saveLikedReels(Array.from(newLikedReels));
      // await apiService.likeReel(reelId);
    } catch (error) {
      console.error("Error liking reel:", error);
    }
  };

  const handleComment = (reelId: string) => {
    // Navigate to comments
    console.log("Open comments for reel:", reelId);
  };

  const handleShare = (reelId: string) => {
    // Share reel
    console.log("Share reel:", reelId);
  };

  const handleCheckIn = (reelId: string) => {
    // Navigate to check-in
    console.log("Check-in for reel:", reelId);
  };

  const handleReelTap = (reel: Reel) => {
    navigation.navigate("ReelDetails", { reelId: reel.id });
  };

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const renderReel = ({ item, index }: { item: Reel; index: number }) => (
    <ReelVideoCard
      reel={item}
      isVisible={index === currentIndex}
      isMuted={isMuted}
      isLiked={likedReels.has(item.id)}
      onToggleMute={toggleMute}
      onLike={() => handleLike(item.id)}
      onComment={() => handleComment(item.id)}
      onShare={() => handleShare(item.id)}
      onCheckIn={() => handleCheckIn(item.id)}
      onTap={() => handleReelTap(item)}
    />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index,
  });

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No reels available</Text>
      <Text style={styles.emptySubtext}>Check your connection</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading amazing reels...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          reels.length === 0 ? styles.emptyContainer : undefined
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    height: screenHeight,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
