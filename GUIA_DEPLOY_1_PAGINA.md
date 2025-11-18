# 🚀 Guia de Deploy Ultra-Simplificado (15 minutos)

## 🎯 Objetivo

Ter seu Orquestrador Financeiro **permanente e online 24/7**, sem depender do sandbox do Manus.

## 📋 Pré-requisitos

- ✅ Conta no **GitHub** (https://github.com/signup)
- ✅ Conta no **Vercel** (https://vercel.com/signup)
- ✅ Conta no **Render** (https://render.com/signup)

---

## 🚀 Passo a Passo

### **Passo 1: Criar Repositório no GitHub** (5 min)

1. Acesse https://github.com/new
2. Nome do repositório: `orquestrador-financeiro`
3. Deixe como **Privado**
4. Clique em **"Create repository"**

### **Passo 2: Upload do Código** (5 min)

1. No repositório criado, clique em **"uploading an existing file"**
2. Arraste o arquivo `orquestrador-financeiro-completo.zip` (que vou te entregar)
3. Aguarde o upload
4. Clique em **"Commit changes"**

### **Passo 3: Deploy do Frontend no Vercel** (5 min)

1. Acesse https://vercel.com/new
2. Selecione o repositório `orquestrador-financeiro`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `orquestrador-financeiro`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em **"Deploy"**
5. Aguarde 2-3 minutos
6. Pronto! Você terá um link tipo: `https://orquestrador-financeiro.vercel.app`

### **Passo 4: Deploy do Backend no Render** (10 min)

1. Acesse https://dashboard.render.com/new/web
2. Selecione o repositório `orquestrador-financeiro`
3. Configure:
   - **Name**: `orquestrador-backend`
   - **Root Directory**: `orquestrador-financeiro/server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Instance Type**: Free

4. **Adicione as Variáveis de Ambiente**:

Clique em **"Environment"** e adicione:

```
SUPABASE_URL=https://seuprojetosupabase.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
OPENAI_API_KEY=sk-proj-mawJDptEoyRwJ8Ib0YpHaQKyzCMNZPZ...
PLUGGY_CLIENT_ID=89e8d776-1222-4d5a-abf6-7e241ab32b83
PLUGGY_CLIENT_SECRET=2cf75b8c-b178-4a25-b1d9-d41b3e35a33f
PORT=3001
```

5. Clique em **"Create Web Service"**
6. Aguarde 5-10 minutos
7. Pronto! Você terá um link tipo: `https://orquestrador-backend.onrender.com`

### **Passo 5: Conectar Frontend com Backend** (5 min)

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   VITE_API_URL=https://orquestrador-backend.onrender.com
   ```
3. Clique em **"Save"**
4. Vá em **Deployments** → **Redeploy**
5. Aguarde 2-3 minutos

---

## ✅ Pronto!

Seu sistema está **permanente e online 24/7**!

- **Frontend**: `https://orquestrador-financeiro.vercel.app`
- **Backend**: `https://orquestrador-backend.onrender.com`

Agora é só acessar, conectar seu banco e usar! 💪🚀

