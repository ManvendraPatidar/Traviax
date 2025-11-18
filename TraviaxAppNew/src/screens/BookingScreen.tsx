import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';

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

const BookingScreen: React.FC<BookingScreenProps> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'checkIn' | 'checkOut'>(
    'checkIn',
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [searchParams, setSearchParams] = useState<SearchParams>({
    type: 'flights',
    origin: '',
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: 1,
    rooms: 1,
  });

  const handleSearch = () => {
    navigation.navigate('SearchResults', {
      mode: activeTab,
      query:
        activeTab === 'flights'
          ? searchParams.destination || searchParams.origin
          : searchParams.destination,
    });
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const openPicker = (mode: 'checkIn' | 'checkOut') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
    if (mode === 'checkIn' && searchParams.checkIn) {
      const existing = new Date(searchParams.checkIn);
      if (!isNaN(existing.getTime())) {
        setSelectedDate(existing);
      }
    } else if (mode === 'checkOut' && searchParams.checkOut) {
      const existing = new Date(searchParams.checkOut);
      if (!isNaN(existing.getTime())) {
        setSelectedDate(existing);
      }
    }
  };

  const handleDateSelect = (date: Date) => {
    const formatted = formatDate(date);
    if (datePickerMode === 'checkIn') {
      setSearchParams(prev => ({...prev, checkIn: formatted}));
      if (searchParams.checkOut && new Date(searchParams.checkOut) < date) {
        setSearchParams(prev => ({...prev, checkOut: ''}));
      }
    } else {
      setSearchParams(prev => ({...prev, checkOut: formatted}));
    }
    setShowDatePicker(false);
  };

  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const calendarStartDate = new Date(firstDay);
    calendarStartDate.setDate(calendarStartDate.getDate() - firstDay.getDay());
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStartDate);
      date.setDate(calendarStartDate.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const renderSearchForm = () => (
    <View style={styles.searchForm}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
        }}
        style={styles.heroImage}
        imageStyle={styles.heroImageStyle}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>Plan & book</Text>
          <Text style={styles.heroTitle}>Make the journey yours</Text>
          <Text style={styles.heroSubtitle}>
            Flexible search for flights & stays in one view
          </Text>
        </View>
      </ImageBackground>

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
            <TouchableOpacity
              style={styles.dateCard}
              onPress={() => openPicker('checkIn')}>
              <Text style={styles.dateCardText}>
                {searchParams.checkIn || 'Dec 15, 2024'}
              </Text>
              <Text style={styles.calendarHint}>📅</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Check-out</Text>
            <TouchableOpacity
              style={styles.dateCard}
              onPress={() => openPicker('checkOut')}>
              <Text style={styles.dateCardText}>
                {searchParams.checkOut || 'Dec 22, 2024'}
              </Text>
              <Text style={styles.calendarHint}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Travelers</Text>
            <View style={styles.counterCard}>
              <TouchableOpacity
                style={styles.counterCircle}
                onPress={() =>
                  setSearchParams({
                    ...searchParams,
                    travelers: Math.max(1, searchParams.travelers - 1),
                  })
                }>
                <Text style={styles.counterCircleText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{searchParams.travelers}</Text>
              <TouchableOpacity
                style={styles.counterCircle}
                onPress={() =>
                  setSearchParams({
                    ...searchParams,
                    travelers: searchParams.travelers + 1,
                  })
                }>
                <Text style={styles.counterCircleText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {activeTab === 'hotels' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rooms</Text>
              <View style={styles.counterCard}>
                <TouchableOpacity
                  style={styles.counterCircle}
                  onPress={() =>
                    setSearchParams({
                      ...searchParams,
                      rooms: Math.max(1, searchParams.rooms - 1),
                    })
                  }>
                  <Text style={styles.counterCircleText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{searchParams.rooms}</Text>
                <TouchableOpacity
                  style={styles.counterCircle}
                  onPress={() =>
                    setSearchParams({
                      ...searchParams,
                      rooms: searchParams.rooms + 1,
                    })
                  }>
                  <Text style={styles.counterCircleText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleSearch}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.primaryButtonGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={styles.primaryButtonText}>
            {activeTab === 'flights' ? 'Search flights' : 'Find stays'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={navigation.goBack} />
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSearchForm()}
      </ScrollView>
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth('prev')}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth('next')}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.daysOfWeekContainer}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.dayOfWeekText}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === selectedDate.getMonth();
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <TouchableOpacity
                    key={`${date.toISOString()}-${index}`}
                    style={[
                      styles.dateCell,
                      !isCurrentMonth && styles.dateCellInactive,
                      isToday && styles.dateCellToday,
                    ]}
                    onPress={() => handleDateSelect(date)}>
                    <Text
                      style={[
                        styles.dateCellText,
                        !isCurrentMonth && styles.dateCellTextInactive,
                        isToday && styles.dateCellTextToday,
                      ]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDatePicker(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 4,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 30,
  },
  heroImage: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImageStyle: {
    borderRadius: 20,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
  },
  heroEyebrow: {
    color: '#FFD700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#F1F1F1',
    fontSize: 14,
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
    gap: 24,
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
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateCardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarHint: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFD700',
  },
  counterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  counterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterCircleText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  counterValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
  },
  monthYearText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    color: '#A5A5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dateCellInactive: {
    opacity: 0.3,
  },
  dateCellToday: {
    backgroundColor: '#FFD700',
    borderRadius: 18,
  },
  dateCellText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dateCellTextInactive: {
    color: '#777777',
  },
  dateCellTextToday: {
    color: '#000000',
  },
  cancelButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingScreen;
