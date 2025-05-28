import { Colors } from "@/constants/Colors";
import {
  useCreateGroup,
  useUpdateGroup,
} from "@/hooks/mutations/useGroupsMutations";
import { useGetGroup } from "@/hooks/queries/useGroupQueries";
import { addGroupSchema, type TaddGroupSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Slider from "@react-native-community/slider";
import { router, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

const WASTE_TYPES = {
  PLASTIQUE: "Plastic",
  MENAGER: "Household",
  ELECTRONIQUE: "Electronic",
  CHIMIQUE: "Chemical",
  MEDICAL: "Medical",
  VERRE: "Glass",
  AUTRE: "Other",
  PAPIER: "Paper",
} as const;

const AddGroupScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const { back } = useRouter();
  if (!params.id) {
    back();
  }
  const {
    data: group,
    isError,
    isLoading,
    refetch,
  } = useGetGroup(params.id || "");

  const mapRef = useRef<MapView>(null);
  const [showRadiusControls, setShowRadiusControls] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaddGroupSchema>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: group?.name,
      zoneName: group?.zoneName,
      description: group?.description,
      wasteTypes: group?.wasteTypes || [],
      members: group?.members.map((i) => i.id) || [],
      lat: group?.lat,
      long: group?.long,
      radius: group?.radius,
    },
  });

  const { mutate: updateGroup, isPending } = useUpdateGroup(params.id || "");

  const lat = watch("lat");
  const long = watch("long");
  const radius = watch("radius");
  const selectedWasteTypes = watch("wasteTypes");

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setValue("lat", latitude, { shouldValidate: true });
    setValue("long", longitude, { shouldValidate: true });
    setShowRadiusControls(true);
  };

  const toggleWasteType = (type: TaddGroupSchema["wasteTypes"][0]) => {
    setValue(
      "wasteTypes",
      selectedWasteTypes.includes(type)
        ? selectedWasteTypes.filter((t) => t !== type)
        : [...selectedWasteTypes, type],
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: TaddGroupSchema) => {
    updateGroup(data);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "white" }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Edit group informations",
          headerTitleAlign: "center",
        }}
      />
      {/* Basic Information Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter group name"
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Zone Name</Text>
        <Controller
          control={control}
          name="zoneName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.zoneName && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter zone name"
            />
          )}
        />
        {errors.zoneName && (
          <Text style={styles.errorText}>{errors.zoneName.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter group description"
              multiline
              numberOfLines={3}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
      </View>

      {/* Waste Type Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Waste Types</Text>
        <View style={styles.wasteTypeContainer}>
          {Object.entries(WASTE_TYPES).map(([type, value]) => {
            const isSelected = selectedWasteTypes.includes(type);
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.wasteTypeButton,
                  isSelected && styles.wasteTypeButtonSelected,
                ]}
                onPress={() => toggleWasteType(type)}
              >
                <Text
                  style={[
                    styles.wasteTypeText,
                    isSelected && styles.wasteTypeTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.wasteTypes && (
          <Text style={styles.errorText}>
            At least one waste type is required
          </Text>
        )}
      </View>

      {/* Map Section with Radius */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Coverage Area</Text>
        <Text style={styles.subLabel}>
          Tap on the map to set the center point
        </Text>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: lat || 0,
              longitude: long || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {lat && long && (
              <>
                <Marker coordinate={{ latitude: lat, longitude: long }} />
                <Circle
                  center={{ latitude: lat, longitude: long }}
                  radius={radius}
                  strokeColor={Colors.light.tint}
                  fillColor={`${Colors.light.tint}20`}
                  strokeWidth={2}
                />
              </>
            )}
          </MapView>
        </View>

        {/* Radius Controls */}
        {showRadiusControls && (
          <View style={styles.radiusControls}>
            <Text style={styles.label}>Coverage Radius: {radius}m</Text>
            <Slider
              minimumValue={100}
              maximumValue={5000}
              step={100}
              value={radius}
              onValueChange={(value) => setValue("radius", value)}
              minimumTrackTintColor={Colors.light.tint}
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor={Colors.light.tint}
            />
          </View>
        )}

        <View style={styles.coordinateDisplay}>
          <Text style={styles.coordinateText}>
            Lat: {lat?.toFixed(6) || "Not selected"}
          </Text>
          <Text style={styles.coordinateText}>
            Lng: {long?.toFixed(6) || "Not selected"}
          </Text>
          {showRadiusControls && (
            <Text style={styles.coordinateText}>Radius: {radius}m</Text>
          )}
        </View>
        {(errors.lat || errors.long) && (
          <Text style={styles.errorText}>
            Please select a location on the map
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={isPending}
        >
          <Text style={[styles.buttonText, { color: Colors.light.tint }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Edit Group</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "white",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
    color: "#333",
    fontSize: 16,
  },
  subLabel: {
    marginBottom: 8,
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
  wasteTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  wasteTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  wasteTypeButtonSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  wasteTypeText: {
    color: "#333",
    fontSize: 14,
  },
  wasteTypeTextSelected: {
    color: "white",
    fontWeight: "500",
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
  radiusControls: {
    marginTop: 15,
    paddingHorizontal: 5,
  },
  coordinateDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  coordinateText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 5,
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

export default AddGroupScreen;
