import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none", // Esconde as tabs
        },
        contentStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="list" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
