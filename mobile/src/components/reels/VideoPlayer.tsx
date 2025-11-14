import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { theme } from '@/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  isVisible: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onVideoLoad?: () => void;
  onVideoError?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = memo(({
  videoUrl,
  thumbnail,
  isVisible,
  isMuted,
  onToggleMute,
  onVideoLoad,
  onVideoError,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const controlsOpacity = useSharedValue(0);
  const progressValue = useSharedValue(0);

  // Auto-play/pause based on visibility
  useEffect(() => {
    console.log('VideoPlayer visibility changed:', { isVisible, videoUrl, thumbnail });
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
        // Reset thumbnail when video becomes invisible
        setShowThumbnail(true);
      }
    }
  }, [isVisible, videoUrl, thumbnail]);

  // Update progress
  useEffect(() => {
    if (duration > 0) {
      progressValue.value = withTiming(position / duration, { duration: 100 });
    }
  }, [position, duration]);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      // Hide thumbnail when video starts playing
      if (status.isPlaying && showThumbnail) {
        setShowThumbnail(false);
      }
      
      if (onVideoLoad) {
        onVideoLoad();
      }

      // Loop video when it ends
      if (status.didJustFinish) {
        videoRef.current?.replayAsync();
      }
    } else {
      setIsLoading(false);
      if (onVideoError) {
        onVideoError();
      }
    }
  }, [videoUrl, showThumbnail, onVideoLoad, onVideoError]);

  const togglePlayPause = useCallback(async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  }, [isPlaying]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    controlsOpacity.value = withTiming(1, { duration: 200 });
    
    setTimeout(() => {
      controlsOpacity.value = withTiming(0, { duration: 500 });
      setTimeout(() => setShowControls(false), 500);
    }, 2000);
  };

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressValue.value, [0, 1], [0, 100])}%`,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={showControlsTemporarily}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isVisible}
          isLooping
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* Thumbnail overlay */}
        {showThumbnail && (
          <View style={styles.thumbnailOverlay}>
            <Image 
              source={{ uri: thumbnail }} 
              style={styles.thumbnailImage}
            />
            <View style={styles.playButtonOverlay}>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={32} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Loading overlay */}
        {isLoading && !showThumbnail && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner}>
              <Ionicons name="refresh" size={24} color={theme.colors.text} />
            </View>
          </View>
        )}

        {/* Controls overlay */}
        {showControls && (
          <Animated.View style={[styles.controlsOverlay, controlsAnimatedStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'transparent']}
              style={styles.controlsGradient}
            />
            
            {/* Play/Pause button */}
            <TouchableOpacity 
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>

            {/* Mute button */}
            <TouchableOpacity 
              style={styles.muteButton}
              onPress={onToggleMute}
            >
              <Ionicons 
                name={isMuted ? "volume-mute" : "volume-high"} 
                size={20} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: theme.colors.background,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingSpinner: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: theme.spacing.borderRadius.full,
    padding: theme.spacing.md,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playPauseButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.spacing.borderRadius.full,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  muteButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.spacing.borderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 1,
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.spacing.borderRadius.full,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
});

export default VideoPlayer;
