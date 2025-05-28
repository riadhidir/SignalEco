import {
  deleteGroup,
  removeCollectorFromGroup,
  addCollectorsToGroup,
} from "@/api/groups";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/deleteModal";
import Error from "@/components/error";
import { Colors } from "@/constants/Colors";
import { useAddCollectorsToGroup } from "@/hooks/mutations/useGroupsMutations";
import { useGetGroup } from "@/hooks/queries/useGroupQueries";
import { queryClient } from "@/utils/queryClient";
import { showSuccess } from "@/utils/toast";
import { formatDate } from "@/utils/utils";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

const WASTE_TYPE_COLORS = {
  PLASTIQUE: "#FF5722",
  MENAGER: "#795548",
  ELECTRONIQUE: "#607D8B",
  CHIMIQUE: "#9C27B0",
  MEDICAL: "#F44336",
  VERRE: "#4CAF50",
  AUTRE: "#9E9E9E",
  PAPIER: "#2196F3",
};

const GroupDetails = () => {
  const params = useLocalSearchParams<{ id?: string; selectedIds?: string }>();

  const {
    data: group,
    isError,
    isLoading,
    isRefetching,
    refetch,
  } = useGetGroup(params.id || "");

  const { mutateAsync: addCollectorsToGroup, isPending: isProcessing } =
    useAddCollectorsToGroup(params.id as string);

  useEffect(() => {
    const handleCollectorSelection = async () => {
      if (!params.selectedIds) return;

      const collectorIds = JSON.parse(params.selectedIds);

      await addCollectorsToGroup(collectorIds);
      await refetch();
      showSuccess("Group updated successfully");
      router.setParams({ selectedIds: undefined });
    };

    handleCollectorSelection();
  }, [params.selectedIds]);

  const handleEdit = () => {
    router.push(`/(tabs)/(home)/groups/${params.id}/edit`);
  };

  const handleAddMembers = () => {
    router.replace({
      pathname: "/(tabs)/(home)/collectors",
      params: {
        mode: "picker",
        returnTo: `/(tabs)/(home)/groups/${params.id}`,
        //   selectedIds: JSON.stringify(group?.members?.map((m) => m.id) || []),
        selectedIds: JSON.stringify(group?.members || []),
      },
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    // try {
    //   setIsProcessing(true);
    //   await removeCollectorFromGroup(memberId, params.id!);
    //   await refetch();
    // } catch (error) {
    //   Alert.alert("Error", "Failed to remove member from group");
    //   console.error("Error removing member:", error);
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error retry={refetch} />;
  if (!group) return <Error message="Group not found" retry={refetch} />;

  const formattedDate = formatDate(new Date(group.createdAt));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching || isProcessing}
          onRefresh={refetch}
          tintColor={Colors.light.tint}
        />
      }
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Group Details",
          headerTitleAlign: "center",
        }}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
          disabled={isProcessing}
        >
          <FontAwesome name="pencil" size={18} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <DeleteModal
          onConfirm={() => deleteGroup(params.id!)}
          queryKeyToInvalidate="groups"
          disabled={isProcessing}
        />
      </View>

      {/* Group Header */}
      <View style={styles.header}>
        <MaterialIcons name="groups" size={24} color={Colors.light.tint} />
        <Text style={styles.title}>{group.name}</Text>
      </View>

      {/* Group Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Group ID:</Text>
          <Text style={styles.detailValue}>{group.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Zone Name:</Text>
          <Text style={styles.detailValue}>{group.zoneName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>
            {group.description || "No description"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>{formattedDate}</Text>
        </View>

        {/* Waste Types */}
        {group.wasteTypes?.length && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Waste Types:</Text>
            <View style={styles.wasteTypesContainer}>
              {group.wasteTypes.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.wasteTypePill,
                    { backgroundColor: WASTE_TYPE_COLORS[type] || "#9E9E9E" },
                  ]}
                >
                  <Text style={styles.wasteTypeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Coverage Area:</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.detailValue}>
              Lat: {group.lat?.toFixed(6)}, Lng: {group.long?.toFixed(6)}
            </Text>
            <Text style={styles.detailValue}>Radius: {group.radius}m</Text>
          </View>
        </View>
      </View>

      {/* Members Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Members ({group.members?.length || 0})
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMembers}
          disabled={isProcessing}
        >
          <FontAwesome name="user-plus" size={16} color="white" />
          <Text style={styles.buttonText}>Add Members</Text>
        </TouchableOpacity>
      </View>

      {group.members?.length > 0 ? (
        <View style={styles.membersContainer}>
          {group.members.map((member) => (
            <View key={member?.id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <Entypo name="user" size={20} color={Colors.light.tint} />
                <View>
                  <Text style={styles.memberName}>{member?.name}</Text>
                  <Text style={styles.memberEmail}>{member?.email}</Text>
                </View>
              </View>
              <View style={styles.memberActions}>
                <DeleteModal
                  onConfirm={() => handleRemoveMember(member.id)}
                  trigger={
                    <FontAwesome name="trash" size={16} color="#f44336" />
                  }
                  triggerStyles={styles.memberActionButton}
                  queryKeyToInvalidate="groups"
                  disabled={isProcessing}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noMembersText}>No members in this group</Text>
      )}
    </ScrollView>
  );
};

export default GroupDetails;
const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  demoNotice: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  demoNoticeText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 15,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
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
    width: "40%",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    width: "60%",
    overflow: "scroll",
  },
  locationContainer: {
    width: "60%",
    flexDirection: "column",
  },
  wasteTypesContainer: {
    flexDirection: "row",
    width: "60%",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  wasteTypePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    textAlign: "center",
    borderRadius: 20,
    width: "auto",
  },
  wasteTypeText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
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
  membersContainer: {
    paddingHorizontal: 15,
  },
  memberCard: {
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
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  memberEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  memberActions: {
    flexDirection: "row",
    gap: 15,
  },
  memberActionButton: {
    padding: 6,
  },
  noMembersText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
