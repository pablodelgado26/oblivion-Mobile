import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setErrorMessage(result.message || "Falha ao fazer login");
      }
    } catch (error) {
      setErrorMessage("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@exemplo.com");
    setPassword("demo123");
    setErrorMessage("");
    setLoading(true);
    try {
      const result = await signIn("demo@exemplo.com", "demo123");
      if (!result.success) {
        setErrorMessage(result.message || "Falha ao fazer login");
      }
    } catch (error) {
      setErrorMessage("Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="cart" size={40} color="#8b5cf6" />
          </View>
          <Text style={styles.title}>Lista de Compras</Text>
          <Text style={styles.subtitle}>
            Organize suas compras de forma inteligente
          </Text>
        </View>

        {/* Card Container */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

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

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!email || !password || loading) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>OU</Text>
          <View style={styles.separator} />
        </View>

        {/* Demo Button */}
        <TouchableOpacity
          style={styles.demoButton}
          onPress={handleDemoLogin}
          disabled={loading}
        >
          <Text style={styles.demoButtonText}>Acessar como Demo</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Ao continuar, você concorda com nossos Termos de Uso e Política de
          Privacidade
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
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
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#27272a",
  },
  separatorText: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 16,
    textTransform: "uppercase",
  },
  demoButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  demoButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    color: "#71717a",
    fontSize: 14,
  },
  registerLink: {
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
