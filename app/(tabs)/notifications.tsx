import Error from "@/components/error";
import { useGetNotifications } from "@/hooks/queries/useUtilsQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationsPage = () => {
  const page = 1;

  const {
    data,
    error,
    fetchNextPage,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    status,
  } = useGetNotifications({ userId: "1", page });

  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.data.products) || [],
    [data]
  );

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        {item.type === "new_request" && (
          <MaterialIcons name="assignment" size={24} color="#4CAF50" />
        )}
        {item.type === "payment" && (
          <MaterialIcons name="payment" size={24} color="#2196F3" />
        )}
        {item.type === "alert" && (
          <MaterialIcons name="warning" size={24} color="#FF9800" />
        )}
        {item.type === "system" && (
          <MaterialIcons name="info" size={24} color="#9C27B0" />
        )}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {formatDistanceToNow(new Date(), { addSuffix: true })}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#00796B" />
      </View>
    );
  };

  if (status === "pending" && !isRefetching) {
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
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#00796B"]}
            tintColor="#00796B"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("@/assets/images/empty-notifications.jpg")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll see important updates here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: "#00796B",
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "white",
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  notificationIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00796B",
    marginLeft: 8,
    marginTop: 8,
  },
  footer: {
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 8,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BDBDBD",
    textAlign: "center",
  },
});

export default NotificationsPage;
