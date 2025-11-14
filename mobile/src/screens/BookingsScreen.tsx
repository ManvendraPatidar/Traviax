import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { apiService } from '@/services/api';
import { theme } from '@/theme';

interface BookingResult {
  id: string;
  type: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  provider: string;
  details: any;
}

export const BookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [bookingType, setBookingType] = useState<'flight' | 'hotel'>('flight');
  const [searchResults, setSearchResults] = useState<BookingResult[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search form state
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadUserBookings();
    }
  }, [activeTab]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      const bookings = await apiService.getUserBookings();
      setUserBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const searchData = {
        type: bookingType,
        from_location: fromLocation,
        to_location: toLocation,
        checkin_date: checkinDate ? new Date(checkinDate).toISOString() : undefined,
        checkout_date: checkoutDate ? new Date(checkoutDate).toISOString() : undefined,
        passengers: parseInt(passengers),
        rooms: 1,
      };

      const results = await apiService.searchBookings(searchData);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching bookings:', error);
      Alert.alert('Error', 'Failed to search bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (result: BookingResult) => {
    try {
      const confirmation = await apiService.confirmBooking({
        type: result.type,
        details: result.details,
      });
      
      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your booking reference is: ${confirmation.reference}`,
        [{ text: 'OK', onPress: () => setActiveTab('bookings') }]
      );
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Error', 'Failed to confirm booking');
    }
  };

  const renderSearchForm = () => (
    <Card style={styles.formCard}>
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, bookingType === 'flight' && styles.activeType]}
          onPress={() => setBookingType('flight')}
        >
          <Ionicons name="airplane" size={20} color={bookingType === 'flight' ? theme.colors.primary : theme.colors.text} />
          <Text style={[styles.typeText, bookingType === 'flight' && styles.activeTypeText]}>
            Flights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, bookingType === 'hotel' && styles.activeType]}
          onPress={() => setBookingType('hotel')}
        >
          <Ionicons name="bed" size={20} color={bookingType === 'hotel' ? theme.colors.primary : theme.colors.text} />
          <Text style={[styles.typeText, bookingType === 'hotel' && styles.activeTypeText]}>
            Hotels
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Departure city"
          placeholderTextColor={theme.colors.textMuted}
          value={fromLocation}
          onChangeText={setFromLocation}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Destination city"
          placeholderTextColor={theme.colors.textMuted}
          value={toLocation}
          onChangeText={setToLocation}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>
            {bookingType === 'flight' ? 'Departure' : 'Check-in'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textMuted}
            value={checkinDate}
            onChangeText={setCheckinDate}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>
            {bookingType === 'flight' ? 'Return' : 'Check-out'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textMuted}
            value={checkoutDate}
            onChangeText={setCheckoutDate}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {bookingType === 'flight' ? 'Passengers' : 'Guests'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          placeholderTextColor={theme.colors.textMuted}
          value={passengers}
          onChangeText={setPassengers}
          keyboardType="numeric"
        />
      </View>

      <Button
        title="Search"
        onPress={handleSearch}
        loading={loading}
        style={styles.searchButton}
      />
    </Card>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.sectionTitle}>Search Results</Text>
      {searchResults.map((result) => (
        <Card key={result.id} style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>{result.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${result.price}</Text>
              <Text style={styles.currency}>{result.currency}</Text>
            </View>
          </View>
          <Text style={styles.resultDescription}>{result.description}</Text>
          <Text style={styles.provider}>by {result.provider}</Text>
          <Button
            title="Book Now"
            onPress={() => handleBooking(result)}
            size="small"
            style={styles.bookButton}
          />
        </Card>
      ))}
    </View>
  );

  const renderUserBookings = () => (
    <View style={styles.bookingsContainer}>
      <Text style={styles.sectionTitle}>My Bookings</Text>
      {userBookings.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="airplane-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Start planning your next adventure!</Text>
        </Card>
      ) : (
        userBookings.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingType}>
                <Ionicons 
                  name={booking.type === 'flight' ? 'airplane' : 'bed'} 
                  size={20} 
                  color={theme.colors.accent} 
                />
                <Text style={styles.bookingTypeText}>
                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
            <Text style={styles.bookingReference}>Ref: {booking.reference}</Text>
            <Text style={styles.bookingDate}>
              Booked: {new Date(booking.created_at).toLocaleDateString()}
            </Text>
          </Card>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
            onPress={() => setActiveTab('bookings')}
          >
            <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
              My Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'search' ? (
          <>
            {renderSearchForm()}
            {searchResults.length > 0 && renderSearchResults()}
          </>
        ) : (
          renderUserBookings()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.spacing.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.accent,
  },
  tabText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    gap: theme.spacing.sm,
  },
  activeType: {
    backgroundColor: theme.colors.accent,
  },
  typeText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activeTypeText: {
    color: theme.colors.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  searchButton: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  resultsContainer: {
    marginBottom: theme.spacing.lg,
  },
  resultCard: {
    marginBottom: theme.spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  resultTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
  },
  currency: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  resultDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  provider: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  bookButton: {
    alignSelf: 'flex-start',
  },
  bookingsContainer: {
    marginBottom: theme.spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bookingCard: {
    marginBottom: theme.spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bookingType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bookingTypeText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  bookingReference: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  bookingDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
