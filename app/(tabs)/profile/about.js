import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#5856D6" />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const LinkItem = ({ icon, title, url }) => (
  <TouchableOpacity
    style={styles.linkItem}
    onPress={() => Linking.openURL(url)}
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={20} color="#5856D6" />
    <Text style={styles.linkText}>{title}</Text>
    <Ionicons name="open-outline" size={18} color="#8E8E93" />
  </TouchableOpacity>
);

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo e Nome */}
        <View style={styles.header}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>O</Text>
          </View>
          <Text style={styles.appName}>Oblivion Mobile</Text>
          <Text style={styles.appTagline}>Seu app de gerenciamento pessoal</Text>
        </View>

        {/* Informações da Versão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Versão" value="1.0.0" />
            <View style={styles.divider} />
            <InfoRow label="Build" value="2025.11.25" />
            <View style={styles.divider} />
            <InfoRow label="Plataforma" value="React Native" />
            <View style={styles.divider} />
            <InfoRow label="Expo SDK" value="~54.0.0" />
          </View>
        </View>

        {/* Tecnologias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvido com</Text>
          <View style={styles.techContainer}>
            <FeatureItem
              icon="logo-react"
              title="React Native"
              description="Framework multiplataforma"
            />
            <FeatureItem
              icon="navigate-circle"
              title="Expo Router"
              description="Navegação baseada em arquivos"
            />
            <FeatureItem
              icon="server-outline"
              title="AsyncStorage"
              description="Armazenamento persistente"
            />
            <FeatureItem
              icon="shield-checkmark"
              title="Segurança Local"
              description="Dados protegidos no dispositivo"
            />
          </View>
        </View>

        {/* Links Úteis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links Úteis</Text>
          <View style={styles.linksContainer}>
            <LinkItem
              icon="globe-outline"
              title="Website"
              url="https://oblivion.com"
            />
            <LinkItem
              icon="logo-github"
              title="GitHub"
              url="https://github.com/oblivion-mobile"
            />
            <LinkItem
              icon="document-text-outline"
              title="Termos de Uso"
              url="https://oblivion.com/terms"
            />
            <LinkItem
              icon="shield-outline"
              title="Política de Privacidade"
              url="https://oblivion.com/privacy"
            />
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 Oblivion</Text>
          <Text style={styles.footerText}>Todos os direitos reservados</Text>
          <Text style={styles.footerText}>
            Desenvolvido com ❤️ para você
          </Text>
        </View>

        {/* Agradecimentos */}
        <View style={styles.thanksCard}>
          <Ionicons name="heart" size={24} color="#FF453A" />
          <Text style={styles.thanksText}>
            Obrigado por usar o Oblivion Mobile!
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
    alignItems: "center",
    paddingVertical: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: "#5856D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
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
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 17,
    color: "#fff",
  },
  infoValue: {
    fontSize: 17,
    color: "#8E8E93",
    fontWeight: "500",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#38383A",
  },
  techContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(88, 86, 214, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  linksContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 8,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 17,
    color: "#fff",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  copyright: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 2,
  },
  thanksCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  thanksText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "500",
  },
});
