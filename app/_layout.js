import { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "../contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts(Ionicons.font);

  if (showSplash || !fontsLoaded) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={styles.container}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
