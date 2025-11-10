import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Email inválido");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    try {
      const result = await signUp(name, email, password);

      if (!result.success) {
        setErrorMessage(result.message || "Falha ao criar conta");
      }
      // O AuthContext já redireciona automaticamente se sucesso
    } catch (error) {
      setErrorMessage("Falha ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="cart" size={40} color="#8b5cf6" />
            </View>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para começar
            </Text>
          </View>

          {/* Card Container */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Registrar</Text>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#71717a"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#71717a"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#71717a"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#71717a"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#71717a"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputPassword]}
                  placeholder="••••••••"
                  placeholderTextColor="#71717a"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#71717a"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#71717a"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#71717a"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={styles.warningText}>
                  As senhas não coincidem
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (!name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  loading) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                loading
              }
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={16} color="#8b5cf6" />
            <Text style={styles.backText}>Voltar para login</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Ao criar uma conta, você concorda com nossos Termos de Uso e
            Política de Privacidade
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
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc262620",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#18181b",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  inputPassword: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  warningText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#8b5cf6",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    padding: 12,
    gap: 8,
  },
  backText: {
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#71717a",
    lineHeight: 18,
  },
});
