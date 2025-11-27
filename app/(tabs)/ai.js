import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export default function AIScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [generatedList, setGeneratedList] = useState(null);

  const generateShoppingList = async () => {
    if (!prompt.trim()) {
      setError("Por favor, descreva o que você precisa");
      return;
    }

    if (!GEMINI_API_KEY) {
      setError("API Key do Gemini não configurada. Configure no arquivo .env");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");
    setGeneratedList(null);

    try {
      const systemPrompt = `Você é um assistente de lista de compras. Baseado na descrição do usuário, gere uma lista de compras organizada.

IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato:
{
  "listName": "nome sugerido para a lista",
  "items": [
    {
      "name": "nome do item",
      "quantity": número,
      "category": "categoria do item"
    }
  ]
}

Categorias válidas: "Frutas e Verduras", "Carnes", "Laticínios", "Bebidas", "Higiene", "Limpeza", "Padaria", "Congelados", "Outros"

Descrição do usuário: ${prompt}`;

      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Falha ao gerar lista. Verifique sua API key.");
      }

      const data = await apiResponse.json();
      const textResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setResponse(textResponse);

      // Tentar extrair JSON da resposta
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedList = JSON.parse(jsonMatch[0]);
        setGeneratedList(parsedList);
      } else {
        setError("Não foi possível processar a resposta da IA");
      }
    } catch (err) {
      console.error("Erro ao gerar lista:", err);
      setError(err.message || "Erro ao gerar lista. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveList = () => {
    if (generatedList) {
      // TODO: Implementar salvamento da lista
      // Por enquanto, apenas mostra mensagem
      setError("");
      setResponse("Lista salva com sucesso! (funcionalidade em desenvolvimento)");
      setGeneratedList(null);
      setPrompt("");
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
    setError("");
    setGeneratedList(null);
  };

  const suggestedPrompts = [
    "Café da manhã para a semana",
    "Churrasco para 10 pessoas",
    "Almoço saudável",
    "Ingredientes para bolo de chocolate",
    "Compras do mês",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="sparkles" size={32} color="#8b5cf6" />
            </View>
            <Text style={styles.userName}>Olá, {user?.name}!</Text>
          </View>
          <Text style={styles.title}>Assistente IA</Text>
          <Text style={styles.subtitle}>
            Descreva o que você precisa e a IA criará sua lista de compras
          </Text>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que você precisa?</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color="#71717a"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Ex: Ingredientes para massa carbonara"
              placeholderTextColor="#71717a"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>

          {/* Suggested Prompts */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Sugestões:</Text>
            <View style={styles.suggestionsGrid}>
              {suggestedPrompts.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => setPrompt(suggestion)}
                  disabled={loading}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.generateButton,
                (!prompt.trim() || loading) && styles.buttonDisabled,
              ]}
              onPress={generateShoppingList}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Gerar Lista</Text>
                </>
              )}
            </TouchableOpacity>

            {(response || error) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                disabled={loading}
              >
                <Ionicons name="close-circle-outline" size={20} color="#71717a" />
                <Text style={styles.clearButtonText}>Limpar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Generated List */}
        {generatedList && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.resultTitle}>Lista Gerada!</Text>
            </View>

            <View style={styles.listNameContainer}>
              <Text style={styles.listName}>{generatedList.listName}</Text>
            </View>

            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>
                {generatedList.items.length} itens
              </Text>
              {generatedList.items.map((item, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemCheckbox}>
                      <Ionicons name="cart-outline" size={16} color="#8b5cf6" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveList}
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar Lista</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#8b5cf6" />
          <Text style={styles.infoText}>
            A IA analisa sua descrição e sugere itens com quantidades e
            categorias organizadas
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#71717a",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 16,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#27272a",
    minHeight: 100,
    textAlignVertical: "top",
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  suggestionChip: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#27272a",
    margin: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  buttonContainer: {
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: "#8b5cf6",
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  clearButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
    marginTop: 8,
  },
  clearButtonText: {
    color: "#71717a",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc262620",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  resultCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#10b981",
    marginLeft: 12,
  },
  listNameContainer: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  listName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: "#71717a",
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8b5cf6",
  },
  saveButton: {
    backgroundColor: "#8b5cf6",
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
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
});
