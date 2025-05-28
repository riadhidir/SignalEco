import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isLoggedIn, isReady, role } = useAuth();

  if (!isReady) {
    return null;
  }
  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/signIn"} />;
  }
  return (
    <Tabs
      screenOptions={{
        //tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to scolorhow the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          href: role === "ADMIN" ? "/charts" : null,

          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: "schedule",
          href: role === "COLLECTOR" ? "/schedule" : null,
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(map)"
        options={{
          title: "map",
          tabBarIcon: ({ color }) => (
            <Feather name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: true,

          tabBarIcon: ({ color }) => (
            <Feather name="bell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
