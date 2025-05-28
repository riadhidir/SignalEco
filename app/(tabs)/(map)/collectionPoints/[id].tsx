import { deleteCollectionPoint, deleteSchedule } from "@/api/map";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/deleteModal";
import Error from "@/components/error";
import ScheduleForm from "@/components/form/collectionPoints/scheduleForm";
import { Colors } from "@/constants/Colors";
import { useGetCollectionPoint } from "@/hooks/queries/useMapQueries";
import { formatDate } from "@/utils/utils";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CollectionPointDetails = () => {
  const params = useLocalSearchParams<{ id?: string }>();

  if (!params.id) {
    return <Error message="No collection point ID provided" />;
  }

  const {
    data: collectionPoint,
    isError,
    isLoading,
    refetch,
  } = useGetCollectionPoint(params.id);

  // Mock pickup days data - replace with your actual data
  const pickupDays = [
    { id: "1", day: "Monday", startTime: "09:00 AM", endTime: "11:10" },
    { id: "2", day: "Wednesday", startTime: "02:00 PM", endTime: "04:00 PM" },
    { id: "3", day: "Friday", startTime: "10:00 AM", endTime: "12:00 PM" },
  ];

  const handleEdit = () => {
    router.push(`./edit?id=${params.id}`);
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error retry={refetch} />;
  if (!collectionPoint)
    return <Error message="Collection point not found" retry={refetch} />;

  const handleOpenInMaps = () => {
    const lat = parseFloat(collectionPoint.latitude);
    const lng = parseFloat(collectionPoint.longitude);
    const url = Platform.select({
      ios: `maps://?q=${lat},${lng}`,
      android: `geo://?q=${lat},${lng}`,
    });

    if (url) {
      Linking.openURL(url).catch(() =>
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        )
      );
    }
  };

  const formattedDate = formatDate(new Date(collectionPoint.createdAt));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Photo Section */}
      {collectionPoint.photo ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: collectionPoint.photo }}
            style={styles.image}
            resizeMode="cover"
            onError={() => console.log("Error loading image")}
          />
        </View>
      ) : (
        <View style={[styles.imageContainer, styles.noImage]}>
          <MaterialIcons name="photo-camera" size={48} color="#ccc" />
          <Text style={styles.noImageText}>No photo available</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <FontAwesome name="pencil" size={18} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <DeleteModal
          onConfirm={deleteCollectionPoint}
          queryKeyToInvalidate="collectionPoint"
        />
      </View>

      <View style={styles.header}>
        <MaterialIcons name="location-on" size={24} color={Colors.light.tint} />
        <Text style={styles.title}>{collectionPoint.name}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location ID:</Text>
          <Text style={styles.detailValue}>{collectionPoint.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Coordinates:</Text>
          <Text style={styles.detailValue}>
            {collectionPoint.latitude}, {collectionPoint.longitude}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={handleOpenInMaps}
        activeOpacity={0.9}
      >
        <MaterialIcons name="map" size={20} color="white" />
        <Text style={styles.mapButtonText}>Open in Maps</Text>
      </TouchableOpacity>

      {/* Pickup Days Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pickup Schedule</Text>

        <ScheduleForm collectionPointId={collectionPoint.id} />
      </View>

      {pickupDays.length > 0 ? (
        <View style={styles.pickupDaysContainer}>
          {pickupDays.map((day) => (
            <View key={day.id} style={styles.dayCard}>
              <View style={styles.dayInfo}>
                <MaterialIcons
                  name="event-available"
                  size={20}
                  color={Colors.light.tint}
                />
                <View>
                  <Text style={styles.dayText}>{day.day}</Text>
                  <Text
                    style={styles.timeText}
                  >{`${day.startTime} - ${day.endTime}`}</Text>
                </View>
              </View>
              <View style={styles.dayActions}>
                <ScheduleForm
                  collectionPointId={collectionPoint.id}
                  schedule={day}
                />

                <DeleteModal
                  onConfirm={() => deleteSchedule(day.id)}
                  trigger={
                    <FontAwesome name="trash" size={16} color="#f44336" />
                  }
                  triggerStyles={styles.dayActionButton}
                  queryKeyToInvalidate="collectionPoint"
                />
                {/* <TouchableOpacity
                  onPress={() => handleDeletePickupDay(day.id)}
                  style={styles.dayActionButton}
                >
                </TouchableOpacity> */}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDaysText}>No pickup days scheduled</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "90%",
    alignSelf: "center",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    backgroundColor: "#f0f0f0",
  },
  noImageText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 5,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  pickupDaysContainer: {
    paddingHorizontal: 15,
  },
  dayCard: {
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
  dayInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  dayActions: {
    flexDirection: "row",
    gap: 15,
  },
  dayActionButton: {
    padding: 6,
  },
  noDaysText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default CollectionPointDetails;
