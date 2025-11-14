import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { HomeScreen } from "@/screens/HomeScreen";
import { ReelsScreen } from "@/screens/ReelsScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { BookingsScreen } from "@/screens/BookingsScreen";
import { TripPlannerScreen } from "@/screens/TripPlannerScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import {
  ChatBottomSheet,
  ChatBottomSheetRef,
} from "@/components/ChatBottomSheet";
import { theme } from "@/theme";

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const chatBottomSheetRef = useRef<ChatBottomSheetRef>(null);

  const handleAITabPress = () => {
    chatBottomSheetRef.current?.open();
  };

  // Dummy component for AI tab since we're using bottom sheet
  const AITabComponent = () => null;

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "Home":
                iconName = focused ? "home" : "home-outline";
                break;
              case "Explore":
                iconName = focused ? "compass" : "compass-outline";
                break;
              case "AI":
                // Special handling for AI center button
                return (
                  <TouchableOpacity
                    onPress={handleAITabPress}
                    style={styles.aiButtonContainer}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, "#FFA500"]}
                      style={styles.aiButton}
                    >
                      <Ionicons name="star" size={28} color="#000" />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              case "Planner":
                iconName = focused ? "calendar" : "calendar-outline";
                break;
              case "Profile":
                iconName = focused ? "person" : "person-outline";
                break;
              default:
                iconName = "home-outline";
            }

            // Special styling for AI tab (no regular icon)
            if (route.name === "AI") {
              return null;
            }

            return (
              <View
                style={[styles.iconContainer, focused && styles.activeIcon]}
              >
                <Ionicons
                  name={iconName}
                  size={size}
                  color={focused ? theme.colors.primary : color}
                />
              </View>
            );
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
          },
          tabBarBackground: () => (
            <BlurView intensity={100} style={StyleSheet.absoluteFill}>
              <View style={styles.tabBarBackground} />
            </BlurView>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginBottom: 8,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ReelsScreen} />
        <Tab.Screen
          name="AI"
          component={AITabComponent}
          options={{
            tabBarLabel: "",
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleAITabPress();
            },
          }}
        />
        <Tab.Screen name="Reels" component={TripPlannerScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <ChatBottomSheet ref={chatBottomSheetRef} />
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    // Active icon styling handled by gradient
  },
  activeBackground: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  aiButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Elevate above other tabs
  },
  aiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 175, 55, 0.3)",
  },
});
