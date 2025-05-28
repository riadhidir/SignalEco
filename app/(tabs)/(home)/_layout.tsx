import { Stack } from "expo-router";

export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen
        name="collectors/index"
        options={{
          headerShown: true,
          title: "Collectors",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="users/index"
        options={{
          headerShown: true,
          title: "Users",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="groups/index"
        options={{
          headerShown: true,
          title: "Groups",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};
