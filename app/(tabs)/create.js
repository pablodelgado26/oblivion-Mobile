import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { saveList } from "../../utils/storage";

export default function CreateScreen() {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: "1" }]);
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems([...items, { name: "", quantity: "1" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    // Validações
    if (!listName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a lista");
      return;
    }

    // Filtrar itens com nome preenchido
    const validItems = items.filter((item) => item.name.trim() !== "");

    if (validItems.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos um item à lista");
      return;
    }

    setSaving(true);

    try {
      const listData = {
        name: listName.trim(),
        items: validItems.map((item) => ({
          name: item.name.trim(),
          quantity: parseInt(item.quantity) || 1,
          category: "Outros", // Categoria padrão
        })),
      };

      const result = await saveList(listData);

      if (result.success) {
        Alert.alert("Sucesso", "Lista criada com sucesso!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Erro", result.message || "Não foi possível salvar a lista");
        setSaving(false);
      }
    } catch (error) {
      console.error("Erro ao salvar lista:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a lista");
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Lista</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* List Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Nome da Lista</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Compras do Mês"
            placeholderTextColor="#71717a"
            value={listName}
            onChangeText={setListName}
          />
        </View>

        {/* Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Itens</Text>
            <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
              <Ionicons name="add-circle" size={20} color="#8b5cf6" />
              <Text style={styles.addItemText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInputsContainer}>
                <TextInput
                  style={[styles.input, styles.itemNameInput]}
                  placeholder="Nome do item"
                  placeholderTextColor="#71717a"
                  value={item.name}
                  onChangeText={(value) => updateItem(index, "name", value)}
                />
                <View style={styles.itemSpacer} />
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Qtd"
                  placeholderTextColor="#71717a"
                  value={item.quantity}
                  onChangeText={(value) => updateItem(index, "quantity", value)}
                  keyboardType="numeric"
                />
              </View>
              {items.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: "#8b5cf6",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addItemText: {
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  itemInputsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemSpacer: {
    width: 12,
  },
  itemNameInput: {
    flex: 1,
  },
  quantityInput: {
    width: 70,
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
