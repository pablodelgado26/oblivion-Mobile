import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import {
  getUser,
  saveUser,
  removeUser,
  validateLogin,
  saveNewUser,
  updateUserInDB,
  deleteUserAccount,
  changePassword,
} from "../utils/storage";
import { useRouter, useSegments } from "expo-router";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Carregar usuário do AsyncStorage ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  // Proteger rotas baseado em autenticação
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirecionar para login se não estiver autenticado
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirecionar para home se já estiver autenticado
      router.replace("/(tabs)/home");
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const storedUser = await getUser();
      setUser(storedUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await validateLogin(email, password);

      if (result.success) {
        setUser(result.user);
        await saveUser(result.user);
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return { success: false, message: "Erro ao fazer login" };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Em produção, use hash!
        createdAt: new Date().toISOString(),
      };

      const result = await saveNewUser(newUser);

      if (result.success) {
        // Fazer login automático após cadastro
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        await saveUser(userWithoutPassword);
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      return { success: false, message: "Erro ao cadastrar usuário" };
    }
  };

  const signOut = async () => {
    try {
      await removeUser();
      setUser(null);
      // A navegação será tratada automaticamente pelo useEffect
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível sair da conta");
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const { password: _, ...userWithoutPassword } = updatedUserData;
      
      // Atualizar no banco de dados
      const result = await updateUserInDB(updatedUserData);
      
      if (!result.success) {
        Alert.alert("Erro", result.message);
        return { success: false, message: result.message };
      }
      
      // Atualizar estado local e AsyncStorage
      setUser(userWithoutPassword);
      await saveUser(userWithoutPassword);
      return { success: true };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return { success: false, message: "Erro ao atualizar usuário" };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        return { success: false, message: "Usuário não encontrado" };
      }

      const result = await deleteUserAccount(user.id);
      
      if (result.success) {
        setUser(null);
        // A navegação será tratada automaticamente pelo useEffect
        return { success: true };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      return { success: false, message: "Erro ao deletar conta" };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        return { success: false, message: "Usuário não encontrado" };
      }

      const result = await changePassword(user.id, currentPassword, newPassword);
      return result;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      return { success: false, message: "Erro ao alterar senha" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
        deleteAccount,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
