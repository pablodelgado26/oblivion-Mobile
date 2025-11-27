import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PoliticaPrivacidade() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Política de Privacidade</Text>
      <Text style={styles.text}>
        Bem-vindo à nossa Política de Privacidade. Aqui explicamos como tratamos
        seus dados pessoais e garantimos sua segurança. Nós valorizamos sua
        privacidade e estamos comprometidos em protegê-la.
      </Text>
      <Text style={styles.sectionTitle}>1. Coleta de Dados</Text>
      <Text style={styles.text}>
        Nós coletamos apenas os dados necessários para fornecer nossos serviços,
        como nome, email e informações de login.
      </Text>
      <Text style={styles.sectionTitle}>2. Uso de Dados</Text>
      <Text style={styles.text}>
        Seus dados são utilizados exclusivamente para melhorar sua experiência
        no aplicativo. Não compartilhamos suas informações com terceiros.
      </Text>
      <Text style={styles.sectionTitle}>3. Segurança</Text>
      <Text style={styles.text}>
        Utilizamos medidas de segurança avançadas para proteger suas informações
        contra acessos não autorizados.
      </Text>
      <Text style={styles.sectionTitle}>4. Seus Direitos</Text>
      <Text style={styles.text}>
        Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer
        momento. Entre em contato conosco para mais informações.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#ccc",
  },
});
