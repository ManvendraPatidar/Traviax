import React, {useState} from 'react';
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
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';
import {apiService} from '../services/api';

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
  const [destinationError, setDestinationError] = useState('');
  const [datesError, setDatesError] = useState('');
  const [budgetMinError, setBudgetMinError] = useState('');
  const [budgetMaxError, setBudgetMaxError] = useState('');

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

  const handleBudgetMinChange = (value: string) => {
    setBudgetMinError('');
    setBudgetMaxError('');

    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numValue) || value === '') {
      setBudgetMin(0);
      if (value === '') {
        setBudgetMinError('Minimum budget is required');
      }
      return;
    }

    if (budgetMax > 0 && numValue >= budgetMax) {
      setBudgetMinError('Minimum budget should be less than maximum budget');
      setBudgetMin(numValue);
      return;
    }

    setBudgetMin(numValue);

    // Re-validate max budget if it exists
    if (budgetMax > 0 && budgetMax <= numValue) {
      setBudgetMaxError('Maximum budget should be greater than minimum budget');
    }
  };

  const handleBudgetMaxChange = (value: string) => {
    setBudgetMinError('');
    setBudgetMaxError('');

    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numValue) || value === '') {
      setBudgetMax(0);
      if (value === '') {
        setBudgetMaxError('Maximum budget is required');
      }
      return;
    }

    if (numValue > 50000) {
      setBudgetMaxError('Maximum budget should not exceed $50,000');
      setBudgetMax(numValue);
      return;
    }

    if (budgetMin > 0 && numValue <= budgetMin) {
      setBudgetMaxError('Maximum budget should be greater than minimum budget');
      setBudgetMax(numValue);
      return;
    }

    setBudgetMax(numValue);

    // Re-validate min budget if it exists
    if (budgetMin > 0 && budgetMin >= numValue) {
      setBudgetMinError('Minimum budget should be less than maximum budget');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US');
  };

  const handleGenerateTrip = async () => {
    // Reset errors
    setDestinationError('');
    setDatesError('');
    setBudgetMinError('');
    setBudgetMaxError('');

    let hasErrors = false;

    // Validate destination
    const trimmedDestination = destination.trim();
    if (!trimmedDestination) {
      setDestinationError('Please enter a destination.');
      hasErrors = true;
    }

    // Validate dates
    const hasValidDates = startDate !== 'Start date' && endDate !== 'End date';
    if (!hasValidDates) {
      setDatesError('Please select the trip dates.');
      hasErrors = true;
    }

    // Validate budget
    if (budgetMin <= 0) {
      setBudgetMinError('Minimum budget is required');
      hasErrors = true;
    }

    if (budgetMax <= 0) {
      setBudgetMaxError('Maximum budget is required');
      hasErrors = true;
    } else if (budgetMax > 50000) {
      setBudgetMaxError('Maximum budget should not exceed $50,000');
      hasErrors = true;
    }

    if (budgetMin > 0 && budgetMax > 0 && budgetMin >= budgetMax) {
      setBudgetMinError('Minimum budget should be less than maximum budget');
      setBudgetMaxError('Maximum budget should be greater than minimum budget');
      hasErrors = true;
    }

    // If validation fails, don't proceed
    if (hasErrors) {
      return;
    }

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

    try {
      // Show loading for 3 seconds before making API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Call the generate itinerary API
      const tripData = {
        destination: trimmedDestination,
        startDate,
        endDate,
        budgetMin,
        budgetMax,
        numberOfTravelers:
          selectedCompanion === 'Solo'
            ? 1
            : selectedCompanion === 'Couple'
            ? 2
            : 4,
        travelType: selectedCompanion || 'Solo',
        selectedPreferences,
        flexibleDates,
      };

      const generatedItinerary = await apiService.generateItinerary(tripData);

      console.log('Generated Itinerary:', generatedItinerary);

      // Navigate to the generated itinerary details screen
      navigation.navigate('GeneratedItineraryDetails', {
        itinerary: generatedItinerary,
      });
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      Alert.alert(
        'Generation Failed',
        'Failed to generate your itinerary. Please try again.',
        [{text: 'OK'}],
      );
    } finally {
      setIsLoading(false);
    }
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
          <View
            style={[
              styles.inputContainer,
              destinationError ? styles.inputContainerError : null,
            ]}>
            <TextInput
              style={styles.textInput}
              placeholder="Where do you want to go?"
              placeholderTextColor="#666"
              value={destination}
              onChangeText={text => {
                setDestination(text);
                if (destinationError) {
                  setDestinationError('');
                }
              }}
            />
          </View>
          {destinationError ? (
            <Text style={styles.errorText}>{destinationError}</Text>
          ) : null}
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={[
                styles.dateInput,
                datesError ? styles.dateInputError : null,
              ]}
              onPress={() => {
                openDatePicker('start');
                if (datesError) {
                  setDatesError('');
                }
              }}>
              <Text
                style={[
                  styles.dateText,
                  startDate === 'Start date'
                    ? styles.dateTextPlaceholder
                    : null,
                ]}>
                {startDate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dateInput,
                datesError ? styles.dateInputError : null,
              ]}
              onPress={() => {
                openDatePicker('end');
                if (datesError) {
                  setDatesError('');
                }
              }}>
              <Text
                style={[
                  styles.dateText,
                  endDate === 'End date' ? styles.dateTextPlaceholder : null,
                ]}>
                {endDate}
              </Text>
            </TouchableOpacity>
          </View>
          {datesError ? (
            <Text style={styles.errorText}>{datesError}</Text>
          ) : null}
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
            ${formatCurrency(budgetMin)} - ${formatCurrency(budgetMax)}
          </Text>

          <View style={styles.budgetInputContainer}>
            <View style={styles.budgetInputWrapper}>
              <Text style={styles.budgetInputLabel}>Minimum Budget</Text>
              <View
                style={[
                  styles.budgetInputField,
                  budgetMinError ? styles.budgetInputError : null,
                ]}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  value={budgetMin > 0 ? budgetMin.toString() : ''}
                  onChangeText={handleBudgetMinChange}
                  placeholder="500"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
              {budgetMinError ? (
                <Text style={styles.budgetErrorText}>{budgetMinError}</Text>
              ) : null}
            </View>

            <View style={styles.budgetInputWrapper}>
              <Text style={styles.budgetInputLabel}>Maximum Budget</Text>
              <View
                style={[
                  styles.budgetInputField,
                  budgetMaxError ? styles.budgetInputError : null,
                ]}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  value={budgetMax > 0 ? budgetMax.toString() : ''}
                  onChangeText={handleBudgetMaxChange}
                  placeholder="2000"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
              {budgetMaxError ? (
                <Text style={styles.budgetErrorText}>{budgetMaxError}</Text>
              ) : null}
            </View>
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
          onPress={handleGenerateTrip}
          disabled={isLoading}
          activeOpacity={isLoading ? 1 : 0.7}>
          <LinearGradient
            colors={isLoading ? ['#999999', '#777777'] : ['#FFD700', '#FFA500']}
            style={styles.generateButtonGradient}>
            {isLoading ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator size="small" color="#000000" />
                <Text style={styles.generateButtonText}>Generating...</Text>
              </View>
            ) : (
              <Text style={styles.generateButtonText}>
                ✨ Generate Trip Plan
              </Text>
            )}
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
  inputContainerError: {
    borderColor: '#FF4444',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
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
  dateInputError: {
    borderColor: '#FF4444',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateTextPlaceholder: {
    color: '#666666',
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
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  // Budget Input Styles
  budgetInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  budgetInputWrapper: {
    flex: 1,
  },
  budgetInputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  budgetInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  currencySymbol: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
  },
  budgetInputError: {
    borderColor: '#FF4444',
  },
  budgetErrorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default PlanTripScreen;
