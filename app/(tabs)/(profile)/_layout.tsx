import { Stack } from "expo-router";

export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="editProfile"
        options={{
          headerShown: true,
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          headerShown: true,
          title: "Change password",
        }}
      />
    </Stack>
  );
};
