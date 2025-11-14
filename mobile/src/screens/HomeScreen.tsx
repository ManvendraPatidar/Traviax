import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@/theme";
import { fetchAllItineraries } from "@/services/apiService";
import { Itinerary } from "@/services/itineraryService";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const loadItineraries = async () => {
      try {
        const data = await fetchAllItineraries();
        setItineraries(data);
      } catch (error) {
        console.error("Failed to load itineraries:", error);
      }
    };

    loadItineraries();
  }, []);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>Traviax</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>Good morning, Alex</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="airplane-outline"
            size={20}
            color={theme.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Plan a trip to Tokyo..."
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>
      </View>

      {/* Hero Section - Explore Feed */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => (navigation as any).navigate("ExploreScreen")}
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
            }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.heroGradient}
            >
              <Text style={styles.heroText}>Explore Feed</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Quick Access Cards */}
      <View style={styles.section}>
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate("Planner" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.quickAccessGradient}
              >
                <Text style={styles.quickAccessText}>Trip Planner</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate("Planner" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
              }}
              style={styles.quickAccessImage}
              imageStyle={styles.quickAccessImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.quickAccessGradient}
              >
                <Text style={styles.quickAccessText}>Bookings</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* For You Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For You</Text>
        <View style={styles.forYouRow}>
          <TouchableOpacity
            style={styles.forYouCard}
            onPress={() => navigation.navigate("Explore" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=350&fit=crop",
              }}
              style={styles.forYouImage}
              imageStyle={styles.forYouImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.forYouGradient}
              >
                <View style={styles.forYouTextContainer}>
                  <Text style={styles.forYouTitle}>Trending Reels</Text>
                  <Text style={styles.forYouSubtitle}>Discover Marrakech</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forYouCard}
            onPress={() => navigation.navigate("Explore" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&fit=crop",
              }}
              style={styles.forYouImage}
              imageStyle={styles.forYouImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.forYouGradient}
              >
                <View style={styles.forYouTextContainer}>
                  <Text style={styles.forYouTitle}>Recommended</Text>
                  <Text style={styles.forYouSubtitle}>
                    Destinations in Swiss
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trending Places Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Places</Text>
        <View style={styles.trendingPlacesRow}>
          <TouchableOpacity
            style={styles.trendingPlaceCard}
            onPress={() => navigation.navigate("Explore" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=350&fit=crop",
              }}
              style={styles.trendingPlaceImage}
              imageStyle={styles.trendingPlaceImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.trendingPlaceGradient}
              >
                <View style={styles.trendingPlaceTextContainer}>
                  <Text style={styles.trendingPlaceTitle}>Kyoto</Text>
                  <Text style={styles.trendingPlaceSubtitle}>Japan</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trendingPlaceCard}
            onPress={() => navigation.navigate("Explore" as never)}
          >
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=350&fit=crop",
              }}
              style={styles.trendingPlaceImage}
              imageStyle={styles.trendingPlaceImageStyle}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.trendingPlaceGradient}
              >
                <View style={styles.trendingPlaceTextContainer}>
                  <Text style={styles.trendingPlaceTitle}>Santorini</Text>
                  <Text style={styles.trendingPlaceSubtitle}>Greece</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* Best Trip Itinerary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Trip Itinerary</Text>
        <View style={styles.itineraryContainer}>
          {itineraries.slice(0, 4).map((itinerary) => (
            <TouchableOpacity
              key={itinerary.id}
              style={styles.itineraryCard}
              onPress={() =>
                (navigation as any).navigate("ItineraryDetail", {
                  itineraryId: itinerary.id,
                })
              }
            >
              <ImageBackground
                source={{ uri: itinerary.heroImage }}
                style={styles.itineraryImage}
                imageStyle={styles.itineraryImageStyle}
              />
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                <Text style={styles.itineraryDuration}>
                  {itinerary.duration} in {itinerary.location.split(",")[0]}
                </Text>
                <View style={styles.itineraryRating}>
                  <Ionicons
                    name="star"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.itineraryRatingText}>
                    {itinerary.rating}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom padding for tab bar */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    // backgroundColor: '#1a1a1a',
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  heroCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 300,
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  heroImage: {
    height: 300,
    justifyContent: "flex-end",
  },
  heroImageStyle: {
    borderRadius: 16,
  },
  heroGradient: {
    height: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  quickAccessImage: {
    height: 130,
    justifyContent: "flex-end",
  },
  quickAccessImageStyle: {
    borderRadius: 12,
  },
  quickAccessGradient: {
    height: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
  },
  forYouRow: {
    flexDirection: "row",
    gap: 12,
  },
  forYouCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  forYouImage: {
    height: 170,
    justifyContent: "flex-end",
  },
  forYouImageStyle: {
    borderRadius: 12,
  },
  forYouGradient: {
    height: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  forYouTextContainer: {
    gap: 4,
  },
  forYouTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  forYouSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  // Trending Places Styles
  trendingPlacesRow: {
    flexDirection: "row",
    gap: 12,
  },
  trendingPlaceCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  trendingPlaceImage: {
    height: 170,
    justifyContent: "flex-end",
  },
  trendingPlaceImageStyle: {
    borderRadius: 12,
  },
  trendingPlaceGradient: {
    height: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  trendingPlaceTextContainer: {
    gap: 4,
  },
  trendingPlaceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  trendingPlaceSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  // Trip Itinerary Styles
  itineraryContainer: {
    gap: 12,
  },
  itineraryCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itineraryImage: {
    width: 80,
    height: 80,
  },
  itineraryImageStyle: {
    borderRadius: 0,
  },
  itineraryContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  itineraryDuration: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  itineraryRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itineraryRatingText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.primary,
  },
  bottomPadding: {
    height: 100,
  },
});
