import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Modal,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';

const {width} = Dimensions.get('window');

interface PlanTripScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const PlanTripScreen: React.FC<PlanTripScreenProps> = ({navigation}) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('Start date');
  const [endDate, setEndDate] = useState('End date');
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(2000);
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>(
    'start',
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const sliderWidth = useRef(280);
  const isDragging = useRef(false);
  const activeThumb = useRef<'min' | 'max' | null>(null);

  const preferences = [
    {key: 'Adventure', icon: '🥾'},
    {key: 'Relax', icon: '🧘'},
    {key: 'Hotel', icon: '🏨'},
    {key: 'Local Cuisine', icon: '🍜'},
  ];
  const companions = ['Solo', 'Couple', 'Family'];

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference],
    );
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (datePickerMode === 'start') {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }
    setShowDatePicker(false);
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const calendarStartDate = new Date(firstDay);
    calendarStartDate.setDate(calendarStartDate.getDate() - firstDay.getDay());

    const calendar = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStartDate);
      date.setDate(calendarStartDate.getDate() + i);
      calendar.push(date);
    }

    return calendar;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const updateSliderValue = (locationX: number, thumbType: 'min' | 'max') => {
    const percentage = Math.max(
      0,
      Math.min(1, locationX / sliderWidth.current),
    );
    const newValue = Math.round(500 + percentage * 1500);

    if (thumbType === 'min' && newValue <= budgetMax - 100) {
      setBudgetMin(newValue);
    } else if (thumbType === 'max' && newValue >= budgetMin + 100) {
      setBudgetMax(newValue);
    }
  };

  const createThumbPanResponder = (thumbType: 'min' | 'max') => {
    let startValue = 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDragging.current = true;
        activeThumb.current = thumbType;
        startValue = thumbType === 'min' ? budgetMin : budgetMax;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (activeThumb.current !== thumbType) {
          return;
        }

        const deltaValue = (gestureState.dx / sliderWidth.current) * 1500;
        const newValue = Math.round(startValue + deltaValue);

        if (thumbType === 'min') {
          const clampedValue = Math.max(
            500,
            Math.min(budgetMax - 100, newValue),
          );
          setBudgetMin(clampedValue);
        } else {
          const clampedValue = Math.max(
            budgetMin + 100,
            Math.min(2000, newValue),
          );
          setBudgetMax(clampedValue);
        }
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        activeThumb.current = null;
      },
    });
  };

  const minThumbPanResponder = createThumbPanResponder('min');
  const maxThumbPanResponder = createThumbPanResponder('max');

  const handleSliderTrackPress = (event: any) => {
    const {locationX} = event.nativeEvent;
    const percentage = locationX / sliderWidth.current;
    const clickValue = 500 + percentage * 1500;

    // Determine which thumb is closer to the click
    const minDistance = Math.abs(clickValue - budgetMin);
    const maxDistance = Math.abs(clickValue - budgetMax);

    if (minDistance < maxDistance) {
      updateSliderValue(locationX, 'min');
    } else {
      updateSliderValue(locationX, 'max');
    }
  };

  const handleGenerateTrip = () => {
    // Console log all form values
    console.log('=== TRIP PLAN FORM VALUES ===');
    console.log('Destination:', destination);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Flexible Dates:', flexibleDates);
    console.log('Selected Preferences:', selectedPreferences);
    console.log('Budget Range:', `$${budgetMin} - $${budgetMax}`);
    console.log('Selected Companion:', selectedCompanion);
    console.log('==============================');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('ItineraryDetails', {
        itineraryId: 'it1',
      });
    }, 3000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Generating your perfect trip...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={navigation.goBack} style={styles.backButton} />
        <Text style={styles.headerTitle}>Plan Your Trip</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Create your perfect journey step by step
        </Text>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Where do you want to go?"
              placeholderTextColor="#666"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <View style={styles.locationOptions}>
            <TouchableOpacity style={styles.locationOption}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>Use current location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationOption}>
              <Text style={styles.locationIcon}>🗺️</Text>
              <Text style={styles.locationText}>Browse map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker('start')}>
              <Text style={styles.dateText}>{startDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => openDatePicker('end')}>
              <Text style={styles.dateText}>{endDate}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexibleContainer}>
            <Text style={styles.flexibleText}>Flexible dates</Text>
            <TouchableOpacity
              style={[styles.toggle, flexibleDates && styles.toggleActive]}
              onPress={() => setFlexibleDates(!flexibleDates)}>
              <View
                style={[
                  styles.toggleThumb,
                  flexibleDates && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          <View style={styles.preferencesGrid}>
            {preferences.map(({key, icon}) => {
              const isActive = selectedPreferences.includes(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.preferenceCard,
                    isActive && styles.preferenceCardActive,
                  ]}
                  onPress={() => togglePreference(key)}>
                  <View style={styles.preferenceIconContainer}>
                    <Text
                      style={[
                        styles.preferenceIcon,
                        isActive && styles.preferenceIconActive,
                      ]}>
                      {icon}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.preferenceLabel,
                      isActive && styles.preferenceLabelActive,
                    ]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Budget Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Range</Text>
          <Text style={styles.budgetValue}>
            ${budgetMin} - ${budgetMax}
          </Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              {/* Fill between min and max */}
              <View
                style={[
                  styles.sliderFill,
                  {
                    left: `${((budgetMin - 500) / 1500) * 100}%`,
                    width: `${((budgetMax - budgetMin) / 1500) * 100}%`,
                  },
                ]}
              />
              {/* Min thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  {left: `${((budgetMin - 500) / 1500) * 100}%`},
                ]}
                {...minThumbPanResponder.panHandlers}>
                <View style={styles.thumbInner} />
              </View>
              {/* Max thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  {left: `${((budgetMax - 500) / 1500) * 100}%`},
                ]}
                {...maxThumbPanResponder.panHandlers}>
                <View style={styles.thumbInner} />
              </View>
            </View>
            {/* Track click areas */}
            <TouchableOpacity
              style={styles.sliderClickArea}
              onPress={handleSliderTrackPress}
              activeOpacity={1}
            />
          </View>
        </View>

        {/* Companions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Companions</Text>
          <View style={styles.companionsContainer}>
            {companions.map(companion => (
              <TouchableOpacity
                key={companion}
                style={[
                  styles.companionButton,
                  selectedCompanion === companion &&
                    styles.companionButtonActive,
                ]}
                onPress={() => setSelectedCompanion(companion)}>
                <Text
                  style={[
                    styles.companionText,
                    selectedCompanion === companion &&
                      styles.companionTextActive,
                  ]}>
                  {companion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateTrip}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.generateButtonGradient}>
            <Text style={styles.generateButtonText}>✨ Generate Trip Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            {/* Calendar Header */}
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

            {/* Days of Week */}
            <View style={styles.daysOfWeekContainer}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.dayOfWeekText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {generateCalendar().map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === selectedDate.getMonth();
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <TouchableOpacity
                    key={index}
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

            {/* Calendar Footer */}
            <View style={styles.calendarFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDatePicker(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  flexibleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  flexibleText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  toggle: {
    width: 50,
    height: 28,
    backgroundColor: '#333333',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#FFD700',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  preferenceCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  preferenceCardActive: {
    borderColor: '#FFD700',
    backgroundColor: '#1F1F1F',
  },
  preferenceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  preferenceIcon: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  preferenceIconActive: {
    color: '#FFD700',
  },
  preferenceLabel: {
    color: '#B0B0B0',
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceLabelActive: {
    color: '#FFFFFF',
  },
  budgetValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  sliderContainer: {
    paddingHorizontal: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    width: 12,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 6,
  },
  sliderClickArea: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: '50%',
  },
  sliderClickAreaLeft: {
    right: '50%',
  },
  sliderClickAreaRight: {
    left: '50%',
  },
  companionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  companionButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  companionButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  companionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  companionTextActive: {
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    width: width - 40,
    maxWidth: 350,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
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
    color: '#888888',
    fontSize: 12,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dateCellInactive: {
    opacity: 0.3,
  },
  dateCellToday: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  dateCellText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dateCellTextInactive: {
    color: '#666666',
  },
  dateCellTextToday: {
    color: '#000000',
    fontWeight: 'bold',
  },
  calendarFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PlanTripScreen;
