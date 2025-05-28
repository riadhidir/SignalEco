import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  Dimensions,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useGetStatistics } from "@/hooks/queries/useUtilsQueries";
import Error from "@/components/error";
import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();

  const { data, isLoading, isRefetching, isError, refetch } =
    useGetStatistics();
  const quickActions = [
    {
      id: "1",
      icon: "group",
      name: "Collectors",
      color: "#4E7D96",
      screen: "collectors" as const,
    },
    {
      id: "2",
      icon: "group",
      name: "Groups",
      color: "#6A8C69",
      screen: "groups" as const,
    },
    {
      id: "3",
      icon: "report-problem",
      name: "Complaints",
      color: "#D4A762",
      screen: "/(tabs)/(map)" as const,
    },
    {
      id: "4",
      icon: "group",
      name: "Users",
      color: "#8A6A9E",
      screen: "users" as const,
    },
  ];

  const stats = [
    { id: "1", value: "1,245", label: "Total Collections", trend: "up" },
    { id: "2", value: "23", label: "Pending", trend: "down" },
    { id: "3", value: "8", label: "Active Collectors", trend: "same" },
  ];

  const renderStatItem = ({ item }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
      <View style={styles.trendContainer}>
        {item.trend === "up" && (
          <MaterialIcons name="trending-up" size={18} color="#4CAF50" />
        )}
        {item.trend === "down" && (
          <MaterialIcons name="trending-down" size={18} color="#F44336" />
        )}
        {item.trend === "same" && (
          <MaterialIcons name="trending-flat" size={18} color="#FFC107" />
        )}
      </View>
    </View>
  );

  if (isError) return <Error retry={refetch} />;
  if (isLoading) return <Loading />;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#4E7D96"
          />
        }
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[Colors.light.mainBackground, "#1dd84f"]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.adminName}>Admin Team</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(profile)")}>
              <Image
                source={require("@/assets/images/avatar.png")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <FlatList
          data={stats}
          renderItem={renderStatItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        />

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.screen)}
            >
              <LinearGradient
                colors={[action.color, darkenColor(action.color)]}
                style={styles.actionIcon}
              >
                <MaterialIcons name={action.icon} size={24} color="white" />
              </LinearGradient>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Collection Map Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Collection Progress</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/(map)")}>
            <Text style={styles.seeAll}>View map</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.mapCard}
          onPress={() => router.push("/(tabs)/(map)")}
        >
          <LinearGradient
            colors={[Colors.light.mainBackground, "#1dd84f"]}
            style={styles.mapGradient}
          >
            <MaterialCommunityIcons
              name="map"
              size={48}
              color="rgba(255,255,255,0.2)"
            />
            <Text style={styles.mapText}>View live collection progress</Text>
            <Feather name="map" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to darken color for gradient
const darkenColor = (color: string) => {
  // Simple color darkening - replace with actual color manipulation if needed
  if (color === "#4E7D96") return "#3A5D72";
  if (color === "#6A8C69") return "#567856";
  if (color === "#D4A762") return "#C09552";
  return color;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContainer: {
    paddingBottom: 12,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  adminName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginTop: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "white",
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: 140,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 8,
  },
  trendContainer: {
    alignSelf: "flex-start",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  seeAll: {
    color: "#4E7D96",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionCard: {
    width: width / 2 - 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212529",
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212529",
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: "#6C757D",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  mapCard: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  mapGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  mapText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginVertical: 8,
  },
});

export default Home;
