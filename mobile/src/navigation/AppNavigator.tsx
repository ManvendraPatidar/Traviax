import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { TabNavigator } from "./TabNavigator";
import { ReelDetailsScreen } from "@/screens/ReelDetailsScreen";
import { ItineraryDetailScreen } from "@/screens/ItineraryDetailScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { TripPlannerScreen } from "@/screens/TripPlannerScreen";
import { theme } from "@/theme";

export type RootStackParamList = {
  Main: undefined;
  ReelDetails: {
    reelId: string;
  };
  ItineraryDetail: {
    itineraryId: string;
  };
  ExploreScreen: undefined;
  Planner: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.accent,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.borderLight,
          notification: theme.colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="ReelDetails"
          component={ReelDetailsScreen}
          options={{
            gestureEnabled: true,
            gestureDirection: "vertical",
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
        <Stack.Screen
          name="ItineraryDetail"
          component={ItineraryDetailScreen}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
        <Stack.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
        <Stack.Screen
          name="Planner"
          component={TripPlannerScreen}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
