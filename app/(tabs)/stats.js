import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StatsScreen() {
  const router = useRouter();

  const stats = [
    { label: "Total de Listas", value: "0", icon: "list", color: "#8b5cf6" },
    { label: "Total de Itens", value: "0", icon: "cart", color: "#ec4899" },
    { label: "Itens Concluídos", value: "0", icon: "checkmark-circle", color: "#10b981" },
    { label: "Taxa de Conclusão", value: "0%", icon: "stats-chart", color: "#f59e0b" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estatísticas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: `${stat.color}20` },
                ]}
              >
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#8b5cf6" />
          <Text style={styles.infoText}>
            As estatísticas serão atualizadas conforme você usa o app
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#71717a",
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    // gap: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  infoText: {
    fontSize: 12,
    color: "#71717a",
    flex: 1,
    lineHeight: 18,
  },
});
