import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PoliticasScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introdução */}
        <View style={styles.section}>
          <Text style={styles.introText}>
            Bem-vindo à nossa Política de Privacidade. Esta política descreve como coletamos, 
            usamos e protegemos suas informações pessoais quando você usa nosso aplicativo.
          </Text>
          <Text style={styles.dateText}>Última atualização: 27 de novembro de 2025</Text>
        </View>

        {/* 1. Coleta de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>1. Coleta de Dados</Text>
          </View>
          <Text style={styles.sectionText}>
            Coletamos apenas as informações necessárias para fornecer nossos serviços:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Nome e informações de perfil</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Endereço de email</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Dados de autenticação (senha criptografada)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Listas de compras e preferências</Text>
          </View>
        </View>

        {/* 2. Armazenamento Local */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>2. Armazenamento Local</Text>
          </View>
          <Text style={styles.sectionText}>
            Todos os seus dados são armazenados localmente no seu dispositivo usando 
            AsyncStorage. Nenhuma informação é enviada para servidores externos ou 
            nuvem, garantindo total controle e privacidade sobre seus dados.
          </Text>
        </View>

        {/* 3. Uso de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>3. Uso de Dados</Text>
          </View>
          <Text style={styles.sectionText}>
            Utilizamos suas informações exclusivamente para:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Autenticar sua conta</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Salvar e sincronizar suas listas de compras</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Personalizar sua experiência no aplicativo</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Gerar estatísticas e insights pessoais</Text>
          </View>
        </View>

        {/* 4. Compartilhamento de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>4. Compartilhamento de Dados</Text>
          </View>
          <Text style={styles.sectionText}>
            Nós <Text style={styles.highlight}>NÃO</Text> compartilhamos, vendemos ou 
            alugamos suas informações pessoais para terceiros. Seus dados permanecem 
            exclusivamente no seu dispositivo e sob seu controle.
          </Text>
        </View>

        {/* 5. Segurança */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>5. Segurança</Text>
          </View>
          <Text style={styles.sectionText}>
            Implementamos medidas de segurança para proteger suas informações:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Armazenamento criptografado local</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Senhas protegidas com hash</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Sem transmissão de dados pela internet</Text>
          </View>
        </View>

        {/* 6. Seus Direitos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
          </View>
          <Text style={styles.sectionText}>
            Você tem total controle sobre seus dados:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Acessar e visualizar seus dados a qualquer momento</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Editar ou atualizar suas informações</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Alterar sua senha quando desejar</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Excluir sua conta e todos os dados permanentemente</Text>
          </View>
        </View>

        {/* 7. API de Terceiros */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>7. API de Terceiros (Gemini AI)</Text>
          </View>
          <Text style={styles.sectionText}>
            Quando você utiliza o recurso de IA para gerar listas de compras, enviamos 
            sua solicitação para a API do Google Gemini. Apenas o texto da sua solicitação 
            é enviado, sem qualquer informação de identificação pessoal. Consulte a política 
            de privacidade do Google para mais informações.
          </Text>
        </View>

        {/* 8. Alterações na Política */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="refresh" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>8. Alterações na Política</Text>
          </View>
          <Text style={styles.sectionText}>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre 
            mudanças significativas através do aplicativo. O uso continuado após alterações 
            constitui aceitação da nova política.
          </Text>
        </View>

        {/* 9. Contato */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>9. Contato</Text>
          </View>
          <Text style={styles.sectionText}>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
            seus dados, entre em contato através da seção "Ajuda e Suporte" no aplicativo.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={20} color="#8E8E93" />
          <Text style={styles.footerText}>
            Ao usar este aplicativo, você concorda com esta Política de Privacidade.
          </Text>
        </View>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#0A0A0A",
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: "#5856D6",
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 15,
    color: "#C7C7CC",
    lineHeight: 22,
    marginBottom: 12,
  },
  highlight: {
    color: "#8b5cf6",
    fontWeight: "700",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 15,
    color: "#8b5cf6",
    marginRight: 8,
    fontWeight: "bold",
  },
  bulletText: {
    fontSize: 15,
    color: "#C7C7CC",
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    marginLeft: 12,
  },
});
