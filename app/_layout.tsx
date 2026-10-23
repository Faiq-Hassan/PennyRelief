import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from 'react-native-toast-message';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/Redux/store";

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
      <Provider store={store}>
        <Stack
          initialRouteName="index"
          screenOptions={{ headerShown: false }} // Ensure screenOptions is correctly applied
        >
          toast
          {/* Ensure all routes are correctly defined */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signUp" options={{ headerShown: false }} />
          <Stack.Screen name="otpVerification" options={{ headerShown: false }} />
          <Stack.Screen name="resendOtp" options={{ headerShown: false }} />
          <Stack.Screen name="personalInfo" options={{ headerShown: false }} />
          <Stack.Screen name="profileupdtae" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
        </Stack>
        <Toast/>
        <StatusBar style="auto" />
      </Provider>
    </>
  );
}
