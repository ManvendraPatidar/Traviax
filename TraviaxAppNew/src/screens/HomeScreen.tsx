import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import debounce from 'lodash.debounce';
import {apiService} from '../services/api';

interface HomeScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface TrendingPlace {
  id: string;
  name: string;
  country?: string;
  image?: string;
  description?: string;
  rating?: number;
}

interface ItinerarySummary {
  id: string;
  title: string;
  location: string;
  duration: string;
  dateRange?: string;
  heroImage?: string;
  rating?: number;
}

const DEFAULT_PLACE_RATING = 4.5;
const DEFAULT_REEL_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=900&fit=crop';
const DEFAULT_REEL_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces';

interface ReelCardData {
  id: string;
  title: string;
  location: string;
  thumbnail?: string;
  description?: string;
  tag?: string;
  durationLabel: string;
  source?: ApiReel;
}

interface ApiReel {
  id?: string;
  title?: string;
  description?: string;
  location?: string;
  city?: string;
  country?: string;
  thumbnail?: string;
  image?: string;
  media?: string[];
  tags?: string[];
  duration?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  creator?: {
    username?: string;
    avatar?: string;
  };
  user?: {
    username?: string;
    avatar?: string;
  };
}

const buildItemId = (value?: string | number) => {
  if (value === undefined || value === null || value === '') {
    return `generated-${Math.random().toString(36).slice(2)}`;
  }
  return String(value);
};

const getPrimaryImage = (item: any): string | undefined => {
  if (item?.image) {
    return item.image;
  }

  if (Array.isArray(item?.photos) && item.photos.length > 0) {
    return item.photos[0];
  }

  if (Array.isArray(item?.media) && item.media.length > 0) {
    return item.media[0];
  }

  return undefined;
};

const coerceNumber = (value: any, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapTrendingPlaceFromApi = (item: any): TrendingPlace => ({
  id: buildItemId(item?.id ?? item?.name ?? item?.title),
  name: item?.name ?? item?.title ?? 'Cinematic Getaway',
  country: item?.country ?? item?.location ?? item?.city ?? item?.region,
  image: getPrimaryImage(item),
  description: item?.description,
  rating: coerceNumber(item?.rating, DEFAULT_PLACE_RATING),
});

const mapTrendingPlaceFromSearch = (item: any): TrendingPlace => {
  const typePrefix = item?.type ?? 'result';
  const fallbackId = Math.random().toString(36).slice(2);
  const composedId = `${typePrefix}-${item?.id ?? fallbackId}`;
  const rawType = item?.type ? String(item.type) : undefined;
  const typeLabel = rawType
    ? `${rawType.charAt(0).toUpperCase()}${rawType.slice(1)}`
    : undefined;

  return {
    id: buildItemId(composedId),
    name: item?.title ?? item?.name ?? 'Discover More',
    country: item?.location ?? typeLabel,
    image: getPrimaryImage(item),
    description: item?.description,
    rating: coerceNumber(item?.rating, DEFAULT_PLACE_RATING),
  };
};

const mapItineraryFromApi = (item: any): ItinerarySummary => ({
  id: buildItemId(item?.id ?? item?.title),
  title: item?.title ?? 'Curated Journey',
  location: item?.location ?? 'Global Adventure',
  duration: item?.duration ?? '',
  dateRange: item?.dateRange,
  heroImage: item?.heroImage,
  rating: coerceNumber(item?.rating, DEFAULT_PLACE_RATING),
});

const formatDurationToLabel = (durationSeconds?: number | string): string => {
  const numericDuration = Number(durationSeconds);
  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    return '0:30';
  }
  const minutes = Math.floor(numericDuration / 60);
  const seconds = Math.floor(numericDuration % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const mapReelFromApi = (item: any): ReelCardData => {
  const tag =
    Array.isArray(item?.tags) && item.tags.length > 0
      ? String(item.tags[0]).toUpperCase()
      : undefined;

  return {
    id: buildItemId(item?.id ?? item?.title),
    title: item?.title ?? 'Travel Story',
    location:
      item?.location ??
      item?.city ??
      item?.country ??
      item?.description ??
      'Worldwide',
    thumbnail:
      item?.thumbnail ??
      getPrimaryImage(item) ??
      item?.image ??
      DEFAULT_REEL_IMAGE,
    description: item?.description,
    tag,
    durationLabel: formatDurationToLabel(item?.duration),
    source: item,
  };
};

const buildReelDetailsPayload = (card: ReelCardData) => {
  const raw = card.source ?? {};
  const creator = raw?.creator ?? raw?.user ?? {};
  const user = raw?.user ?? {
    username: creator?.username ?? 'traveler',
    avatar: creator?.avatar ?? DEFAULT_REEL_AVATAR,
  };

  return {
    id: raw?.id ?? card.id,
    title: card.title,
    description: raw?.description ?? card.description ?? card.location,
    image: raw?.thumbnail ?? card.thumbnail ?? DEFAULT_REEL_IMAGE,
    location: raw?.location ?? card.location,
    likes: raw?.likes ?? 0,
    comments: raw?.comments ?? 0,
    shares: raw?.shares ?? 0,
    isLiked: Boolean(raw?.isLiked),
    user,
  };
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPlaces, setTrendingPlaces] = useState<TrendingPlace[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TrendingPlace[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [itineraryLoading, setItineraryLoading] = useState(true);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [reels, setReels] = useState<ReelCardData[]>([]);
  const [reelLoading, setReelLoading] = useState(true);
  const [reelError, setReelError] = useState<string | null>(null);

  const loadTrendingPlaces = useCallback(async () => {
    try {
      setTrendingLoading(true);
      setTrendingError(null);
      const response = await apiService.getTrendingPlaces();
      setTrendingPlaces(response.map(mapTrendingPlaceFromApi));
    } catch (error) {
      console.error('Failed to load trending places:', error);
      setTrendingError('Unable to load trending places');
      setTrendingPlaces([]);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const loadItineraries = useCallback(async () => {
    try {
      setItineraryLoading(true);
      setItineraryError(null);
      const response = await apiService.getHomeItineraries(6);
      setItineraries(response.map(mapItineraryFromApi));
    } catch (error) {
      console.error('Failed to load itineraries:', error);
      setItineraryError('Unable to load itineraries');
      setItineraries([]);
    } finally {
      setItineraryLoading(false);
    }
  }, []);

  const loadReels = useCallback(async () => {
    try {
      setReelLoading(true);
      setReelError(null);
      const response = await apiService.getReels(6);
      const mappedReels = Array.isArray(response?.reels)
        ? response.reels.map(mapReelFromApi)
        : [];
      setReels(mappedReels);
    } catch (error) {
      console.error('Failed to load reels:', error);
      setReelError('Unable to load reels');
      setReels([]);
    } finally {
      setReelLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingPlaces();
    loadItineraries();
    loadReels();
  }, [loadTrendingPlaces, loadItineraries, loadReels]);

  const buildTrendingPlaceDetails = useCallback((place: TrendingPlace) => {
    const ratingValue = coerceNumber(place.rating, DEFAULT_PLACE_RATING);
    return {
      id: place.id,
      name: place.name,
      location: place.country ?? 'Worldwide',
      rating: ratingValue,
      reviews: Math.floor(Math.random() * 500) + 200,
      image: place.image,
      description:
        place.description ??
        `${place.name} - Experience cinematic travel moments around the globe.`,
      visitingHours: {
        daily: '9:00 AM - 8:00 PM',
        prime: '10:00 AM - 6:00 PM',
      },
      facts: [
        {
          icon: '🌟',
          text: `Rated ${ratingValue.toFixed(1)} stars by our community.`,
        },
        {
          icon: '📸',
          text: 'Perfect backdrop for cinematic travel storytelling.',
        },
      ],
      photos: place.image ? [place.image] : [],
    };
  }, []);

  const performSearch = useCallback(async (query: string) => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      const results = await apiService.searchExplore(query);
      setSearchResults(results.map(mapTrendingPlaceFromSearch));
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setSearchError('Unable to fetch search results');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        performSearch(value);
      }, 400),
    [performSearch],
  );

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      debouncedSearch.cancel();
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debouncedSearch(trimmed);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }
    debouncedSearch.cancel();
    performSearch(trimmed);
  }, [searchQuery, debouncedSearch, performSearch]);

  const handleOpenReel = useCallback(
    (card: ReelCardData) => {
      const payload = buildReelDetailsPayload(card);
      navigation?.navigate?.('ReelDetails', {
        reel: {
          ...payload,
          image: payload.image,
        },
      });
    },
    [navigation],
  );

  const isSearching = searchQuery.trim().length > 0;
  const displayTrending = isSearching ? searchResults : trendingPlaces;
  const displayTrendingLoading = isSearching ? searchLoading : trendingLoading;
  const displayTrendingError = isSearching ? searchError : trendingError;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>Traviax</Text>
          <Text style={styles.greeting}>Good morning, Alex</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>✨</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Plan a trip to Tokyo..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
      </View>

      {/* Ask TraviAI & Gift A Trip */}
      <View style={styles.section}>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Chat')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Ask TraviAI</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Gift')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Gift A Trip</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip Planner & Bookings */}
      <View style={styles.section}>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('PlanTrip')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Trip Planner</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation?.navigate('Booking')}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.quickAccessGradient}>
                <Text style={styles.quickAccessText}>Bookings</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* For You Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For You</Text>
          <View style={styles.sectionTabs}>
            <Text style={[styles.tab, styles.activeTab]}>Trending Reels</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reelsScroll}>
          {reelLoading ? (
            <>
              {/* Multiple skeleton loading cards */}
              {[1, 2, 3].map(index => (
                <View key={index} style={styles.reelSkeletonCard}>
                  <View style={styles.skeletonImageContainer}>
                    <LinearGradient
                      colors={['#2A2A2A', '#1A1A1A', '#2A2A2A']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={styles.skeletonGradient}
                    />
                    <View style={styles.skeletonOverlay}>
                      <View style={styles.skeletonTopSection}>
                        <View style={styles.skeletonTag} />
                        <View style={styles.skeletonDuration} />
                      </View>
                      <View style={styles.skeletonBottomSection}>
                        <View style={styles.skeletonAvatar} />
                        <View style={styles.skeletonTextContainer}>
                          <View style={styles.skeletonTitle} />
                          <View style={styles.skeletonLocation} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : reelError ? (
            <TouchableOpacity
              style={styles.reelPlaceholderCard}
              onPress={loadReels}>
              <Text style={styles.reelPlaceholderText}>{reelError}</Text>
              <Text style={styles.reelErrorText}>Tap to retry</Text>
            </TouchableOpacity>
          ) : reels.length === 0 ? (
            <View style={styles.reelPlaceholderCard}>
              <Text style={styles.reelPlaceholderText}>
                No reels available right now
              </Text>
            </View>
          ) : (
            reels.map((reel: ReelCardData) => (
              <TouchableOpacity
                key={reel.id}
                style={styles.reelCardLarge}
                activeOpacity={0.85}
                onPress={() => handleOpenReel(reel)}>
                <ImageBackground
                  source={{uri: reel.thumbnail ?? DEFAULT_REEL_IMAGE}}
                  style={styles.reelImageLarge}
                  imageStyle={styles.reelImageLargeRadius}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.85)']}
                    style={styles.reelOverlay}>
                    <View style={styles.reelTopRow}>
                      <Text style={styles.reelTag}>
                        {(reel.tag ?? 'TRENDING').toUpperCase()}
                      </Text>
                      <Text style={styles.reelDuration}>
                        {reel.durationLabel}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reelTitle}>{reel.title}</Text>
                      <Text style={styles.reelMeta}>{reel.location}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Trending Places */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Places</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.placesRow}>
          {displayTrendingLoading ? (
            <View style={styles.placeCard}>
              <View style={styles.centerContent}>
                <ActivityIndicator color="#FFD700" />
              </View>
            </View>
          ) : displayTrendingError ? (
            <TouchableOpacity
              style={styles.placeCard}
              onPress={() => {
                if (isSearching) {
                  handleSearchSubmit();
                } else {
                  loadTrendingPlaces();
                }
              }}>
              <View style={styles.centerContent}>
                <Text style={styles.placeText}>{displayTrendingError}</Text>
                <Text style={[styles.placeText, styles.retryText]}>
                  Tap to retry
                </Text>
              </View>
            </TouchableOpacity>
          ) : displayTrending.length === 0 ? (
            <View style={styles.placeCard}>
              <View style={styles.centerContent}>
                <Text style={styles.placeText}>
                  No places available right now
                </Text>
              </View>
            </View>
          ) : (
            displayTrending.map(place => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeCard}
                onPress={() =>
                  navigation?.navigate('PlaceDetails', {
                    place: buildTrendingPlaceDetails(place),
                  })
                }>
                <View style={styles.placeImage}>
                  {place.image ? (
                    <ImageBackground
                      source={{uri: place.image}}
                      style={styles.placeImageBackground}
                      imageStyle={styles.placeImageRadius}>
                      <View style={styles.placeImageOverlay} />
                    </ImageBackground>
                  ) : (
                    <View style={styles.placeImageFallback}>
                      <Text style={styles.placeEmoji}>🌍</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.placeText}>{place.name}</Text>
                {(place.country || place.description) && (
                  <Text style={[styles.placeText, styles.placeMetaText]}>
                    {place.country ?? place.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Best Trip Itinerary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Trip Itinerary</Text>
        <View style={styles.itineraryList}>
          {itineraryLoading ? (
            <View style={styles.itineraryItem}>
              <View style={styles.itineraryLoadingContainer}>
                <ActivityIndicator color="#FFD700" />
                <Text
                  style={[
                    styles.itinerarySubtitle,
                    styles.itineraryLoadingText,
                  ]}>
                  Loading itineraries...
                </Text>
              </View>
            </View>
          ) : itineraryError ? (
            <TouchableOpacity
              style={styles.itineraryItem}
              onPress={loadItineraries}>
              <View style={styles.itineraryImage}>
                <Text style={styles.itineraryEmoji}>🔄</Text>
              </View>
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryTitle}>{itineraryError}</Text>
                <Text
                  style={[styles.itinerarySubtitle, styles.itineraryRetryText]}>
                  Tap to retry
                </Text>
              </View>
            </TouchableOpacity>
          ) : itineraries.length === 0 ? (
            <View style={styles.itineraryItem}>
              <View style={styles.itineraryImage}>
                <Text style={styles.itineraryEmoji}>🧭</Text>
              </View>
              <View style={styles.itineraryInfo}>
                <Text style={styles.itineraryTitle}>
                  No itineraries available yet
                </Text>
                <Text
                  style={[
                    styles.itinerarySubtitle,
                    styles.itineraryEmptySubtitle,
                  ]}>
                  Check back soon for curated trips.
                </Text>
              </View>
            </View>
          ) : (
            itineraries.slice(0, 4).map(itinerary => {
              const ratingValue =
                typeof itinerary.rating === 'number'
                  ? itinerary.rating
                  : Number(itinerary.rating ?? 0);
              const ratingLabel = ratingValue ? ratingValue.toFixed(1) : '4.8';
              return (
                <TouchableOpacity
                  key={itinerary.id}
                  style={styles.itineraryItem}
                  onPress={() =>
                    navigation?.navigate('ItineraryDetails', {
                      itineraryId: itinerary.id,
                    })
                  }>
                  <View style={styles.itineraryImage}>
                    {itinerary.heroImage ? (
                      <ImageBackground
                        source={{uri: itinerary.heroImage}}
                        style={styles.itineraryHeroImage}
                        imageStyle={styles.itineraryHeroImageRadius}
                      />
                    ) : (
                      <Text style={styles.itineraryEmoji}>🧭</Text>
                    )}
                  </View>
                  <View style={styles.itineraryInfo}>
                    <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                    <Text style={styles.itinerarySubtitle}>
                      {itinerary.duration}
                      {itinerary.location
                        ? ` in ${itinerary.location.split(',')[0]}`
                        : ''}
                    </Text>
                    <View style={styles.itineraryRatingContainer}>
                      <Text style={styles.itineraryRating}>
                        {`⭐ ${ratingLabel}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  tripPlannerCard: {
    backgroundColor: '#2A4A6B',
  },
  bookingsCard: {
    backgroundColor: '#4A6B4A',
  },
  cardIcon: {
    alignSelf: 'flex-start',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionTabs: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    color: '#666666',
    fontSize: 14,
  },
  activeTab: {
    color: '#FFD700',
    fontWeight: '600',
  },
  reelsScroll: {
    gap: 16,
    paddingHorizontal: 4,
  },
  reelCardLarge: {
    width: 180,
    height: 260,
    borderRadius: 18,
    marginRight: 16,
    overflow: 'hidden',
  },
  reelPlaceholderCard: {
    width: 180,
    height: 260,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reelPlaceholderText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 12,
  },
  // Skeleton loading styles
  reelSkeletonCard: {
    width: 180,
    height: 260,
    borderRadius: 18,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  skeletonImageContainer: {
    flex: 1,
    position: 'relative',
  },
  skeletonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  skeletonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  skeletonTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  skeletonTag: {
    width: 60,
    height: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
  },
  skeletonDuration: {
    width: 40,
    height: 16,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  skeletonBottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    marginRight: 12,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonTitle: {
    width: '80%',
    height: 14,
    backgroundColor: '#333333',
    borderRadius: 7,
    marginBottom: 6,
  },
  skeletonLocation: {
    width: '60%',
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
  },
  loadingIndicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  reelErrorText: {
    color: '#FFD700',
    marginTop: 6,
  },
  reelImageLarge: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  reelImageLargeRadius: {
    borderRadius: 18,
  },
  reelOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  reelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reelTag: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  reelDuration: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  reelMeta: {
    color: '#B5B5B5',
    fontSize: 13,
  },
  placesRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  placeCard: {
    width: 120,
    alignItems: 'center',
    marginRight: 12,
  },
  placeImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  placeImageBackground: {
    width: '100%',
    height: '100%',
  },
  placeImageRadius: {
    borderRadius: 12,
  },
  placeImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
  },
  placeImageFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  placeEmoji: {
    fontSize: 24,
  },
  placeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  placeMetaText: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  retryText: {
    color: '#FFD700',
    marginTop: 4,
  },
  itineraryList: {
    gap: 12,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  itineraryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itineraryEmoji: {
    fontSize: 20,
  },
  itineraryInfo: {
    flex: 1,
  },
  itineraryTitle: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  itinerarySubtitle: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
  },
  itineraryEmptySubtitle: {
    color: '#AAAAAA',
  },
  itineraryRating: {
    color: '#FFD700',
    fontSize: 12,
  },
  itineraryLoadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  itineraryLoadingText: {
    marginLeft: 8,
  },
  itineraryRetryText: {
    color: '#FFD700',
  },
  itineraryHeroImage: {
    width: '100%',
    height: '100%',
  },
  itineraryHeroImageRadius: {
    borderRadius: 8,
  },
  itineraryRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Hero section styles
  heroImage: {
    height: 120,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: 12,
  },
  heroGradient: {
    padding: 16,
    borderRadius: 12,
  },
  // Quick access card styles
  quickAccessCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickAccessImage: {
    height: 100,
    justifyContent: 'flex-end',
  },
  quickAccessImageStyle: {
    borderRadius: 12,
  },
  quickAccessGradient: {
    padding: 12,
    borderRadius: 12,
  },
  quickAccessText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
