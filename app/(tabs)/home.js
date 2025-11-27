import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllLists } from "../../utils/storage";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLists: 0,
    totalItems: 0,
    completionRate: 0,
  });

  // Carregar estatísticas quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Simular delay de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lists = await getAllLists();
      const totalLists = lists.length;
      const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
      const completedItems = lists.reduce(
        (sum, list) => sum + list.items.filter((item) => item.completed).length,
        0
      );
      const completionRate =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      setStats({
        totalLists,
        totalItems,
        completionRate,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: "lists",
      title: "Minhas Listas",
      subtitle: "Gerencie suas listas",
      icon: "list",
      color: "#8b5cf6",
      route: "/(tabs)/lists",
    },
    {
      id: "ai",
      title: "Assistente IA",
      subtitle: "Crie listas com IA",
      icon: "sparkles",
      color: "#ec4899",
      route: "/(tabs)/ai",
    },
    {
      id: "stats",
      title: "Estatísticas",
      subtitle: "Veja seus dados",
      icon: "stats-chart",
      color: "#10b981",
      route: "/(tabs)/stats",
    },
    {
      id: "profile",
      title: "Perfil",
      subtitle: "Configurações",
      icon: "person",
      color: "#f59e0b",
      route: "/(tabs)/profile",
    },
  ];

  const quickStats = [
    {
      id: "lists",
      value: stats.totalLists.toString(),
      label: "Listas",
      icon: "list",
      color: "#8b5cf6",
    },
    {
      id: "items",
      value: stats.totalItems.toString(),
      label: "Itens",
      icon: "cart",
      color: "#ec4899",
    },
    {
      id: "completed",
      value: `${stats.completionRate}%`,
      label: "Concluído",
      icon: "checkmark-circle",
      color: "#10b981",
    },
  ];

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      {/* Stats Skeleton */}
      <View style={styles.statsContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.statCard}>
            <View style={[styles.skeleton, styles.skeletonIcon]} />
            <View style={[styles.skeleton, styles.skeletonValue]} />
            <View style={[styles.skeleton, styles.skeletonLabel]} />
          </View>
        ))}
      </View>

      {/* Welcome Card Skeleton */}
      <View style={styles.welcomeCard}>
        <View style={[styles.skeleton, styles.skeletonWelcomeIcon]} />
        <View style={[styles.skeleton, styles.skeletonTitle]} />
        <View style={[styles.skeleton, styles.skeletonText]} />
        <View style={[styles.skeleton, styles.skeletonText, { width: '60%' }]} />
      </View>

      {/* Menu Grid Skeleton */}
      <View style={styles.menuContainer}>
        <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
        <View style={styles.menuGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.menuItem}>
              <View style={[styles.skeleton, styles.skeletonMenuIcon]} />
              <View style={[styles.skeleton, styles.skeletonMenuTitle]} />
              <View style={[styles.skeleton, styles.skeletonMenuSubtitle]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Olá,</Text>
              <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#8b5cf6" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <SkeletonLoader />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#8b5cf6" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {quickStats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: `${stat.color}20` },
              ]}
            >
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIcon}>
          <Ionicons name="cart" size={32} color="#8b5cf6" />
        </View>
        <Text style={styles.welcomeTitle}>Lista de Compras</Text>
        <Text style={styles.welcomeText}>
          Organize suas compras de forma inteligente com o poder da IA
        </Text>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${item.color}20` },
                ]}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/create")}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="add-circle" size={24} color="#8b5cf6" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Nova Lista</Text>
              <Text style={styles.actionSubtitle}>Criar lista manualmente</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/ai")}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconContainer, { backgroundColor: "#ec489920" }]}>
              <Ionicons name="sparkles" size={24} color="#ec4899" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Gerar com IA</Text>
              <Text style={styles.actionSubtitle}>Deixe a IA ajudar você</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#8b5cf6" />
        <Text style={styles.infoText}>
          Seus dados ficam salvos localmente e sincronizam automaticamente
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#71717a",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "500",
    color: "#ffffff",
  },
  profileButton: {
    width: 48,
    height: 48,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
    marginHorizontal: 6,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#71717a",
  },
  welcomeCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "#0f0f0f",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 20,
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  menuItem: {
    width: (width - 60) / 2,
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#27272a",
    margin: 6,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#71717a",
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 12,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8b5cf620",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#71717a",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  infoText: {
    fontSize: 12,
    color: "#71717a",
    flex: 1,
    lineHeight: 18,
    marginLeft: 12,
  },
  // Skeleton Styles
  skeletonContainer: {
    flex: 1,
  },
  skeleton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonValue: {
    width: 60,
    height: 24,
    marginBottom: 8,
  },
  skeletonLabel: {
    width: 80,
    height: 14,
  },
  skeletonWelcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
    alignSelf: "center",
  },
  skeletonTitle: {
    width: 200,
    height: 24,
    marginBottom: 12,
    alignSelf: "center",
  },
  skeletonText: {
    width: "100%",
    height: 16,
    marginBottom: 8,
  },
  skeletonSectionTitle: {
    width: 150,
    height: 20,
    marginBottom: 16,
  },
  skeletonMenuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginBottom: 12,
  },
  skeletonMenuTitle: {
    width: "80%",
    height: 18,
    marginBottom: 8,
  },
  skeletonMenuSubtitle: {
    width: "60%",
    height: 14,
  },
});
