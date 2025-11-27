import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@rotas_privadas:user",
  USERS_DB: "@rotas_privadas:users_db",
  LISTS: "@rotas_privadas:lists",
};

// Salvar usuário logado
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    return false;
  }
};

// Obter usuário logado
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return null;
  }
};

// Remover usuário logado (logout)
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    return true;
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    return false;
  }
};

// Obter todos os usuários cadastrados
export const getAllUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
};

// Salvar novo usuário no banco de dados
export const saveNewUser = async (user) => {
  try {
    const users = await getAllUsers();

    // Verificar se email já existe
    const emailExists = users.some((u) => u.email === user.email);
    if (emailExists) {
      return { success: false, message: "Email já cadastrado" };
    }

    // Adicionar novo usuário
    users.push(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar novo usuário:", error);
    return { success: false, message: "Erro ao cadastrar usuário" };
  }
};

// Validar login
export const validateLogin = async (email, password) => {
  try {
    const users = await getAllUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Não retornar a senha
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: "Email ou senha inválidos" };
  } catch (error) {
    console.error("Erro ao validar login:", error);
    return { success: false, message: "Erro ao fazer login" };
  }
};

// Limpar todos os dados (útil para debug)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.USERS_DB]);
    return true;
  } catch (error) {
    console.error("Erro ao limpar dados:", error);
    return false;
  }
};

// Atualizar usuário no banco de dados
export const updateUserInDB = async (updatedUser) => {
  try {
    const users = await getAllUsers();
    const userIndex = users.findIndex((u) => u.id === updatedUser.id);

    if (userIndex === -1) {
      return { success: false, message: "Usuário não encontrado" };
    }

    // Verificar se o novo email já existe em outro usuário
    const emailExists = users.some(
      (u) => u.email === updatedUser.email && u.id !== updatedUser.id
    );
    if (emailExists) {
      return { success: false, message: "Email já cadastrado por outro usuário" };
    }

    // Atualizar o usuário mantendo a senha original
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário no banco:", error);
    return { success: false, message: "Erro ao atualizar usuário" };
  }
};

// ============= FUNÇÕES DE LISTAS =============

// Obter todas as listas
export const getAllLists = async () => {
  try {
    const lists = await AsyncStorage.getItem(STORAGE_KEYS.LISTS);
    return lists ? JSON.parse(lists) : [];
  } catch (error) {
    console.error("Erro ao obter listas:", error);
    return [];
  }
};

// Salvar nova lista
export const saveList = async (list) => {
  try {
    const lists = await getAllLists();
    const newList = {
      id: Date.now().toString(),
      ...list,
      createdAt: new Date().toISOString(),
      completed: false,
      items: list.items.map((item) => ({
        ...item,
        id: Date.now().toString() + Math.random(),
        completed: false,
      })),
    };

    lists.push(newList);
    await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    return { success: true, list: newList };
  } catch (error) {
    console.error("Erro ao salvar lista:", error);
    return { success: false, message: "Erro ao salvar lista" };
  }
};

// Atualizar lista
export const updateList = async (listId, updatedData) => {
  try {
    const lists = await getAllLists();
    const listIndex = lists.findIndex((l) => l.id === listId);

    if (listIndex === -1) {
      return { success: false, message: "Lista não encontrada" };
    }

    lists[listIndex] = { ...lists[listIndex], ...updatedData };
    await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    return { success: true, list: lists[listIndex] };
  } catch (error) {
    console.error("Erro ao atualizar lista:", error);
    return { success: false, message: "Erro ao atualizar lista" };
  }
};

// Deletar lista
export const deleteList = async (listId) => {
  try {
    const lists = await getAllLists();
    const filteredLists = lists.filter((l) => l.id !== listId);
    await AsyncStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(filteredLists));
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar lista:", error);
    return { success: false, message: "Erro ao deletar lista" };
  }
};

// Obter lista por ID
export const getListById = async (listId) => {
  try {
    const lists = await getAllLists();
    const list = lists.find((l) => l.id === listId);
    return list || null;
  } catch (error) {
    console.error("Erro ao obter lista:", error);
    return null;
  }
};
