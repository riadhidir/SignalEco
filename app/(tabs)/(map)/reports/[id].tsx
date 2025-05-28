import Loading from "@/components/Loading";
import DeleteModal from "@/components/deleteModal";
import Error from "@/components/error";
import { Colors } from "@/constants/Colors";
import { useGetWasteReportPoint } from "@/hooks/queries/useMapQueries";
import { formatDate } from "@/utils/utils";
import { MaterialIcons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
  type RelativePathString,
} from "expo-router";
import {
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

// Translation mappings
const WASTE_TYPE_TRANSLATIONS = {
  PLASTIQUE: "Plastic",
  MENAGER: "Household",
  ELECTRONIQUE: "Electronic",
  CHIMIQUE: "Chemical",
  MEDICAL: "Medical",
  VERRE: "Glass",
  AUTRE: "Other",
  PAPIER: "Paper",
};

const REPORT_STATUS_TRANSLATIONS = {
  EN_ATTENTE: "Pending",
  EN_COURS: "In Progress",
  RESOLU: "Resolved",
};

const PRIORITY_TRANSLATIONS = {
  CRITIQUE: "Critical",
  ELEVEE: "High",
  MOYENNE: "Medium",
  FAIBLE: "Low",
};

const WASTE_SIZE_TRANSLATIONS = {
  PETITE: "Small",
  MOYENNE: "Medium",
  GRANDE: "Large",
  ENORME: "Huge",
};

const ReportDetails = () => {
  const params = useLocalSearchParams<{ id?: string }>();

  if (!params.id) {
    return <Error message="No report ID provided" />;
  }

  const {
    data: report,
    isError,
    isLoading,
    refetch,
  } = useGetWasteReportPoint(params.id);

  const handleEdit = () => {
    router.push(`./edit?id=${params.id}`);
  };

  const handleAssignToCollector = () => {
    router.push({
      pathname: "/(tabs)/groups" as RelativePathString,
      params: {
        mode: "picker",
        returnTo: `/(tabs)/reports/${params.id}`,
        action: "assign",
      },
    });
  };

  const handleOpenInMaps = () => {
    const url = Platform.select({
      ios: `maps://?q=${report?.latitude},${report?.longitude}`,
      android: `geo://?q=${report?.latitude},${report?.longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() =>
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${report?.latitude},${report?.longitude}`
        )
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error retry={refetch} />;
  if (!report) return <Error message="Report not found" retry={refetch} />;

  const formattedReportDate = formatDate(new Date(report.dateSignalement));
  const formattedUpdateDate = formatDate(new Date(report.updatedAt));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Photo Gallery Section */}
      <View style={styles.imageGalleryContainer}>
        {report?.photos?.length > 0 ? (
          <FlatList
            horizontal
            data={report.photos}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageGalleryContent}
          />
        ) : (
          <View style={[styles.imageContainer, styles.noImage]}>
            <MaterialIcons name="photo-camera" size={48} color="#ccc" />
            <Text style={styles.noImageText}>No photos available</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <DeleteModal onConfirm={() => {}} queryKeyToInvalidate="reports" />
      </View>
      <View style={styles.header}>
        <MaterialIcons name="report" size={24} color={Colors.light.tint} />
        <Text style={styles.title}>Waste Report #{report.id}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{report.description}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Report Date:</Text>
          <Text style={styles.detailValue}>{formattedReportDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated:</Text>
          <Text style={styles.detailValue}>{formattedUpdateDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Waste Type:</Text>
          <Text style={styles.detailValue}>
            {WASTE_TYPE_TRANSLATIONS[report.typeDeDechet]}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Waste Size:</Text>
          <Text style={styles.detailValue}>
            {WASTE_SIZE_TRANSLATIONS[report.tailleDechet]}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color:
                  report.etatSignalement === "RESOLU"
                    ? "#4CAF50"
                    : report.etatSignalement === "EN_COURS"
                    ? "#FFC107"
                    : Colors.light.tint,
              },
            ]}
          >
            {REPORT_STATUS_TRANSLATIONS[report.etatSignalement]}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Priority:</Text>
          <Text
            style={[
              styles.detailValue,
              {
                color:
                  report.priorite === "CRITIQUE"
                    ? "#F44336"
                    : report.priorite === "ELEVEE"
                    ? "#FF9800"
                    : "#2196F3",
              },
            ]}
          >
            {PRIORITY_TRANSLATIONS[report.priorite]}
          </Text>
        </View>
      </View>

      {/* Location Map Section */}
      {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: report.latitude,
              longitude: report.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
            />
          </MapView>
        </View>
      </View> */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={handleOpenInMaps}
        activeOpacity={0.9}
      >
        <MaterialIcons name="map" size={20} color="white" />
        <Text style={styles.mapButtonText}>Open in Maps</Text>
      </TouchableOpacity>

      {/* Assign to Collector Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Assigned Collectors ({report.assignedGroup?.name || 0})
        </Text>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={handleAssignToCollector}
        >
          <MaterialIcons name="person-add" size={18} color="white" />
          <Text style={styles.buttonText}>
            {report.assignedGroup?.id
              ? "Assign to another group"
              : "Assign to group"}
          </Text>
        </TouchableOpacity>
      </View>

      {report.assignedGroup?.name ? (
        <View style={styles.collectorsContainer}>
          <View style={styles.collectorCard}>
            <View style={styles.collectorInfo}>
              <MaterialIcons
                name="person"
                size={24}
                color={Colors.light.tint}
              />
              <View>
                <Text style={styles.collectorName}>
                  {report.assignedGroup.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton}>
              <MaterialIcons name="close" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.noCollectorsText}>No collectors assigned yet</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  imageGalleryContainer: {
    width: "100%",
    marginBottom: 15,
    marginTop: 10,
  },
  imageGalleryContent: {
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: 300,
    height: 220,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  noImageText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  photosContainer: {
    width: "90%",
    alignSelf: "center",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "scroll",
    marginTop: 10,
  },
  photo: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },

  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  detailsContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    width: "60%",
    color: "#333",
    fontWeight: "400",
  },
  mapButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 20,
    backgroundColor: Colors.light.mainBackground,
    borderRadius: 8,
    gap: 8,
    marginBottom: 25,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "column",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  collectorsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  collectorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  collectorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  collectorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  collectorDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  noCollectorsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ReportDetails;
