import { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
