import React, { useState } from "react";
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

export default function ListScreen() {
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [lists, setLists] = useState([
    {
      id: 1,
      title: "Compras do Mês",
      favorite: true,
      date: "30/10/2025",
      items: [
        { id: 1, name: "Arroz", completed: true },
        { id: 2, name: "Feijão", completed: true },
        { id: 3, name: "Macarrão", completed: false },
        { id: 4, name: "Óleo", completed: false },
      ],
    },
  ]);
  const [selectedList, setSelectedList] = useState(null);

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const updateList = (listId, updates) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          const items = updates.items || list.items;
          const completed = items.filter((i) => i.completed).length;
          const updatedList = {
            ...list,
            ...updates,
            items,
            totalItems: items.length,
            completedItems: completed,
            progress: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
          };
          // atualiza selectedList de forma consistente
          setSelectedList((cur) => (cur?.id === listId ? updatedList : cur));
          return updatedList;
        }
        return list;
      })
    );
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return Alert.alert("Atenção", "Digite um título");
    setLists((prev) => [
      ...prev,
      { id: prev.length + 1, title: newListTitle, favorite: false, date: new Date().toLocaleDateString("pt-BR"), items: [] },
    ]);
    setNewListTitle("");
    setModalVisible(false);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return Alert.alert("Atenção", "Digite o nome do item");
    if (!selectedList) return Alert.alert("Atenção", "Selecione uma lista primeiro");
    updateList(selectedList.id, (function () {
      const items = selectedList.items || [];
      return {
        items: [...items, { id: items.length + 1, name: newItemName, completed: false }],
      };
    })());
    setNewItemName("");
    setItemModalVisible(false);
  };

  const handleToggleItem = (itemId) => {
    if (!selectedList) return;
    updateList(selectedList.id, {
      items: selectedList.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    });
  };

  const handleDeleteItem = (itemId) => {
    if (!selectedList) return;
    console.log('handleDeleteItem called for item:', itemId, 'in list:', selectedList.id);
    Alert.alert("Excluir Item", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () =>
          updateList(selectedList.id, { items: selectedList.items.filter((item) => item.id !== itemId) }),
      },
    ]);
  };

  const handleDeleteList = () => {
    if (!selectedList) return;
    console.log('handleDeleteList called for list:', selectedList.id);
    Alert.alert("Excluir Lista", `Tem certeza que deseja excluir "${selectedList.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          setLists((prev) => prev.filter((list) => list.id !== selectedList.id));
          setSelectedList(null);
        },
      },
    ]);
  };

  const renderModal = (
    visible,
    setVisible,
    title,
    value,
    setValue,
    onConfirm,
    confirmText
  ) => (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={title}
            placeholderTextColor="#666"
            value={value}
            onChangeText={setValue}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.btnCancel]}
              onPress={() => {
                setVisible(false);
                setValue("");
              }}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.btnConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.btnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Listas</Text>
          <Text style={styles.subtitle}>
            {lists.length} {lists.length === 1 ? "lista" : "listas"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar listas..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>⚙</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>☷</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredLists.map((list) => {
          const completed = list.items?.filter((i) => i.completed).length || 0;
          const total = list.items?.length || 0;
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <TouchableOpacity
              key={list.id}
              style={styles.card}
              onPress={() => setSelectedList(list)}
              onLongPress={() => {
                Alert.alert(
                  "Excluir Lista",
                  `Tem certeza que deseja excluir "${list.title}"?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Excluir",
                      style: "destructive",
                      onPress: () => {
                        console.log('Deleting list (inline):', list.id, list.title);
                        setLists((prev) => prev.filter((l) => l.id !== list.id));
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {list.title} {list.favorite && "⭐"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Excluir Lista",
                      `Tem certeza que deseja excluir "${list.title}"?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: () => {
                            console.log('Deleting list (icon):', list.id, list.title);
                            setLists((prev) => prev.filter((l) => l.id !== list.id));
                          },
                        },
                      ]
                    );
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteListIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.date}>📅 {list.date}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
              <View style={styles.footer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{total} itens</Text>
                </View>
                <Text style={styles.count}>
                  {completed}/{total}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {renderModal(
        modalVisible,
        setModalVisible,
        "Nova Lista",
        newListTitle,
        setNewListTitle,
        handleAddList,
        "Criar"
      )}

      <Modal
        animationType="slide"
        visible={selectedList !== null}
        onRequestClose={() => setSelectedList(null)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedList(null)}>
              <Text style={styles.icon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{selectedList?.title}</Text>
              <Text style={styles.subtitle}>
                {selectedList?.items?.filter((i) => i.completed).length || 0}/
                {selectedList?.items?.length || 0} itens
              </Text>
            </View>
            <TouchableOpacity onPress={handleDeleteList}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {selectedList?.items?.length > 0 ? (
              selectedList.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => handleToggleItem(item.id)}
                  onLongPress={() => handleDeleteItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemRow}>
                    <View style={styles.checkbox}>
                      {item.completed && <Text style={styles.check}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.itemName,
                        item.completed && styles.completed,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteItem(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.deleteX}>🗑️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>
                  Nenhum item adicionado ainda
                </Text>
                <Text style={styles.emptySubtext}>
                  Toque no botão + para adicionar
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.fab}
            onPress={() => setItemModalVisible(true)}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {renderModal(
        itemModalVisible,
        setItemModalVisible,
        "Novo Item",
        newItemName,
        setNewItemName,
        handleAddItem,
        "Adicionar"
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: { flex: 1, marginLeft: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 2 },
  icon: { fontSize: 24, color: "#fff" },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: { fontSize: 28, color: "#fff", lineHeight: 28 },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#fff" },
  iconButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, paddingHorizontal: 20 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  deleteListIcon: {
    fontSize: 18,
    color: "#ff4444",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  date: { fontSize: 13, color: "#888", marginBottom: 15 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#7c3aed", borderRadius: 4 },
  progressText: {
    fontSize: 13,
    color: "#888",
    minWidth: 40,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: { fontSize: 12, color: "#888" },
  count: { fontSize: 14, color: "#fff", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", gap: 10 },
  modalButton: { flex: 1, padding: 15, borderRadius: 12, alignItems: "center" },
  btnCancel: { backgroundColor: "#2a2a2a" },
  btnConfirm: { backgroundColor: "#7c3aed" },
  btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  deleteIcon: { fontSize: 20 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7c3aed",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  check: { fontSize: 14, color: "#7c3aed", fontWeight: "bold" },
  itemName: { fontSize: 16, color: "#fff", flex: 1, marginLeft: 12 },
  completed: { textDecorationLine: "line-through", color: "#666" },
  deleteX: { fontSize: 18, color: "#ff4444" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#666", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#555" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabIcon: { fontSize: 32, color: "#fff" },
});
