import { SplashScreen, useRouter } from "expo-router";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Role } from "./types";

SplashScreen.preventAutoHideAsync();
type AuthState = {
  session: {
    isLoggedIn: boolean;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    avatar: string;
    role?: Role;
  };
  isReady: boolean;
  logIn: (sessionData: AuthState["session"]) => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  session: {
    isLoggedIn: false,
    avatar: "",
  },
  isReady: false,
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { replace, push } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState<AuthState["session"]>({
    isLoggedIn: false,
    avatar: "",
  });
  const [isReady, setIsReady] = useState(false);
  // const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
  const storeAuthState = async (newState: AuthState["session"]) => {
    try {
      await AsyncStorage.setItem("auth", JSON.stringify(newState));
    } catch (error) {
      console.log("failed to persiste new auth state into local storage");
    }
  };

  const logIn = (sessionData: AuthState["session"]) => {
    //setIsLoggedIn(true);
    setSession(sessionData);
    storeAuthState(sessionData);
    console.log("redirecting...");
    push("/(tabs)/(home)");
  };

  const logOut = () => {
    setSession({
      isLoggedIn: false,
      avatar: "",
      accessToken: undefined,
      refreshToken: undefined,
      email: undefined,
      role: undefined,
    });
    storeAuthState({
      isLoggedIn: false,
      avatar: "",
      accessToken: undefined,
      refreshToken: undefined,
      email: undefined,
      role: undefined,
    });
    replace("/(auth)/signIn");
  };

  useEffect(() => {
    const getAuthStateFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem("auth");
        if (value) {
          const auth = JSON.parse(value);
          setSession(auth);
          //setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("failed to retrieve auth state from storage");
      }

      setIsReady(true);
    };
    getAuthStateFromStorage();
  }, []);
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);
  return (
    <AuthContext.Provider value={{ session, isReady, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
