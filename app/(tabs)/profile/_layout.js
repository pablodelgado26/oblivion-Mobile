import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0A0A0A",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#0A0A0A",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacidade e Segurança",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Ajuda e Suporte",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "Sobre o App",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="Privacy_page"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
