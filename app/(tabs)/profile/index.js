import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente para item de configuração
const SettingsItem = ({ iconName, title, subtitle, onPress, showArrow = true, rightComponent }) => (
  <TouchableOpacity 
    style={styles.settingsItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingsLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={20} color="#fff" />
      </View>
      <View style={styles.settingsTextContainer}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightComponent || (showArrow && (
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    ))}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, signOut, updateUser, deleteAccount } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Carregar preferências ao iniciar
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const notifications = await AsyncStorage.getItem("notifications_enabled");
      const emailAlerts = await AsyncStorage.getItem("email_alerts_enabled");
      setNotificationsEnabled(notifications === "true");
      setEmailAlertsEnabled(emailAlerts === "true");
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await AsyncStorage.setItem("notifications_enabled", value.toString());
      setNotificationsEnabled(value);
    } catch (error) {
      console.error("Erro ao salvar preferência:", error);
    }
  };

  const toggleEmailAlerts = async (value) => {
    try {
      await AsyncStorage.setItem("email_alerts_enabled", value.toString());
      setEmailAlertsEnabled(value);
    } catch (error) {
      console.error("Erro ao salvar preferência:", error);
    }
  };

  const handleEditProfile = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setEditModalVisible(true);
  };

  const saveProfileChanges = async () => {
    if (!editName.trim()) {
      Alert.alert("Erro", "O nome não pode estar vazio");
      return;
    }

    if (!editEmail.trim() || !editEmail.includes("@")) {
      Alert.alert("Erro", "Digite um email válido");
      return;
    }

    try {
      const updatedUser = { ...user, name: editName, email: editEmail };
      await updateUser(updatedUser);
      setEditModalVisible(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              // Chamar signOut do contexto
              await signOut();
            } catch (error) {
              console.error("Erro ao sair:", error);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header do Perfil */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Perfil</Text>
            <Text style={styles.headerSubtitle}>Gerencie sua conta</Text>
          </View>
        </View>

        {/* Avatar e Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {user?.name ? user.name.substring(0, 2).toLowerCase() : "up"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || "Usuário Demo"}</Text>
            <Text style={styles.userEmail}>{user?.email || "usuario@exemplo.com"}</Text>
          </View>
        </View>

        {/* Seção Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <View style={styles.settingsGroup}>
            <SettingsItem
              iconName="person-outline"
              title="Editar Perfil"
              subtitle="Alterar nome e informações"
              onPress={handleEditProfile}
            />

            <View style={styles.separator} />

            <SettingsItem
              iconName="notifications-outline"
              title="Notificações"
              subtitle="Receber alertas do app"
              showArrow={false}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: "#3A3A3C", true: "#6413ceff" }}
                  thumbColor={notificationsEnabled ? "#34C759" : "#fff"}
                  ios_backgroundColor="#3A3A3C"
                />
              }
            />

            <View style={styles.separator} />

            <SettingsItem
              iconName="mail-outline"
              title="Alertas por Email"
              subtitle="Receber emails semanais"
              showArrow={false}
              rightComponent={
                <Switch
                  value={emailAlertsEnabled}
                  onValueChange={toggleEmailAlerts}
                  trackColor={{ false: "#3A3A3C", true: "#6413ceff" }}
                  thumbColor={emailAlertsEnabled ? "#34C759" : "#fff"}
                  ios_backgroundColor="#3A3A3C"
                />
              }
            />
          </View>
        </View>

        {/* Seção Mais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais</Text>

          <View style={styles.settingsGroup}>
            <SettingsItem
              iconName="lock-closed-outline"
              title="Privacidade e Segurança"
              subtitle="Gerencie seus dados"
              onPress={() => router.push("/(tabs)/profile/privacy")}
            />

            <View style={styles.separator} />

            <SettingsItem
              iconName="help-circle-outline"
              title="Ajuda e Suporte"
              subtitle="Central de ajuda"
              onPress={() => router.push("/(tabs)/profile/help")}
            />

            <View style={styles.separator} />

            <SettingsItem
              iconName="information-circle-outline"
              title="Sobre o App"
              subtitle="Versão 1.0.0"
              onPress={() => router.push("/(tabs)/profile/about")}
            />
          </View>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF453A" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </View>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Seu nome"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5856D6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 15,
    color: "#8E8E93",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 8,
    paddingLeft: 16,
  },
  settingsGroup: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 17,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#38383A",
    marginLeft: 56,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#FF453A",
    fontSize: 17,
    fontWeight: "400",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#FF453A",
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteText: {
    color: "#FF453A",
    fontSize: 17,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 14,
    fontSize: 17,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#38383A",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#5856D6",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
