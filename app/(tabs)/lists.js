import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllLists, deleteList } from "../../utils/storage";

export default function ListsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar listas quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [])
  );

  const loadLists = async () => {
    try {
      const allLists = await getAllLists();
      setLists(allLists);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      loadLists(); // Recarregar listas após deletar
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
    }
  };

  const getCompletedCount = (items) => {
    return items.filter((item) => item.completed).length;
  };

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
        <Text style={styles.headerTitle}>Minhas Listas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/create")}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {lists.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="list-outline" size={64} color="#71717a" />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma lista ainda</Text>
            <Text style={styles.emptyText}>
              Crie sua primeira lista de compras
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Criar Lista</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listsContainer}>
            {lists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={styles.listCard}
                onPress={() => router.push(`/list?id=${list.id}`)}
              >
                <View style={styles.listHeader}>
                  <View style={styles.listIconContainer}>
                    <Ionicons name="cart" size={24} color="#8b5cf6" />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listStats}>
                      {getCompletedCount(list.items)}/{list.items.length} itens
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${
                          (getCompletedCount(list.items) / list.items.length) *
                          100
                        }%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.listDate}>
                  Criada em{" "}
                  {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 32,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    // gap: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  listsContainer: {
    paddingTop: 16,
  },
  listCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8b5cf620",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 4,
  },
  listStats: {
    fontSize: 14,
    color: "#71717a",
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#27272a",
    borderRadius: 2,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 2,
  },
  listDate: {
    fontSize: 12,
    color: "#71717a",
  },
});
