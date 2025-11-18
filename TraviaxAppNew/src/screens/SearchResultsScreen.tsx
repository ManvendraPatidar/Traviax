import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import BackButton from '../components/BackButton';
import {apiService} from '../services/api';

type SearchMode = 'flights' | 'hotels';

interface SearchResultsScreenProps {
  navigation: {
    goBack: () => void;
  };
  route?: {
    params?: {
      mode: SearchMode;
      query?: string;
    };
  };
}

type FlightItem = {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  flightNumber: string;
  stops: number;
  date: string;
};

type HotelItem = {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: string;
  image: string;
  description: string;
  reviews?: number;
  visitingHours?: {
    daily: string;
    prime: string;
  };
  facts?: Array<{
    icon: string;
    text: string;
  }>;
};

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const mode: SearchMode = route?.params?.mode ?? 'flights';
  const initialQuery = route?.params?.query ?? '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  const flights = useMemo(
    (): FlightItem[] => [
      {
        id: 'FL001',
        airline: 'Emirates',
        from: 'NYC',
        to: 'NRT',
        departure: '14:30',
        arrival: '22:45',
        duration: '8h 15m',
        price: 1250,
        flightNumber: 'EK 248',
        stops: 0,
        date: 'Dec 15, 2024',
      },
      {
        id: 'FL002',
        airline: 'Qatar Airways',
        from: 'NYC',
        to: 'NRT',
        departure: '09:15',
        arrival: '18:30',
        duration: '9h 15m',
        price: 1180,
        flightNumber: 'QR 362',
        stops: 1,
        date: 'Dec 15, 2024',
      },
      {
        id: 'FL003',
        airline: 'Lufthansa',
        from: 'NYC',
        to: 'NRT',
        departure: '16:45',
        arrival: '06:20+1',
        duration: '13h 35m',
        price: 980,
        flightNumber: 'LH 714',
        stops: 1,
        date: 'Dec 15, 2024',
      },
    ],
    [],
  );

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      if (mode === 'hotels') {
        setIsLoadingHotels(true);
        try {
          const hotelData = await apiService.getHotels();
          setHotels(hotelData);
        } catch (error) {
          console.error('Failed to fetch hotels:', error);
          // Fallback to empty array if API fails
          setHotels([]);
        } finally {
          setIsLoadingHotels(false);
        }
      }
    };

    fetchHotels();
  }, [mode]);

  const filteredFlights = useMemo(() => {
    if (!searchTerm.trim()) {
      return flights;
    }
    const lowered = searchTerm.toLowerCase();
    return flights.filter(
      flight =>
        flight.airline.toLowerCase().includes(lowered) ||
        flight.to.toLowerCase().includes(lowered) ||
        flight.from.toLowerCase().includes(lowered),
    );
  }, [flights, searchTerm]);

  const filteredHotels = useMemo(() => {
    if (!searchTerm.trim()) {
      return hotels;
    }
    const lowered = searchTerm.toLowerCase();
    return hotels.filter(
      hotel =>
        hotel.name.toLowerCase().includes(lowered) ||
        hotel.location.toLowerCase().includes(lowered),
    );
  }, [hotels, searchTerm]);

  const renderFlight = ({item}: {item: FlightItem}) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.airlineSection}>
          <Text style={styles.primaryText}>{item.airline}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>

      <View style={styles.flightDetails}>
        <View style={styles.timeSection}>
          <Text style={styles.timelineTime}>{item.departure}</Text>
          <Text style={styles.timelineLabel}>{item.from}</Text>
        </View>

        <View style={styles.timelineConnector}>
          <Text style={styles.durationText}>{item.duration}</Text>
          <View style={styles.connectorLine} />
          <View style={styles.connectorDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timelineTime}>{item.arrival}</Text>
          <Text style={styles.timelineLabel}>{item.to}</Text>
        </View>
      </View>

      <View style={styles.flightMeta}>
        <View style={styles.flightInfo}>
          <Text style={styles.flightNumber}>Flight {item.flightNumber}</Text>
          <View style={styles.stopsBadge}>
            <Text style={styles.stopsText}>
              {item.stops === 0 ? 'Direct' : `${item.stops} stop`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHotel = ({item}: {item: HotelItem}) => (
    <TouchableOpacity style={styles.hotelCard} activeOpacity={0.8}>
      <Image source={{uri: item.image}} style={styles.hotelImage} />

      <View style={styles.hotelContent}>
        <View style={styles.hotelHeader}>
          <View style={styles.hotelTitleSection}>
            <Text style={styles.hotelName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.hotelLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.hotelPriceSection}>
            <Text style={styles.hotelPrice}>{item.price}</Text>
          </View>
        </View>

        <Text style={styles.hotelDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.hotelFooter}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
            {item.reviews && (
              <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
            )}
          </View>

          {item.facts && item.facts.length > 0 && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.amenityItem} numberOfLines={1}>
                {item.facts[0].icon} {item.facts[0].text}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={navigation.goBack} style={styles.backButton} />
        <Text style={styles.headerTitle}>
          {mode === 'flights' ? 'Search Flights' : 'Search Stays'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search again"
          placeholderTextColor="#767676"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {mode === 'flights' ? (
        <FlatList<FlightItem>
          data={filteredFlights}
          keyExtractor={item => item.id}
          renderItem={renderFlight}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <>
          {isLoadingHotels ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Finding amazing hotels...</Text>
            </View>
          ) : (
            <FlatList<HotelItem>
              data={filteredHotels}
              keyExtractor={item => item.id}
              renderItem={renderHotel}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No hotels found</Text>
                  <Text style={styles.emptySubText}>
                    Try adjusting your search terms
                  </Text>
                </View>
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  clearIcon: {
    color: '#999',
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 60,
    gap: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  airlineSection: {
    flex: 1,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '800',
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  timeSection: {
    alignItems: 'center',
    minWidth: 60,
  },
  timelineTime: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  timelineLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '600',
  },
  timelineConnector: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
    position: 'relative',
  },
  durationText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  connectorLine: {
    height: 3,
    backgroundColor: '#FFD700',
    width: '100%',
    borderRadius: 2,
  },
  connectorDots: {
    flexDirection: 'row',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -8}, {translateY: -2}],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
  },
  flightMeta: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 12,
  },
  flightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightNumber: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  stopsBadge: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stopsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    color: '#a1a1a1',
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  // Hotel card styles
  hotelCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelContent: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hotelTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  hotelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  hotelLocation: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  hotelPriceSection: {
    alignItems: 'flex-end',
  },
  hotelPrice: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '800',
  },
  hotelDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  reviewsText: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '500',
  },
  amenitiesSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  amenityItem: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '500',
  },
  // Loading and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;
