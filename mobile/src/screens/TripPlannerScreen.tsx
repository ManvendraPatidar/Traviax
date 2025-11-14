import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@/theme";
import Slider from "@react-native-community/slider";

export const TripPlannerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState(1250);
  const [companions, setCompanions] = useState(2);
  const [selectedCompanionType, setSelectedCompanionType] = useState("Couple");

  const preferences = [
    { id: "adventure", name: "Adventure", icon: "🏔️" },
    { id: "relax", name: "Relax", icon: "🧘" },
    { id: "hotel", name: "Hotel", icon: "🏨" },
    { id: "local-cuisine", name: "Local Cuisine", icon: "🍽️" },
  ];

  const companionTypes = ["Solo", "Couple", "Family"];

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const adjustCompanions = (increment: boolean) => {
    if (increment) {
      setCompanions(prev => prev + 1);
    } else if (companions > 1) {
      setCompanions(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Plan Your Trip</Text>
          <Text style={styles.headerSubtitle}>Create your perfect journey step by step</Text>
        </View>
        <TouchableOpacity style={styles.myTripsButton}>
          <Text style={styles.myTripsText}>My Trips</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination</Text>
          <View style={styles.destinationContainer}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={theme.colors.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Where do you want to go?"
                placeholderTextColor={theme.colors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
            </View>
            <View style={styles.locationActions}>
              <TouchableOpacity style={styles.locationButton}>
                <Ionicons name="location" size={16} color={theme.colors.primary} />
                <Text style={styles.locationButtonText}>Use current location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton}>
                <Ionicons name="map" size={16} color={theme.colors.primary} />
                <Text style={styles.locationButtonText}>Browse map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.datesContainer}>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
              <Text style={styles.dateText}>Start date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
              <Text style={styles.dateText}>End date</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexibleDatesContainer}>
            <Text style={styles.flexibleDatesText}>Flexible dates</Text>
            <Switch
              value={flexibleDates}
              onValueChange={setFlexibleDates}
              trackColor={{ false: "#3e3e3e", true: theme.colors.primary }}
              thumbColor={flexibleDates ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Travel Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          <View style={styles.preferencesGrid}>
            {preferences.map((preference) => (
              <TouchableOpacity
                key={preference.id}
                style={[
                  styles.preferenceCard,
                  selectedPreferences.includes(preference.id) && styles.preferenceCardSelected
                ]}
                onPress={() => togglePreference(preference.id)}
              >
                <Text style={styles.preferenceIcon}>{preference.icon}</Text>
                <Text style={[
                  styles.preferenceText,
                  selectedPreferences.includes(preference.id) && styles.preferenceTextSelected
                ]}>
                  {preference.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget Range */}
        <View style={styles.section}>
          <View style={styles.budgetHeader}>
            <Text style={styles.sectionTitle}>Budget Range</Text>
            <Text style={styles.budgetValue}>${budgetRange.toFixed(0)} - $2000</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={500}
              maximumValue={2000}
              value={budgetRange}
              onValueChange={setBudgetRange}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="#3e3e3e"
              thumbTintColor={theme.colors.primary}
            />
          </View>
        </View>

        {/* Companions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Companions</Text>
          <View style={styles.companionsContainer}>
            <View style={styles.companionsCounter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => adjustCompanions(false)}
              >
                <Ionicons name="remove" size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={styles.counterDisplay}>
                <Text style={styles.counterNumber}>{companions}</Text>
                <Text style={styles.counterLabel}>Travelers</Text>
              </View>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => adjustCompanions(true)}
              >
                <Ionicons name="add" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.companionTypes}>
              {companionTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.companionTypeButton,
                    selectedCompanionType === type && styles.companionTypeButtonSelected
                  ]}
                  onPress={() => setSelectedCompanionType(type)}
                >
                  <Text style={[
                    styles.companionTypeText,
                    selectedCompanionType === type && styles.companionTypeTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Generate Trip Plan Button */}
        <View style={styles.generateButtonContainer}>
          <TouchableOpacity style={styles.generateButton}>
            <Ionicons name="flash" size={20} color="#000" style={styles.generateIcon} />
            <Text style={styles.generateButtonText}>Generate Trip Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  myTripsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  myTripsText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  destinationContainer: {
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  locationActions: {
    flexDirection: "row",
    gap: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  datesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  flexibleDatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  flexibleDatesText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  preferencesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  preferenceCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  preferenceCardSelected: {
    backgroundColor: theme.colors.primary,
  },
  preferenceIcon: {
    fontSize: 24,
  },
  preferenceText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  preferenceTextSelected: {
    color: "#000",
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  companionsContainer: {
    gap: 16,
  },
  companionsCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  counterDisplay: {
    alignItems: "center",
    gap: 4,
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  counterLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  companionTypes: {
    flexDirection: "row",
    gap: 8,
  },
  companionTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  companionTypeButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  companionTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  companionTypeTextSelected: {
    color: "#000",
  },
  generateButtonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  generateIcon: {
    marginRight: 4,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  bottomPadding: {
    height: 20,
  },
});
