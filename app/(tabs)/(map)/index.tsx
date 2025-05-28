import { Colors } from "@/constants/Colors";
import {
  useGetCollectionPoints,
  useGetWasteReportsPoints,
} from "@/hooks/queries/useMapQueries";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

type MarkerTypes = "CollectionPoints" | "Reports";
type ViewMode = "map" | "list";

const { width, height } = Dimensions.get("window");

const Map = () => {
  const router = useRouter();
  const [markerType, setMarkerType] = useState<MarkerTypes>("CollectionPoints");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [mapReady, setMapReady] = useState(false);

  const {
    data: collectionPoints,
    isLoading: isLoadingCollectionPoints,
    isError: isErrorCollectionPoints,
  } = useGetCollectionPoints();
  const {
    data: reports,
    isLoading: isLoadingReports,
    isError: isErrorReports,
  } = useGetWasteReportsPoints(markerType === "Reports");

  const handleMarkerPress = (markerId: string) => {
    if (markerType === "CollectionPoints") {
      router.push(`/(tabs)/(map)/collectionPoints/${markerId}`);
    } else {
      router.push(`/(tabs)/(map)/reports/${markerId}`);
    }
  };

  const getMarkerData = () => {
    return (
      (markerType === "CollectionPoints" ? collectionPoints : reports) || []
    );
  };

  const toggleMarkerType = () => {
    setMarkerType((prev) =>
      prev === "CollectionPoints" ? "Reports" : "CollectionPoints"
    );
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "map" ? "list" : "map"));
  };

  const renderMarkerIcon = (type: MarkerTypes) => {
    const size = 24;
    if (type === "CollectionPoints") {
      return (
        <View style={[styles.markerIcon, styles.collectionMarker]}>
          <MaterialIcons name="recycling" size={size} color="white" />
        </View>
      );
    }
    return (
      <View style={[styles.markerIcon, styles.reportMarker]}>
        <MaterialIcons name="warning" size={size} color="white" />
      </View>
    );
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleMarkerPress(item.id)}
    >
      <View style={styles.listIconContainer}>
        {markerType === "CollectionPoints" ? (
          <MaterialIcons name="recycling" size={24} color={Colors.light.tint} />
        ) : (
          <MaterialIcons name="warning" size={24} color="#FF6B6B" />
        )}
      </View>
      <View style={styles.listContent}>
        <Text style={styles.listTitle}>{item.name || "Unnamed Location"}</Text>
        <Text style={styles.listSubtitle}>
          {item.address || "No address provided"}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Colors.light.text} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Map View */}
      {viewMode === "map" ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 36.7666,
            longitude: 3.4772,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onMapReady={() => setMapReady(true)}
        >
          {mapReady &&
            getMarkerData().map((loc) => (
              <Marker
                key={loc.id}
                coordinate={{
                  latitude: Number(loc.latitude),
                  longitude: Number(loc.longitude),
                }}
                pinColor={
                  markerType === "CollectionPoints"
                    ? Colors.light.tint
                    : "#FF6B6B"
                }
                onPress={() => handleMarkerPress(loc.id)}
              >
                {/* {renderMarkerIcon(markerType)} */}
              </Marker>
            ))}
        </MapView>
      ) : (
        <FlatList
          data={getMarkerData()}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>
                No{" "}
                {markerType === "CollectionPoints"
                  ? "collection points"
                  : "waste reports"}{" "}
                found
              </Text>
            </View>
          }
        />
      )}

      {/* Loading Overlay */}
      {(isLoadingCollectionPoints || isLoadingReports || !mapReady) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {markerType === "CollectionPoints"
            ? "Collection Points"
            : "Waste Reports"}
        </Text>
      </View>

      {/* View Mode Toggle */}
      <TouchableOpacity style={styles.viewModeToggle} onPress={toggleViewMode}>
        <MaterialIcons
          name={viewMode === "map" ? "list" : "map"}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor:
                markerType === "CollectionPoints"
                  ? "#FF6B6B"
                  : Colors.light.tint,
            },
          ]}
          onPress={toggleMarkerType}
        >
          {markerType === "CollectionPoints" ? (
            <Feather name="alert-triangle" size={24} color="white" />
          ) : (
            <MaterialIcons name="recycling" size={24} color="white" />
          )}
        </TouchableOpacity>

        {markerType === "CollectionPoints" && viewMode === "map" && (
          <TouchableOpacity
            style={[styles.fab, styles.addFab]}
            onPress={() => router.push("./createCollectionPoint")}
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 40,
    gap: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addFab: {
    backgroundColor: Colors.light.tint,
  },
  viewModeToggle: {
    position: "absolute",
    top: 120,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  collectionMarker: {
    backgroundColor: Colors.light.tint,
  },
  reportMarker: {
    backgroundColor: "#FF6B6B",
  },
  // List view styles
  listContainer: {
    padding: 16,
    paddingTop: 120,
    paddingBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(78, 125, 150, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: "#6C757D",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.6,
  },
  emptyListText: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.6,
  },
});

export default Map;
