import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Alert,
  Button,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { addScheduleSchema, type TaddScheduleSchema } from "@/utils/schemas";
import type { Schedule } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateSchedule,
  useUpdateSchedule,
} from "@/hooks/mutations/useMapMutations";

const DAYS_OF_WEEK = [
  { id: "0", name: "Sunday" },
  { id: "1", name: "Monday" },
  { id: "2", name: "Tuesday" },
  { id: "3", name: "Wednesday" },
  { id: "4", name: "Thursday" },
  { id: "5", name: "Friday" },
  { id: "6", name: "Saturday" },
];

type Props = {
  collectionPointId: string;
  schedule?: Schedule;
};

const ScheduleFormModal = ({ collectionPointId, schedule }: Props) => {
  const [open, setOpen] = useState(false);

  // Convert time string (HH:mm) to Date object
  const timeStringToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date object to time string (HH:mm)
  const dateToTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<TaddScheduleSchema>({
    resolver: zodResolver(addScheduleSchema),
    defaultValues: {
      day: schedule?.day ?? "",
      startTime: schedule?.startTime ?? dateToTimeString(new Date()),
      endTime:
        schedule?.endTime ??
        dateToTimeString(
          new Date(new Date().setHours(new Date().getHours() + 1))
        ),
    },
    mode: "onChange",
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const selectedDay = watch("day");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("startTime", dateToTimeString(selectedDate), {
        shouldValidate: true,
      });
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("endTime", dateToTimeString(selectedDate), {
        shouldValidate: true,
      });
    }
  };

  const { mutate: createSchedule, isPending: isCreating } =
    useCreateSchedule(collectionPointId);
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule(
    schedule?.id || ""
  );
  const onSubmit = (data: TaddScheduleSchema) => {
    if (schedule) {
      updateSchedule(data);
    } else {
      createSchedule(data);
    }
    setOpen(false);
    reset();
  };

  return (
    <>
      {!schedule ? (
        <TouchableOpacity onPress={() => setOpen(true)}>
          <MaterialIcons
            name="add-circle"
            size={24}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={styles.dayActionButton}
        >
          <FontAwesome name="pencil" size={16} color="#666" />
        </TouchableOpacity>
      )}

      <Modal
        visible={open}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {schedule ? "Edit Schedule" : "Add Schedule"}
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.light.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Day Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Day</Text>
                <View style={styles.daysContainer}>
                  {DAYS_OF_WEEK.map((day) => (
                    <Controller
                      key={day.id}
                      control={control}
                      name="day"
                      render={({ field: { onChange, value } }) => (
                        <TouchableOpacity
                          style={[
                            styles.dayButton,
                            value === day.name && styles.dayButtonSelected,
                          ]}
                          onPress={() => onChange(day.name)}
                        >
                          <Text
                            style={[
                              styles.dayButtonText,
                              value === day.name &&
                                styles.dayButtonTextSelected,
                            ]}
                          >
                            {day.name.charAt(0)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ))}
                </View>
                {selectedDay && (
                  <Text style={styles.selectedDayText}>
                    {DAYS_OF_WEEK.find((d) => d.name === selectedDay)?.name}
                  </Text>
                )}
                {errors.day && (
                  <Text style={styles.errorText}>{errors.day.message}</Text>
                )}
              </View>

              {/* Start Time */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowStartPicker(true)}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={20}
                    color={Colors.light.tint}
                  />
                  <Text style={styles.timeText}>{startTime}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={timeStringToDate(startTime)}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleStartTimeChange}
                  />
                )}
                {errors.startTime && (
                  <Text style={styles.errorText}>
                    {errors.startTime.message}
                  </Text>
                )}
              </View>

              {/* End Time */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>End Time</Text>
                <TouchableOpacity
                  style={styles.timeInput}
                  onPress={() => setShowEndPicker(true)}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={20}
                    color={Colors.light.tint}
                  />
                  <Text style={styles.timeText}>{endTime}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={timeStringToDate(endTime)}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndTimeChange}
                  />
                )}
                {errors.endTime && (
                  <Text style={styles.errorText}>{errors.endTime.message}</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.cancelButton]}
                onPress={() => setOpen(false)}
                disabled={isCreating || isUpdating}
              >
                <Text style={[styles.buttonText, { color: Colors.light.tint }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.submitButton,
                  !isValid && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isCreating || isUpdating}
              >
                <Text style={styles.buttonText}>
                  {schedule ? "Update" : "Add"} Schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: Colors.light.text,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  dayButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  dayButtonTextSelected: {
    color: "white",
  },
  selectedDayText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "500",
    textAlign: "center",
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: Colors.light.tint,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "#f44336",
    marginTop: 4,
    fontSize: 14,
  },
  dayActionButton: {
    padding: 6,
  },
});

export default ScheduleFormModal;
