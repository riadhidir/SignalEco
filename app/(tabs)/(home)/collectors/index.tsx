import Error from "@/components/error";
import { Colors } from "@/constants/Colors";
import { useGetCollectors } from "@/hooks/queries/useCollectorQueries";
import { useDebounce } from "@/hooks/useDebounce";
import type { GetCollectors } from "@/utils/types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  Link,
  useLocalSearchParams,
  useRouter,
  type ExternalPathString,
  Stack,
} from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLUMNS = 3;
const GRID_SPACING = 16;
const AVATAR_SIZE = 80;

const WorkerGrid = () => {
  const { push, replace } = useRouter();
  const { mode, returnTo, selectedIds } = useLocalSearchParams<{
    mode?: "picker";
    returnTo?: string;
    selectedIds?: string;
  }>();

  const isPickerMode = mode === "picker";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>([]);
  const debouncedSearch = useDebounce<string>(searchQuery);

  //initialize selected collectors from params
  useEffect(() => {
    if (isPickerMode && selectedIds) {
      try {
        const ids = JSON.parse(selectedIds);
        console.log({ ids });
        if (Array.isArray(ids)) {
          setSelectedCollectors(ids);
        }
      } catch (e) {
        console.error("Error parsing selectedIds", e);
      }
    }
  }, [selectedIds]);

  const page = 1;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    status,
    refetch,
  } = useGetCollectors({ page, name: debouncedSearch });

  const collectors = React.useMemo(
    () => data?.pages.flatMap((page) => page.data.products) || [],
    [data]
  );

  const windowWidth = Dimensions.get("window").width;
  const itemWidth = (windowWidth - GRID_SPACING * (COLUMNS + 1)) / COLUMNS;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const toggleCollectorSelection = (id: string) => {
    setSelectedCollectors((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleConfirmSelection = () => {
    if (returnTo) {
      replace({
        pathname: returnTo as ExternalPathString,
        params: {
          selectedIds: JSON.stringify(selectedCollectors),
        },
      });
    }
  };

  const renderItem = ({ item }: { item: GetCollectors["data"][0] }) => (
    <Pressable
      style={[
        styles.gridItem,
        { width: itemWidth },
        isPickerMode &&
          selectedCollectors.includes(item.id) &&
          styles.selectedItem,
      ]}
      onPress={() =>
        isPickerMode
          ? toggleCollectorSelection(item.id)
          : push(`/collectors/${item.id}/details`)
      }
      android_ripple={{ color: "#e0f7fa" }}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: `https://app.profidel.com.dz/${item.productImages[0]?.previewPath}`,
          }}
          style={styles.workerImage}
          defaultSource={require("@/assets/images/avatar.png")}
        />
      </View>
      <Text style={styles.workerName} numberOfLines={1}>
        {item.name}
      </Text>
      {isPickerMode && selectedCollectors.includes(item.id) && (
        <View style={styles.selectionBadge}>
          <MaterialIcons name="check" size={20} color="white" />
        </View>
      )}
    </Pressable>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#00796B" />
      </View>
    );
  };

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
                onPress={() => push("/(tabs)/(home)/collectors/add")}
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
            Select Collectors ({selectedCollectors.length} selected)
          </Text>
          {selectedCollectors.length > 0 && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmSelection}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={collectors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={styles.gridContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListFooterComponent={renderFooter}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: GRID_SPACING,
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
  gridContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  gridItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: GRID_SPACING,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: "#E0F7FA",
    borderWidth: 2,
    borderColor: "#00796B",
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  selectionBadge: {
    position: "absolute",

    right: -7,
    top: -7,
    backgroundColor: "#00796B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  workerImage: {
    width: "100%",
    height: "100%",
  },
  workerName: {
    fontSize: 14,
    flexWrap: "wrap",
    flexShrink: 1,
    fontWeight: "600",
    color: "#00796B",
    marginBottom: 4,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
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
});

export default WorkerGrid;
