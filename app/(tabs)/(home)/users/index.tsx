import Error from "@/components/error";
import { useGetUsers } from "@/hooks/queries/useUsersQueries";
import { useDebounce } from "@/hooks/useDebounce";
import type { GetCollectors } from "@/utils/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const { push } = useRouter();
  const page = 1;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce<string>(searchQuery);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    status,
    refetch,
  } = useGetUsers({ page, name: debouncedSearch });

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

  const renderItem = ({ item }: { item: GetCollectors["data"][0] }) => (
    <Pressable
      style={[styles.gridItem, { width: itemWidth }]}
      onPress={() => push(`/collectors/${item.id}/details`)}
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
  header: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#546E7A",
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
    elevation: 3,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#546E7A",
    marginLeft: 4,
  },
  workerLocation: {
    fontSize: 12,
    color: "#90A4AE",
    textAlign: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00796B",
    padding: 14,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#00796B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default WorkerGrid;
