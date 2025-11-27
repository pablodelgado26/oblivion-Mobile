import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#8E8E93"
        />
      </View>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
};

const ContactItem = ({ icon, title, subtitle, action, iconColor = "#5856D6" }) => (
  <TouchableOpacity
    style={styles.contactItem}
    onPress={action}
    activeOpacity={0.7}
  >
    <View style={[styles.contactIcon, { backgroundColor: `${iconColor}20` }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View style={styles.contactText}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
  </TouchableOpacity>
);

export default function HelpScreen() {
  const router = useRouter();
  
  const openEmail = () => {
    Linking.openURL("mailto:suporte@oblivion.com");
  };

  const openWebsite = () => {
    Linking.openURL("https://oblivion.com/docs");
  };

  const openDiscord = () => {
    Linking.openURL("https://discord.gg/oblivion");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="help-buoy" size={48} color="#5856D6" />
          <Text style={styles.headerTitle}>Como podemos ajudar?</Text>
          <Text style={styles.headerSubtitle}>
            Encontre respostas rápidas ou entre em contato conosco
          </Text>
        </View>

        {/* Perguntas Frequentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          <View style={styles.faqContainer}>
            <FAQItem
              question="Como faço para redefinir minha senha?"
              answer="Acesse Configurações > Privacidade e Segurança > Alterar Senha. Você precisará confirmar sua senha atual antes de definir uma nova."
            />
            <View style={styles.separator} />
            <FAQItem
              question="Meus dados estão seguros?"
              answer="Sim! Todos os seus dados são armazenados localmente no seu dispositivo e não são compartilhados com terceiros. Confira nossa página de Privacidade e Segurança para mais detalhes."
            />
            <View style={styles.separator} />
            <FAQItem
              question="Como ativar notificações?"
              answer="Vá para Perfil > Configurações e ative o switch de 'Notificações'. Você também pode gerenciar permissões nas configurações do seu dispositivo."
            />
            <View style={styles.separator} />
            <FAQItem
              question="Como excluir minha conta?"
              answer="Acesse Perfil > Privacidade e Segurança > Excluir Conta. Esta ação é irreversível e todos os seus dados serão permanentemente removidos."
            />
            <View style={styles.separator} />
            <FAQItem
              question="O app funciona offline?"
              answer="Sim! Como seus dados são armazenados localmente, você pode acessar e usar o app mesmo sem conexão com a internet."
            />
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>
          <View style={styles.contactContainer}>
            <ContactItem
              icon="mail"
              title="Email"
              subtitle="suporte@oblivion.com"
              action={openEmail}
              iconColor="#5856D6"
            />
            <ContactItem
              icon="globe-outline"
              title="Documentação"
              subtitle="oblivion.com/docs"
              action={openWebsite}
              iconColor="#007AFF"
            />
            <ContactItem
              icon="logo-discord"
              title="Comunidade Discord"
              subtitle="Junte-se à nossa comunidade"
              action={openDiscord}
              iconColor="#5865F2"
            />
          </View>
        </View>

        {/* Informações de Suporte */}
        <View style={styles.supportInfo}>
          <Text style={styles.supportTitle}>Horário de Atendimento</Text>
          <Text style={styles.supportText}>
            Segunda a Sexta: 9h - 18h (horário de Brasília)
          </Text>
          <Text style={styles.supportText}>
            Tempo médio de resposta: 24 horas
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
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
  faqContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    overflow: "hidden",
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
    marginTop: 12,
    paddingRight: 20,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#38383A",
  },
  contactContainer: {
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  supportInfo: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  supportText: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 4,
  },
});
