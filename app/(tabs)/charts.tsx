import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGetStatistics } from "@/hooks/queries/useUtilsQueries";
import Error from "@/components/error";
import { ActivityIndicator } from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const StatisticsPage = () => {
  const { data, isLoading, error, refetch } = useGetStatistics();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (error) {
    return <Error retry={refetch} />;
  }

  // Sample data structure - replace with your actual API response
  const stats = {
    activeUsers: 1243,
    activeCollectors: 187,
    totalReports: 5240,
    totalCollects: 4876,
    dailyAverage: 42,
    wasteByType: [
      {
        name: "Plastic",
        amount: 2150,
        color: "#FF5722",
        legendFontColor: "#616161",
      },
      {
        name: "Organic",
        amount: 1580,
        color: "#4CAF50",
        legendFontColor: "#616161",
      },
      {
        name: "Paper",
        amount: 920,
        color: "#2196F3",
        legendFontColor: "#616161",
      },
      {
        name: "Metal",
        amount: 680,
        color: "#607D8B",
        legendFontColor: "#616161",
      },
      {
        name: "Other",
        amount: 440,
        color: "#9C27B0",
        legendFontColor: "#616161",
      },
    ],
    weeklyTrend: [45, 52, 38, 41, 47, 50, 42], // Last 7 days
    monthlyPerformance: [
      120, 135, 142, 130, 158, 165, 170, 155, 162, 175, 180, 190,
    ], // Last 12 months
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Waste Management Analytics</Text>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <MaterialIcons name="people" size={24} color="#00796B" />
          </View>
          <Text style={styles.cardValue}>{stats.activeUsers}</Text>
          <Text style={styles.cardLabel}>Active Users</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons
              name="trash-can"
              size={24}
              color="#00796B"
            />
          </View>
          <Text style={styles.cardValue}>{stats.activeCollectors}</Text>
          <Text style={styles.cardLabel}>Active Collectors</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <MaterialIcons name="report" size={24} color="#00796B" />
          </View>
          <Text style={styles.cardValue}>{stats.totalReports}</Text>
          <Text style={styles.cardLabel}>Total Reports</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="recycle" size={24} color="#00796B" />
          </View>
          <Text style={styles.cardValue}>{stats.totalCollects}</Text>
          <Text style={styles.cardLabel}>Total Collections</Text>
        </View>
      </View>

      {/* Average Collections Card */}
      <View style={styles.fullWidthCard}>
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={24}
            color="#00796B"
          />
        </View>
        <Text style={styles.cardValue}>{stats.dailyAverage}</Text>
        <Text style={styles.cardLabel}>Average Collections Per Day</Text>
      </View>

      {/* Waste Composition Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Waste Composition</Text>
        <PieChart
          data={stats.wasteByType}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Weekly Trend Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Collection Trend</Text>
        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: stats.weeklyTrend,
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(97, 97, 97, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#00796B",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Monthly Performance Bar Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Collection Performance</Text>
        <BarChart
          data={{
            labels: [
              "J",
              "F",
              "M",
              "A",
              "M",
              "J",
              "J",
              "A",
              "S",
              "O",
              "N",
              "D",
            ],
            datasets: [
              {
                data: stats.monthlyPerformance,
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(97, 97, 97, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 20,
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    backgroundColor: "#E0F2F1",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: "#616161",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    padding: 16,
    fontWeight: "600",
    color: "#00796B",
    marginBottom: 12,
  },
});

export default StatisticsPage;
