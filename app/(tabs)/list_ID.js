import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getListById, updateList, deleteList } from "../../utils/storage";

export default function ListScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [list, setList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Carregar lista quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadList();
      }
    }, [id])
  );

  const loadList = async () => {
    try {
      const loadedList = await getListById(id);
      if (loadedList) {
        setList(loadedList);
      } else {
        Alert.alert("Erro", "Lista não encontrada");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert("Atenção", "Digite o nome do item");
      return;
    }

    const newItem = {
      id: Date.now().toString() + Math.random(),
      name: newItemName.trim(),
      completed: false,
    };

    const updatedItems = [...(list.items || []), newItem];
    const result = await updateList(id, { items: updatedItems });

    if (result.success) {
      setList(result.list);
      setNewItemName("");
      setModalVisible(false);
    } else {
      Alert.alert("Erro", "Não foi possível adicionar o item");
    }
  };

  const handleToggleItem = async (itemId) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const result = await updateList(id, { items: updatedItems });
    if (result.success) {
      setList(result.list);
    }
  };

  const handleDeleteItem = async (itemId) => {
    Alert.alert(
      "Excluir Item",
      "Tem certeza que deseja excluir este item?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Deletando item:", itemId);
              console.log("Itens antes:", list.items.length);
              
              const updatedItems = list.items.filter((item) => item.id !== itemId);
              console.log("Itens depois do filtro:", updatedItems.length);
              
              const result = await updateList(id, { items: updatedItems });
              console.log("Resultado da atualização:", result);
              
              if (result.success) {
                setList(result.list);
                Alert.alert("Sucesso", "Item excluído com sucesso!");
              } else {
                Alert.alert("Erro", result.message || "Não foi possível excluir o item");
              }
            } catch (error) {
              console.error("Erro ao deletar item:", error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir o item");
            }
          },
        },
      ]
    );
  };

  const handleDeleteList = () => {
    Alert.alert(
      "Excluir Lista",
      `Tem certeza que deseja excluir "${list?.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const result = await deleteList(id);
            if (result.success) {
              router.back();
            } else {
              Alert.alert("Erro", "Não foi possível excluir a lista");
            }
          },
        },
      ]
    );
  };

  const getCompletedCount = () => {
    if (!list?.items) return 0;
    return list.items.filter((item) => item.completed).length;
  };

  if (!list) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carregando...</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{list.name}</Text>
          <Text style={styles.headerSubtitle}>
            {getCompletedCount()}/{list.items?.length || 0} itens
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteList}>
          <Ionicons name="trash-outline" size={22} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {list.items?.length > 0 ? (
          <View style={styles.itemsContainer}>
            {list.items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity
                  style={styles.itemContent}
                  onPress={() => handleToggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.itemName,
                      item.completed && styles.itemNameCompleted,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => handleDeleteItem(item.id)}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cart-outline" size={64} color="#71717a" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum item ainda</Text>
            <Text style={styles.emptyText}>
              Adicione itens à sua lista de compras
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Modal para adicionar item */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Item</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do item"
              placeholderTextColor="#71717a"
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewItemName("");
                }}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnConfirm]}
                onPress={handleAddItem}
              >
                <Text style={styles.btnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 2,
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  itemsContainer: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#8b5cf6",
  },
  itemName: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
  },
  itemNameCompleted: {
    textDecorationLine: "line-through",
    color: "#71717a",
  },
  deleteItemButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27272a",
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
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  btnConfirm: {
    backgroundColor: "#8b5cf6",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
