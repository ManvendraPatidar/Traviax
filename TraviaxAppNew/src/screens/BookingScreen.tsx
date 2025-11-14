import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface BookingScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface SearchParams {
  type: 'flights' | 'hotels';
  origin: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  travelers: number;
  rooms: number;
}

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
}

interface HotelResult {
  id: string;
  name: string;
  rating: number;
  image: string;
  location: string;
  price: number;
  amenities: string[];
}

const BookingScreen: React.FC<BookingScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [showResults, setShowResults] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    type: 'flights',
    origin: '',
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: 1,
    rooms: 1,
  });

  // Sample flight data (Amadeus-style)
  const sampleFlights: FlightResult[] = [
    {
      id: 'FL001',
      airline: 'Emirates',
      flightNumber: 'EK 248',
      departure: '14:30',
      arrival: '22:45',
      duration: '8h 15m',
      price: 1250,
      stops: 0,
    },
    {
      id: 'FL002',
      airline: 'Qatar Airways',
      flightNumber: 'QR 362',
      departure: '09:15',
      arrival: '18:30',
      duration: '9h 15m',
      price: 1180,
      stops: 1,
    },
    {
      id: 'FL003',
      airline: 'Lufthansa',
      flightNumber: 'LH 714',
      departure: '16:45',
      arrival: '06:20+1',
      duration: '13h 35m',
      price: 980,
      stops: 1,
    },
  ];

  // Sample hotel data
  const sampleHotels: HotelResult[] = [
    {
      id: 'HT001',
      name: 'The Ritz-Carlton Tokyo',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      location: 'Roppongi, Tokyo',
      price: 450,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    },
    {
      id: 'HT002',
      name: 'Park Hyatt Tokyo',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      location: 'Shinjuku, Tokyo',
      price: 380,
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar'],
    },
    {
      id: 'HT003',
      name: 'Aman Tokyo',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      location: 'Otemachi, Tokyo',
      price: 520,
      amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant'],
    },
  ];

  const handleSearch = () => {
    setShowResults(true);
    setShowConfirmation(false);
  };

  const handleBooking = (item: any) => {
    setSelectedBooking(item);
    setShowConfirmation(true);
    setShowResults(false);
  };

  const renderSearchForm = () => (
    <View style={styles.searchForm}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        style={styles.heroSection}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Text style={styles.heroTitle}>Find Your Perfect Trip</Text>
        <Text style={styles.heroSubtitle}>
          {activeTab === 'flights'
            ? 'Search thousands of flights'
            : 'Discover amazing hotels'}
        </Text>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flights' && styles.activeTab]}
          onPress={() => setActiveTab('flights')}>
          <LinearGradient
            colors={
              activeTab === 'flights'
                ? ['#FFD700', '#FFA500']
                : ['transparent', 'transparent']
            }
            style={styles.tabGradient}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'flights' && styles.activeTabText,
              ]}>
              ✈️ Flights
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hotels' && styles.activeTab]}
          onPress={() => setActiveTab('hotels')}>
          <LinearGradient
            colors={
              activeTab === 'hotels'
                ? ['#FFD700', '#FFA500']
                : ['transparent', 'transparent']
            }
            style={styles.tabGradient}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'hotels' && styles.activeTabText,
              ]}>
              🏨 Hotels
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Fields */}
      <View style={styles.searchFields}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {activeTab === 'flights' ? 'From' : 'Destination'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={
                activeTab === 'flights' ? 'New York (NYC)' : 'Tokyo, Japan'
              }
              placeholderTextColor="#666666"
              value={searchParams.origin}
              onChangeText={text =>
                setSearchParams({...searchParams, origin: text})
              }
            />
          </View>
          {activeTab === 'flights' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>To</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tokyo (NRT)"
                placeholderTextColor="#666666"
                value={searchParams.destination}
                onChangeText={text =>
                  setSearchParams({...searchParams, destination: text})
                }
              />
            </View>
          )}
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Check-in</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Dec 15, 2024"
              placeholderTextColor="#666666"
              value={searchParams.checkIn}
              onChangeText={text =>
                setSearchParams({...searchParams, checkIn: text})
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Check-out</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Dec 22, 2024"
              placeholderTextColor="#666666"
              value={searchParams.checkOut}
              onChangeText={text =>
                setSearchParams({...searchParams, checkOut: text})
              }
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Travelers</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  setSearchParams({
                    ...searchParams,
                    travelers: Math.max(1, searchParams.travelers - 1),
                  })
                }>
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{searchParams.travelers}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  setSearchParams({
                    ...searchParams,
                    travelers: searchParams.travelers + 1,
                  })
                }>
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {activeTab === 'hotels' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rooms</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() =>
                    setSearchParams({
                      ...searchParams,
                      rooms: Math.max(1, searchParams.rooms - 1),
                    })
                  }>
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterText}>{searchParams.rooms}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() =>
                    setSearchParams({
                      ...searchParams,
                      rooms: searchParams.rooms + 1,
                    })
                  }>
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Search Button */}
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        style={styles.searchButton}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <TouchableOpacity
          style={styles.searchButtonInner}
          onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍 Search {activeTab}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderFlightResults = () => (
    <View style={styles.resultsContainer}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.resultsTitleContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text style={styles.resultsTitle}>✈️ Available Flights</Text>
      </LinearGradient>
      {sampleFlights.map(flight => (
        <TouchableOpacity
          key={flight.id}
          style={styles.resultCard}
          onPress={() => handleBooking(flight)}>
          <LinearGradient
            colors={['#1A1A1A', '#2A2A2A']}
            style={styles.cardGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.flightHeader}>
              <Text style={styles.airline}>{flight.airline}</Text>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.priceContainer}>
                <Text style={styles.price}>${flight.price}</Text>
              </LinearGradient>
            </View>
            <View style={styles.flightDetails}>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{flight.departure}</Text>
                <View style={styles.durationContainer}>
                  <Text style={styles.duration}>{flight.duration}</Text>
                  <View style={styles.flightPath} />
                </View>
                <Text style={styles.time}>{flight.arrival}</Text>
              </View>
              <Text style={styles.flightNumber}>
                Flight {flight.flightNumber}
              </Text>
              <Text style={styles.stops}>
                {flight.stops === 0
                  ? '🎯 Direct'
                  : `🔄 ${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHotelResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Available Hotels</Text>
      {sampleHotels.map(hotel => (
        <TouchableOpacity
          key={hotel.id}
          style={styles.resultCard}
          onPress={() => handleBooking(hotel)}>
          <Image source={{uri: hotel.image}} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <View style={styles.hotelHeader}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.price}>${hotel.price}/night</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{'⭐'.repeat(hotel.rating)}</Text>
              <Text style={styles.location}>{hotel.location}</Text>
            </View>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <Text key={index} style={styles.amenity}>
                  {amenity}
                </Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfirmation = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.confirmationCard}>
        <Text style={styles.confirmationTitle}>Booking Confirmed! 🎉</Text>
        <Text style={styles.referenceNumber}>
          Reference: TRV{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Text>

        {selectedBooking && (
          <View style={styles.bookingDetails}>
            <Text style={styles.bookingTitle}>
              {selectedBooking.airline || selectedBooking.name}
            </Text>
            <Text style={styles.bookingPrice}>
              Total: ${selectedBooking.price}
            </Text>
            <Text style={styles.bookingInfo}>
              A confirmation email has been sent to your registered email
              address.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            setShowConfirmation(false);
            setShowResults(false);
            setSelectedBooking(null);
          }}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showResults && !showConfirmation && renderSearchForm()}
        {showResults && !showConfirmation && (
          <>
            <TouchableOpacity
              style={styles.newSearchButton}
              onPress={() => setShowResults(false)}>
              <Text style={styles.newSearchText}>← New Search</Text>
            </TouchableOpacity>
            {activeTab === 'flights'
              ? renderFlightResults()
              : renderHotelResults()}
          </>
        )}
        {showConfirmation && renderConfirmation()}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 18,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 30,
  },
  heroSection: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchForm: {
    paddingVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 5,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeTab: {
    elevation: 3,
  },
  tabGradient: {
    flex: 1,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  searchFields: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    borderRadius: 15,
    marginTop: 20,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  searchButtonInner: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  searchButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  newSearchButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  newSearchText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  resultsTitleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  resultCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    borderRadius: 16,
  },
  priceContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  flightPath: {
    height: 2,
    backgroundColor: '#FFD700',
    width: '80%',
    marginTop: 4,
    borderRadius: 1,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  airline: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  flightDetails: {
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    color: '#999999',
    fontSize: 14,
  },
  flightNumber: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  stops: {
    color: '#999999',
    fontSize: 14,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  hotelInfo: {
    gap: 8,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 14,
  },
  location: {
    color: '#999999',
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  confirmationCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  confirmationTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  referenceNumber: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  bookingDetails: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bookingTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  bookingPrice: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookingInfo: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  doneButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
