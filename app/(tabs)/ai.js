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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { saveList } from "../../utils/storage";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
// Diagnóstico: loga se a API key está presente (não loga o valor)
const isApiKeyPresent = typeof GEMINI_API_KEY === "string" && GEMINI_API_KEY.length > 0;

export default function AIScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [generatedList, setGeneratedList] = useState(null);
  const [testing, setTesting] = useState(false);
  const [modelsInfo, setModelsInfo] = useState(null);
  const [saving, setSaving] = useState(false);

  const generateShoppingList = async () => {
    if (!prompt.trim()) {
      setError("Por favor, descreva o que você precisa");
      return;
    }

    if (!GEMINI_API_KEY) {
      setError(
        "API Key do Gemini não configurada. Crie um arquivo .env na raiz com EXPO_PUBLIC_GEMINI_API_KEY=SUACHAVE e reinicie o Expo."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");
    setGeneratedList(null);

    try {
      const systemPrompt = `Você é um assistente de lista de compras. Baseado na descrição do usuário, gere uma lista de compras organizada.

CRÍTICO: Sua resposta deve ser SOMENTE um objeto JSON válido, sem texto adicional antes ou depois. Não use markdown, não explique, apenas retorne o JSON puro no formato exato abaixo:

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

Descrição do usuário: ${prompt}

Responda SOMENTE com o JSON, nada mais.`;

      // Lista de modelos candidatos (ordem de preferência)
      // Atualizada com modelos gemini-2.x disponíveis em v1beta e v1
      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.5-pro",
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-2.0-flash-001",
        "gemini-2.5-flash-lite",
      ];

      // Tenta em v1beta primeiro, depois v1, até encontrar um que funcione
      const apiVersions = ["v1beta", "v1"];
      let apiResponse;
      let usedEndpoint = "";
      let lastErrorBody = null;

      for (const ver of apiVersions) {
        for (const model of candidateModels) {
          const endpoint = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          usedEndpoint = endpoint;
          apiResponse = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [ { parts: [ { text: systemPrompt } ] } ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
          });

          let bodyJson = null;
          try {
            bodyJson = await apiResponse.clone().json();
            lastErrorBody = bodyJson;
          } catch (_) {
            // ignora erro de parse para tentativas
          }

          if (apiResponse.ok) {
            break;
          }
        }
        if (apiResponse?.ok) break;
      }
      let data;
      try {
        data = await apiResponse.json();
      } catch (parseErr) {
        // Se falhar ao parsear, mostra o status texto
        const statusText = apiResponse.statusText || "Erro inesperado";
        throw new Error(`Falha ao ler resposta da IA: ${statusText}`);
      }

      if (!apiResponse.ok) {
        // Tenta extrair mensagem detalhada da API do Google
        const apiError = data?.error || lastErrorBody?.error;
        const apiMessage = apiError?.message || data?.message;
        const apiCode = apiError?.code || apiResponse.status;
        const redactedEndpoint = (usedEndpoint || "").replace(/key=[^&]+/, "key=***");
        const hint = !isApiKeyPresent
          ? "Chave ausente. Crie .env com EXPO_PUBLIC_GEMINI_API_KEY e reinicie."
          : apiCode === 403 || apiCode === 401
          ? "Chave inválida ou sem permissão. Revise sua API key e habilite a API Generative Language no Google Cloud."
          : apiCode === 404
          ? `Modelo/método não disponível. Endpoint tentado: ${redactedEndpoint}. Use o botão 'Testar Modelos' para ver quais estão disponíveis para sua chave.`
          : "Verifique a conectividade e tente novamente.";
        throw new Error(
          `Falha ao gerar lista (${apiCode}). ${apiMessage || ""} ${hint}`.trim()
        );
      }
      
      // Debug: log estrutura completa da resposta
      console.log("Resposta completa da API:", JSON.stringify(data, null, 2));
      
      // Extrair texto da resposta - suporta múltiplos formatos da API Gemini
      let textResponse = "";
      
      if (data.candidates?.[0]?.content) {
        const content = data.candidates[0].content;
        
        // Formato antigo: content.parts[0].text
        if (content.parts && Array.isArray(content.parts) && content.parts[0]?.text) {
          textResponse = content.parts[0].text;
        }
        // Formato novo: content.text direto
        else if (typeof content.text === "string") {
          textResponse = content.text;
        }
        // Fallback: se content é string diretamente
        else if (typeof content === "string") {
          textResponse = content;
        }
      }
      
      // Debug: verificar se textResponse está vazio
      if (!textResponse) {
        console.error("textResponse vazio. Estrutura completa:", JSON.stringify(data.candidates?.[0], null, 2));
        setError(`Resposta vazia da API. Debug: ${JSON.stringify({
          hasCandidates: !!data.candidates,
          candidatesLength: data.candidates?.length,
          hasContent: !!data.candidates?.[0]?.content,
          contentKeys: data.candidates?.[0]?.content ? Object.keys(data.candidates[0].content) : null,
        })}`);
        setLoading(false);
        return;
      }
      
      console.log("Texto bruto recebido:", textResponse);

      setResponse(textResponse);

      // Tentar extrair JSON da resposta
      // Alguns modelos envolvem em markdown (```json ... ```)
      let jsonText = textResponse;
      
      // Remove markdown code blocks se existirem
      const codeBlockMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1].trim();
      }
      
      // Tenta extrair o JSON
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedList = JSON.parse(jsonMatch[0]);
          
          // Valida estrutura básica
          if (parsedList.listName && Array.isArray(parsedList.items)) {
            setGeneratedList(parsedList);
          } else {
            console.warn("JSON inválido - estrutura incorreta:", parsedList);
            setError("Resposta da IA não contém listName e items válidos. Resposta bruta: " + textResponse.substring(0, 200));
          }
        } catch (parseErr) {
          console.error("Erro ao fazer parse do JSON:", parseErr);
          setError("JSON inválido na resposta. Resposta bruta: " + textResponse.substring(0, 200));
        }
      } else {
        console.warn("Nenhum JSON encontrado na resposta:", textResponse);
        setError("Não foi possível extrair JSON da resposta. Resposta bruta: " + textResponse.substring(0, 200));
      }
    } catch (err) {
      console.error("Erro ao gerar lista:", err);
      setError(err.message || "Erro ao gerar lista. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Testar modelos disponíveis para a chave atual
  const testModels = async () => {
    if (!GEMINI_API_KEY) {
      setError(
        "API Key do Gemini não configurada. Crie .env com EXPO_PUBLIC_GEMINI_API_KEY e reinicie."
      );
      return;
    }

    setTesting(true);
    setError("");
    setModelsInfo(null);

    const versions = ["v1beta", "v1"];
    const results = [];

    try {
      for (const ver of versions) {
        const url = `https://generativelanguage.googleapis.com/${ver}/models?key=${GEMINI_API_KEY}`;
        const res = await fetch(url);
        let data = null;
        try {
          data = await res.json();
        } catch (_) {}

        if (res.ok && data?.models) {
          results.push({ version: ver, models: data.models });
        } else {
          results.push({ version: ver, error: data?.error?.message || res.statusText });
        }
      }

      setModelsInfo(results);
    } catch (e) {
      setError(e?.message || "Falha ao testar modelos");
    } finally {
      setTesting(false);
    }
  };

  const handleSaveList = async () => {
    if (!generatedList || saving) return;

    try {
      setSaving(true);
      setError("");

      const listData = {
        name: (generatedList.listName || "Lista da IA").toString().trim(),
        items: (generatedList.items || []).map((item) => ({
          name: (item.name || "Item").toString().trim(),
          quantity: Number(item.quantity) || 1,
          category: item.category ? item.category.toString().trim() : "Outros",
        })),
      };

      const result = await saveList(listData);
      if (result.success) {
        Alert.alert("Sucesso", "Lista salva com sucesso!", [
          { text: "OK", onPress: () => router.push("/(tabs)/lists") },
        ]);
        setGeneratedList(null);
        setPrompt("");
      } else {
        Alert.alert("Erro", result.message || "Não foi possível salvar a lista");
      }
    } catch (e) {
      console.error("Falha ao salvar lista da IA:", e);
      Alert.alert("Erro", e?.message || "Falha ao salvar a lista");
    } finally {
      setSaving(false);
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
              <Ionicons name="flash-outline" size={32} color="#8b5cf6" />
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
                  <Ionicons name="flash-outline" size={20} color="#fff" />
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

            <TouchableOpacity
              style={[styles.testButton, (testing || loading) && styles.buttonDisabled]}
              onPress={testModels}
              disabled={testing || loading}
            >
              {testing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="cloud-outline" size={20} color="#fff" />
                  <Text style={styles.testButtonText}>Testar Modelos</Text>
                </>
              )}
            </TouchableOpacity>
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
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSaveList}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Salvar Lista</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Models Info */}
        {modelsInfo && (
          <View style={styles.modelsCard}>
            <Text style={styles.modelsTitle}>Modelos disponíveis</Text>
            {modelsInfo.map((group, idx) => (
              <View key={idx} style={styles.modelsGroup}>
                <Text style={styles.modelsVersion}>Versão {group.version}</Text>
                {group.error ? (
                  <Text style={styles.modelsError}>Erro: {group.error}</Text>
                ) : (
                  group.models.map((m, i) => (
                    <View key={i} style={styles.modelItem}>
                      <Ionicons name="cube-outline" size={16} color="#8b5cf6" />
                      <Text style={styles.modelName}>{m.name}</Text>
                    </View>
                  ))
                )}
              </View>
            ))}
            <Text style={styles.modelsHint}>
              Dica: use um dos modelos acima com generateContent. Se nenhum listar, verifique permissões da sua API key.
            </Text>
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
  testButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
    marginTop: 8,
    backgroundColor: "#18181b",
  },
  testButtonText: {
    color: "#ffffff",
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
  modelsCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  modelsTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 12,
  },
  modelsGroup: {
    marginBottom: 12,
  },
  modelsVersion: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  modelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  modelName: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 8,
  },
  modelsError: {
    fontSize: 12,
    color: "#dc2626",
  },
  modelsHint: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 8,
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
