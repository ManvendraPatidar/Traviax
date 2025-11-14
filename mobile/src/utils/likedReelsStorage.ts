import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKED_REELS_KEY = 'likedReels';

export const likedReelsStorage = {
  async getLikedReels(): Promise<string[]> {
    try {
      const likedReels = await AsyncStorage.getItem(LIKED_REELS_KEY);
      return likedReels ? JSON.parse(likedReels) : [];
    } catch (error) {
      console.error('Error getting liked reels:', error);
      return [];
    }
  },

  async saveLikedReels(likedReels: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(LIKED_REELS_KEY, JSON.stringify(likedReels));
    } catch (error) {
      console.error('Error saving liked reels:', error);
    }
  },

  async addLikedReel(reelId: string): Promise<void> {
    try {
      const currentLiked = await this.getLikedReels();
      if (!currentLiked.includes(reelId)) {
        const updatedLiked = [...currentLiked, reelId];
        await this.saveLikedReels(updatedLiked);
      }
    } catch (error) {
      console.error('Error adding liked reel:', error);
    }
  },

  async removeLikedReel(reelId: string): Promise<void> {
    try {
      const currentLiked = await this.getLikedReels();
      const updatedLiked = currentLiked.filter(id => id !== reelId);
      await this.saveLikedReels(updatedLiked);
    } catch (error) {
      console.error('Error removing liked reel:', error);
    }
  },

  async isReelLiked(reelId: string): Promise<boolean> {
    try {
      const likedReels = await this.getLikedReels();
      return likedReels.includes(reelId);
    } catch (error) {
      console.error('Error checking if reel is liked:', error);
      return false;
    }
  },

  async clearLikedReels(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LIKED_REELS_KEY);
    } catch (error) {
      console.error('Error clearing liked reels:', error);
    }
  }
};