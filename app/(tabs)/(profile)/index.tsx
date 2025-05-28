import Loading from "@/components/Loading";
import Error from "@/components/error";
import { useGetProfile } from "@/hooks/queries/useProfileQueries";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/utils";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { back, push } = useRouter();
  const { logOut } = useAuth();
  const [adminData, setAdminData] = useState({
    notificationsEnabled: true,
    profileImage: require("@/assets/images/avatar.png"), // Replace with your image
  });

  const { data, isError, isLoading, refetch } = useGetProfile("2");
  const toggleNotifications = () => {
    setAdminData({
      ...adminData,
      notificationsEnabled: !adminData.notificationsEnabled,
    });
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error retry={refetch} />;
  return (
    <LinearGradient colors={["#f5f5f5", "#e8f5e9"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => back()}>
            <MaterialIcons name="arrow-back" size={24} color="#2e7d32" />
          </TouchableOpacity>
          <Text style={styles.title}>Admin Profile</Text>
          <TouchableOpacity
            onPress={() => push("/(tabs)/(profile)/editProfile")}
          >
            <MaterialIcons name="edit" size={24} color="#2e7d32" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: data?.photo,
              }}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.adminName}>{data?.fullName}</Text>
          <Text style={styles.adminTitle}>System Administrator</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>142</Text>
              <Text style={styles.statLabel}>Requests</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>36</Text>
              <Text style={styles.statLabel}>Collectors</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Efficiency</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="email" size={20} color="#666" />
            <Text style={styles.infoText}>{data?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color="#666" />
            <Text style={styles.infoText}>{data?.phoneNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="date-range" size={20} color="#666" />
            <Text style={styles.infoText}>
              Joined {formatDate(data?.createdAt)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 name="id-card" size={18} color="#666" />
            <Text style={styles.infoText}>ID: {data?.id}</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={toggleNotifications}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name={
                  adminData.notificationsEnabled
                    ? "notifications"
                    : "notifications-off"
                }
                size={22}
                color="#666"
              />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <MaterialIcons
              name={adminData.notificationsEnabled ? "toggle-on" : "toggle-off"}
              size={30}
              color={adminData.notificationsEnabled ? "#2e7d32" : "#ccc"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => push("/(tabs)/(profile)/changePassword")}
          >
            <View style={styles.settingLeft}>
              <Feather name="lock" size={22} color="#666" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={22} color="#666" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.languageSelection}>
              <Text style={styles.languageText}>English</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => logOut()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

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

export default ProfileScreen;
