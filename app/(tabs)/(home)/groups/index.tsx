import Error from "@/components/error";
import { Colors } from "@/constants/Colors";
import { useGetGroups } from "@/hooks/queries/useGroupQueries";
import { useDebounce } from "@/hooks/useDebounce";
import type { Group } from "@/utils/types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useStateForPath } from "@react-navigation/native";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  type RelativePathString,
} from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GroupsScreen = () => {
  const { push, replace } = useRouter();
  const { mode, returnTo, selectedId } = useLocalSearchParams<{
    mode?: "picker";
    returnTo?: string;
    selectedId?: string;
  }>();

  const isPickerMode = mode === "picker";
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce<string>(searchQuery);

  //initialize selected groups from params

  useEffect(() => {
    if (isPickerMode && selectedId) {
      try {
        setSelectedGroup(selectedId);
      } catch (e) {
        console.log("failed to parse params groups id ", e);
      }
    }
  }, [selectedId]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    status,
    refetch,
  } = useGetGroups({ page: 1, name: debouncedSearch });
  const groups = useMemo(
    // () => data?.pages.flatMap((page) => page.data.products) || [],
    () => data?.pages.flatMap((page) => page) || [],

    [data]
  );

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroup((prev) => (prev === groupId ? "" : groupId));
  };

  const handleConfirmSelection = () => {
    if (returnTo) {
      replace({
        pathname: returnTo as RelativePathString,
        params: {
          selectedId: selectedGroup,
        },
      });
    }
  };
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#00796B" />
      </View>
    );
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    // <TouchableOpacity
    //   style={styles.groupCard}
    //   onPress={() => push(`/groups/${item.id}`)}
    // >

    <Pressable
      style={[
        styles.groupCard,

        isPickerMode && selectedGroup === item.id && styles.selectedItem,
      ]}
      onPress={() =>
        isPickerMode
          ? toggleGroupSelection(item.id)
          : push(`/groups/${item.id}`)
      }
      android_ripple={{ color: "#e0f7fa" }}
    >
      <View style={styles.groupImageContainer}>
        <View style={styles.groupIcon}>
          <MaterialIcons name="group" size={32} color={Colors.light.tint} />
        </View>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.groupMeta}>
          <Text style={styles.groupMembers}>
            <MaterialIcons name="people" size={14} color="#666" />{" "}
            {item?.members?.length} collectors
          </Text>
          <Text style={styles.groupDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#999" />
    </Pressable>
    // {/* </TouchableOpacity> */}
  );

  if (status === "pending") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (status === "error") {
    return <Error retry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () =>
            !isPickerMode && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => push("/(tabs)/(home)/groups/add")}
                // onPress={() => setIsModalVisible(true)}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            ),
        }}
      />
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#00796B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search collectors..."
          placeholderTextColor="#90A4AE"
          onChangeText={setSearchQuery}
          value={searchQuery}
          autoCapitalize="none"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="clear" size={20} color="#90A4AE" />
          </TouchableOpacity>
        ) : null}
      </View>
      {isPickerMode && (
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>
            {selectedGroup ? "Group selected" : ""}
          </Text>
          {selectedGroup && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmSelection}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Groups List */}
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.light.tint}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons
              name="group"
              size={48}
              color={Colors.light.tint}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No groups created yet</Text>
            <Button
              title="Create First Group"
              //  onPress={() => setIsModalVisible(true)}
              // style={styles.emptyButton}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
  },
  confirmButton: {
    backgroundColor: "#00796B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
  selectedItem: {
    backgroundColor: "#E0F7FA",
    borderWidth: 2,
    borderColor: "#00796B",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECEFF1",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,

    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#263238",
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.light.text,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  groupCard: {
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
  groupImageContainer: {
    marginRight: 16,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(78, 125, 150, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  groupMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupMembers: {
    fontSize: 12,
    color: "#666",
  },
  groupDate: {
    fontSize: 12,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
  emptyButton: {
    width: "100%",
  },
});

export default GroupsScreen;
