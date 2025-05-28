import InputError from "@/components/form/inputError";
import SubmitButton from "@/components/form/submitButton";
import { useAddCollector } from "@/hooks/mutations/useCollectorMutations";
import { useEditProfile } from "@/hooks/mutations/useProfileApi";
import {
  addCollectorSchema,
  editProfileSchema,
  type TaddCollectorSchema,
  type TeditProfileSchema,
} from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const AddCollector = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaddCollectorSchema>({
    resolver: zodResolver(addCollectorSchema),
  });

  const { mutate, isPending } = useAddCollector();
  const onSubmit = (data: TaddCollectorSchema) => {
    mutate(data);
  };
  return (
    // <Modal
    //   visible={show}
    //   animationType="slide"
    //   transparent={false}
    //   onRequestClose={() => setShow(false)}
    // >
    <View style={styles.modalContainer}>
      <Stack.Screen options={{ headerShown: true, title: "Add Collector" }} />
      <ScrollView style={styles.modalContent}>
        {/* <View style={styles.editAvatarContainer}>
            <Image source={editData.profileImage} style={styles.editAvatar} />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View> */}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <Controller
            name="fullName"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="Jogn Doe"
                onBlur={onBlur}
                autoCapitalize="none"
                value={value}
                onChangeText={(value) => onChange(value)}
              />
            )}
          />
          <InputError
            show={!!errors.fullName}
            message={errors.fullName?.message}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="email"
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={(value) => onChange(value)}
              />
            )}
          />
          <InputError show={!!errors.email} message={errors.email?.message} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="email"
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="phone-pad"
                value={value}
                onChangeText={(value) => onChange(value)}
              />
            )}
          />
          <InputError
            show={!!errors.phoneNumber}
            message={errors.phoneNumber?.message}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Adress</Text>
          <Controller
            name="adress"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="street 18"
                onBlur={onBlur}
                autoCapitalize="none"
                value={value}
                onChangeText={(value) => onChange(value)}
              />
            )}
          />
          <InputError show={!!errors.adress} message={errors.adress?.message} />
        </View>

        <SubmitButton
          title="Save"
          isPending={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </View>
    // </Modal>
  );
};

export default AddCollector;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#2e7d32",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#2e7d32",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  adminName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  adminTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  settingsSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  languageSelection: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    fontSize: 16,
    color: "#666",
    marginRight: 5,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContent: {
    padding: 20,
  },
  editAvatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  editAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  changePhotoButton: {
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  changePhotoText: {
    color: "#2e7d32",
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  passwordModalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    padding: 20,
  },
  passwordModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  passwordModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  passwordInputContainer: {
    marginBottom: 20,
  },
  passwordInputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  updatePasswordButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  updatePasswordButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
