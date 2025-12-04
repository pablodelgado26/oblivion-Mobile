# 📱 Oblivion Mobile

> **Aplicativo mobile com React Native + Expo + AsyncStorage**

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login e cadastro de usuários
- 🛡️ **Rotas Protegidas** - Acesso apenas para usuários autenticados
- 📋 **CRUD Completo** - Criar, visualizar, editar e excluir listas
- 💾 **Armazenamento Local** - AsyncStorage para persistência de dados
- 🎨 **Interface Moderna** - Design com Dark Mode otimizado
- 🤖 **Assistente IA** - Sugestões inteligentes
- 📊 **Estatísticas** - Análise de dados e padrões
- 👤 **Gerenciamento de Perfil** - Editar dados e configurações

---

## 📁 Estrutura do Projeto

```
oblivion-Mobile/
├── app/                        # Telas principais (Expo Router)
│   ├── _layout.js             # Proteção de rotas
│   ├── index.js               # Redirecionador
│   ├── (auth)/
│   │   ├── login.js           # Login
│   │   ├── register.js        # Cadastro
│   │   └── _layout.js
│   └── (tabs)/
│       ├── home.js            # Tela inicial
│       ├── create.js          # Criar listas
│       ├── lists.js           # Listar listas
│       ├── list_ID.js         # Detalhes da lista
│       ├── ai.js              # Assistente IA
│       ├── stats.js           # Estatísticas
│       ├── profile/           # Perfil do usuário
│       │   ├── index.js
│       │   ├── about.js
│       │   ├── help.js
│       │   ├── privacy.js
│       │   └── _layout.js
│       └── _layout.js
├── components/                # Componentes reutilizáveis
│   └── SplashScreen.js
├── contexts/                  # Context API
│   └── AuthContext.js        # Autenticação global
├── utils/                     # Funções utilitárias
│   └── storage.js            # AsyncStorage
└── assets/                    # Ícones e imagens
```

---

## 🚀 Como Usar

### 📋 Pré-requisitos

- **Node.js** 16+ instalado
- **Expo Go** no smartphone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### ⚡ Instalação Rápida

**1. Instalar dependências:**
```powershell
npm install
```

**2. Iniciar servidor:**
```powershell
npx expo start
```

**3. Abrir no celular:**
- Abra o **Expo Go**
- Escaneie o **QR Code** que apareceu no terminal
- Aguarde o carregamento

✅ **Pronto!** O app abrirá na tela de login.

**Primeiro acesso:**
1. Clique em **"Cadastre-se"**
2. Preencha: Email e Senha (mín. 6 caracteres)
3. Faça login com suas credenciais
4. Explore todas as funcionalidades!

---

## ⚠️ Instruções Importantes

### 🔧 Se der erro ao instalar:
```powershell
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

### 📱 Certifique-se que:
- ✅ Celular e computador estão na **mesma rede Wi-Fi**
- ✅ **Expo Go** está atualizado (SDK 54)
- ✅ Firewall/Antivírus não está bloqueando a porta 8081

### 🐛 Erros comuns:

**"Cannot find module":**
```powershell
npm install
npx expo start --clear
```

**"Network error":**
- Verifique conexão Wi-Fi
- Desabilite VPN temporariamente
- Use modo Tunnel: `npx expo start --tunnel`

**App não abre:**
- Feche e reabra o Expo Go
- Reinicie o servidor (Ctrl+C e `npx expo start` novamente)

---

## 💾 Armazenamento de Dados

**AsyncStorage** salva as listas como **JSON** no dispositivo.

### Estrutura dos dados:
```javascript
[
  {
    id: "uuid",
    title: "Título da lista",
    items: ["Item 1", "Item 2", "Item 3"],
    userId: "uuid",
    created_at: "2025-12-04T10:30:00.000Z",
    updated_at: "2025-12-04T10:30:00.000Z"
  },
  // ...
]
```

### Operações disponíveis (`utils/storage.js`):
```javascript
await saveLists(lists)              // Salvar listas
await getLists()                    // Listar listas
await addList(list)                 // Adicionar lista
await updateList(id, list)          // Atualizar lista
await deleteList(id)                // Excluir lista
await searchLists(term)             // Buscar listas
```

---

## 📝 Comandos

```powershell
npx expo start              # Iniciar
npx expo start --clear      # Limpar cache
npx expo start --tunnel     # Modo tunnel
npm install                 # Instalar
```

---

## 💡 Dicas

- 🔐 **Faça cadastro** na primeira vez para acessar o app
- 📝 **Crie suas próprias listas** com ilimitados itens
- 🤖 **Use o assistente IA** para sugestões personalizadas
- 📊 **Acompanhe suas estatísticas** de uso
- 💾 **Dados persistem** mesmo fechando o app
- 🚪 **Logout** no botão de perfil
- 🌙 **Dark Mode** otimizado para a noite

---

**Desenvolvido com ❤️ - Oblivion Mobile v2.0.0**
