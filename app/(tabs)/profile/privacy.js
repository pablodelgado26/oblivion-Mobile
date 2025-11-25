import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
            />
            <View style={styles.separator} />
            <ActionItem
              icon="key-outline"
              title="Alterar Senha"
              subtitle="Atualize sua senha de acesso"
            />
            <View style={styles.separator} />
            <ActionItem
              icon="trash-outline"
              title="Excluir Conta"
              subtitle="Remover todos os seus dados"
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
});
