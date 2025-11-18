import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import BackButton from '../components/BackButton';

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
  price: number;
  date: string;
  amenities: string[];
};

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const mode: SearchMode = route?.params?.mode ?? 'flights';
  const initialQuery = route?.params?.query ?? '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);

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

  const hotels = useMemo(
    (): HotelItem[] => [
      {
        id: 'HT001',
        name: 'The Ritz-Carlton Tokyo',
        location: 'Roppongi, Tokyo',
        rating: 4.9,
        price: 450,
        date: 'Dec 15 - 22, 2024',
        amenities: ['WiFi', 'Pool', 'Spa'],
      },
      {
        id: 'HT002',
        name: 'Park Hyatt Tokyo',
        location: 'Shinjuku, Tokyo',
        rating: 4.8,
        price: 380,
        date: 'Dec 15 - 22, 2024',
        amenities: ['WiFi', 'Gym', 'Restaurant'],
      },
      {
        id: 'HT003',
        name: 'Aman Tokyo',
        location: 'Otemachi, Tokyo',
        rating: 5,
        price: 520,
        date: 'Dec 15 - 22, 2024',
        amenities: ['WiFi', 'Spa', 'Pool'],
      },
    ],
    [],
  );

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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.primaryText}>{item.airline}</Text>
        <Text style={styles.priceText}>${item.price}</Text>
      </View>
      <Text style={styles.metaText}>{item.date}</Text>
      <View style={styles.timeline}>
        <View>
          <Text style={styles.timelineTime}>{item.departure}</Text>
          <Text style={styles.timelineLabel}>{item.from}</Text>
        </View>
        <View style={styles.timelineConnector}>
          <Text style={styles.durationText}>{item.duration}</Text>
          <View style={styles.connectorLine} />
        </View>
        <View>
          <Text style={styles.timelineTime}>{item.arrival}</Text>
          <Text style={styles.timelineLabel}>{item.to}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Flight {item.flightNumber}</Text>
        <Text style={styles.metaText}>
          {item.stops === 0 ? 'Direct' : `${item.stops} stop`}
        </Text>
      </View>
    </View>
  );

  const renderHotel = ({item}: {item: HotelItem}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.primaryText}>{item.name}</Text>
        <Text style={styles.priceText}>${item.price}/night</Text>
      </View>
      <Text style={styles.metaText}>{item.location}</Text>
      <Text style={styles.metaText}>{item.date}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>⭐ {item.rating.toFixed(1)}</Text>
        <Text style={styles.metaText}>{item.amenities.join(' • ')}</Text>
      </View>
    </View>
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
        <FlatList<HotelItem>
          data={filteredHotels}
          keyExtractor={item => item.id}
          renderItem={renderHotel}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#222',
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
    backgroundColor: '#101010',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  priceText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
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
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  timelineTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timelineLabel: {
    color: '#999',
    fontSize: 12,
  },
  timelineConnector: {
    flex: 1,
    alignItems: 'center',
  },
  durationText: {
    color: '#ffd700',
    fontSize: 12,
    marginBottom: 4,
  },
  connectorLine: {
    height: 2,
    backgroundColor: '#ffd700',
    width: '100%',
    borderRadius: 1,
  },
});

export default SearchResultsScreen;
