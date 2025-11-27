import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";

const InfoCard = ({ icon, title, description }) => (
  <View style={styles.infoCard}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={24} color="#5856D6" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </View>
);

const ActionItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.actionLeft}>
      <Ionicons name={icon} size={22} color="#fff" />
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
  </TouchableOpacity>
);

export default function PrivacyScreen() {
  const router = useRouter();
  const { deleteAccount, updatePassword, signOut } = useAuth();
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteAccount();
              if (result.success) {
                Alert.alert("Sucesso", "Sua conta foi excluída com sucesso.");
              } else {
                Alert.alert("Erro", result.message || "Não foi possível excluir a conta");
              }
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir a conta");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const saveNewPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.success) {
        setChangePasswordModalVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Alert.alert(
          "Sucesso", 
          "Senha alterada com sucesso! Você será desconectado.",
          [
            {
              text: "OK",
              onPress: async () => {
                await signOut();
              }
            }
          ]
        );
      } else {
        Alert.alert("Erro", result.message || "Não foi possível alterar a senha");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      Alert.alert("Erro", "Ocorreu um erro ao alterar a senha");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>


        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Seus dados são importantes para nós. Veja como protegemos sua privacidade.
          </Text>
        </View>

        {/* Cards Informativos */}
        <View style={styles.section}>
          <InfoCard
            icon="shield-checkmark"
            title="Armazenamento Local"
            description="Todos os seus dados são armazenados localmente no seu dispositivo. Nenhuma informação é enviada para servidores externos."
          />
          <InfoCard
            icon="lock-closed"
            title="Dados Criptografados"
            description="Suas credenciais são armazenadas de forma segura usando AsyncStorage do React Native."
          />
          <InfoCard
            icon="eye-off"
            title="Privacidade Garantida"
            description="Não coletamos, compartilhamos ou vendemos seus dados pessoais para terceiros."
          />
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciar Dados</Text>
          <View style={styles.actionGroup}>
            <ActionItem
              icon="document-text-outline"
              title="Política de Privacidade"
              subtitle="Leia nossa política completa"
              onPress={() => router.push("/(tabs)/profile/Privacy_page/politicas")}
            />
            <View style={styles.separator} />
            <ActionItem
              icon="key-outline"
              title="Alterar Senha"
              subtitle="Atualize sua senha de acesso"
              onPress={handleChangePassword}
            />
            <View style={styles.separator} />
            <ActionItem
              icon="trash-outline"
              title="Excluir Conta"
              subtitle="Remover todos os seus dados"
              onPress={handleDeleteAccount}
            />
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={18} color="#8E8E93" />
          <Text style={styles.footerText}>
            Você tem controle total sobre seus dados. Entre em contato conosco para
            qualquer dúvida sobre privacidade.
          </Text>
        </View>
      </View>

      {/* Modal de Alterar Senha */}
      <Modal
        visible={changePasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha Atual</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Digite sua senha atual"
                placeholderTextColor="#666"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Senha</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Digite a nova senha"
                placeholderTextColor="#666"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme a nova senha"
                placeholderTextColor="#666"
                secureTextEntry
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setChangePasswordModalVisible(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveNewPassword}
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
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
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
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(88, 86, 214, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  actionGroup: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    minHeight: 60,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#38383A",
    marginLeft: 50,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    marginLeft: 12,
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
