import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/utils/authContext";
import { ReactQueryProvider } from "@/utils/queryClient";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ReactQueryProvider>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, animation: "none" }}
              />

              <Stack.Screen
                name="(auth)/signIn"
                options={{ headerShown: false, animation: "none" }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>

            <StatusBar translucent style="auto" />
          </ThemeProvider>
        </AuthProvider>
      </ReactQueryProvider>

      <Toast swipeable={true} position="top" visibilityTime={2000} />
    </>
  );
}
