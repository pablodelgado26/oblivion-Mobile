import { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "../contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
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
