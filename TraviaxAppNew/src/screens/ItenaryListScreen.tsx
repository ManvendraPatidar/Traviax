import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {apiService} from '../services/api';
import {ItineraryOption, mapItineraryOptionFromApi} from '../types/itinerary';

interface ItenaryListScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      selectedItineraryId?: string;
      onSelect?: (item: ItineraryOption) => void;
    };
  };
}

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop';

const ItenaryListScreen: React.FC<ItenaryListScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<ItineraryOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    route?.params?.selectedItineraryId,
  );

  useEffect(() => {
    if (route?.params?.selectedItineraryId) {
      setSelectedId(route.params.selectedItineraryId);
    }
  }, [route?.params?.selectedItineraryId]);

  const loadItineraries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getHomeItineraries(20);
      setItineraries(response.map(mapItineraryOptionFromApi));
    } catch (e) {
      console.error('Failed to load itineraries', e);
      setError('Unable to load itineraries');
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  const handleSelect = useCallback(
    (item: ItineraryOption) => {
      setSelectedId(item.id);
      const onSelect = route?.params?.onSelect;
      if (typeof onSelect === 'function') {
        onSelect(item);
      }
      navigation.navigate('Gift', {selectedItinerary: item});
    },
    [navigation, route?.params?.onSelect],
  );

  const handleViewDetails = useCallback(
    (item: ItineraryOption) => {
      navigation.navigate('ItineraryDetails', {itineraryId: item.id});
    },
    [navigation],
  );

  const handleClose = useCallback(() => {
    navigation.navigate('Gift');
  }, [navigation]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator color="#FFD700" />
          <Text style={styles.statusText}>Loading itineraries...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadItineraries}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (itineraries.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>No itineraries available yet.</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {itineraries.map(item => {
          const ratingLabel = item.rating ? item.rating.toFixed(1) : undefined;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={[
                styles.card,
                selectedId === item.id && styles.cardSelected,
              ]}
              onPress={() => handleSelect(item)}>
              <ImageBackground
                source={{uri: item.heroImage ?? DEFAULT_HERO_IMAGE}}
                style={styles.cardImage}
                imageStyle={styles.cardImageRadius}>
                <View style={styles.imageOverlay}>
                  {ratingLabel && (
                    <View style={styles.ratingChip}>
                      <Text
                        style={styles.ratingText}>{`⭐ ${ratingLabel}`}</Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.location ?? 'Anywhere'}
                  {item.duration ? ` • ${item.duration}` : ''}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.priceText}>
                    {item.priceDisplay ?? 'Price on request'}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleViewDetails(item)}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }, [
    error,
    handleSelect,
    handleViewDetails,
    itineraries,
    loadItineraries,
    loading,
    selectedId,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Text style={styles.backIcon}>×</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Select Itinerary</Text>
          <Text style={styles.headerSubtitle}>
            Choose a package to gift this experience
          </Text>
        </View>
      </View>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#999999',
    fontSize: 13,
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  statusText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  retryButtonText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollArea: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: '#FFD700',
  },
  cardImage: {
    height: 150,
    justifyContent: 'flex-end',
  },
  cardImageRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  ratingChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 13,
  },
  cardInfo: {
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ItenaryListScreen;
