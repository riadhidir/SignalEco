import { Colors } from "@/constants/Colors";
import { useUpdateCollectionPoint } from "@/hooks/mutations/useMapMutations";
import {
  addCollectionPointSchema,
  type TaddCollectionPointSchema,
} from "@/utils/schemas";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const CollectionPointEdit = () => {
  const mapRef = useRef<MapView>(null);

  const { mutate: updateCollectionPoint, isPending: isUpdating } =
    useUpdateCollectionPoint();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaddCollectionPointSchema>({
    resolver: zodResolver(addCollectionPointSchema),
    defaultValues: {
      name: "",
      latitude: 36.7666,
      longitude: 3.4772,
      photo: "",
    },
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const photo = watch("photo");

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setValue("latitude", latitude, { shouldValidate: true });
    setValue("longitude", longitude, { shouldValidate: true });
  };

  const onSubmit = (data: TaddCollectionPointSchema) => {
    console.log(data);
    updateCollectionPoint(data);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Need access to photos to upload an image"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setValue("photo", result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Need camera access to take a photo");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setValue("photo", result.assets[0]);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "white" }}
    >
      {/* Photo Section */}
      <View style={styles.imageSection}>
        {photo ? (
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <MaterialIcons name="photo-camera" size={48} color="#ccc" />
            <Text style={styles.noImageText}>No photo selected</Text>
          </View>
        )}

        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={20} color="white" />
            <Text style={styles.imageButtonText}>Choose Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={20} color="white" />
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location on Map</Text>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: latitude || 0,
              longitude: longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {latitude && longitude && (
              <Marker coordinate={{ latitude, longitude }} />
            )}
          </MapView>
        </View>
        <View style={styles.coordinateDisplay}>
          <Text style={styles.coordinateText}>
            Lat: {latitude?.toFixed(6) || "Not selected"}
          </Text>
          <Text style={styles.coordinateText}>
            Lng: {longitude?.toFixed(6) || "Not selected"}
          </Text>
        </View>
        {(errors.latitude || errors.longitude) && (
          <Text style={styles.errorText}>
            Please select a location on the map
          </Text>
        )}
      </View>

      {/* Name Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter location name"
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={isUpdating}
        >
          <Text style={[styles.buttonText, { color: Colors.light.tint }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ... (keep your existing styles)

export default CollectionPointEdit;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "white",
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  noImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
  },
  noImageText: {
    marginTop: 10,
    color: "#999",
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 5,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "500",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
    color: "#333",
  },
  mapContainer: {
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coordinateDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  coordinateText: {
    color: "#666",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    marginTop: 5,
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
