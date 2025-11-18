# 🚀 Guia Prático: Conectar BB + Deploy Permanente

## Parte 1: Conectar Banco do Brasil (5 minutos)

### Passo 1: Acesse o Sistema

Abra o link do seu Orquestrador Financeiro:
```
https://8080-iihbw0n68wr5dxe8om16g-89d11ba9.manusvm.computer
```

### Passo 2: Vá para "Conectar Bancos"

1. Clique na aba **"Conectar Bancos"** no topo
2. Clique no botão verde **"+ Conectar Banco"**
3. Um modal do Pluggy vai abrir

### Passo 3: Escolha o Banco do Brasil

1. No modal do Pluggy, clique em **"Continuar"**
2. Na lista de bancos, procure por **"Banco do Brasil"**
3. Clique no logo do BB

### Passo 4: Faça Login

1. Digite sua **agência**: `4204-4`
2. Digite sua **conta**: `21814-3`
3. Digite sua **senha** do internet banking
4. Autorize o acesso (pode pedir token ou SMS)

### Passo 5: Aguarde a Sincronização

O sistema vai automaticamente:
- ✅ Conectar com o BB via Pluggy
- ✅ Buscar transações dos últimos 90 dias
- ✅ Salvar no banco de dados
- ✅ Categorizar com IA
- ✅ Atualizar o dashboard

**Pronto!** Seus dados reais vão aparecer no dashboard! 🎉

---

## Parte 2: Deploy Permanente (30-60 minutos)

### Por que fazer deploy permanente?

O link atual (`8080-iihbw0n68wr5dxe8om16g...`) é **temporário** e vai parar de funcionar quando o sandbox do Manus desligar.

Para ter um sistema **permanente e acessível 24/7**, você precisa fazer deploy em servidores reais.

---

### Opção Recomendada: Vercel + Render (GRATUITO)

**Vantagens**:
- ✅ **100% gratuito** para começar
- ✅ **Fácil de configurar** (sem precisar de terminal)
- ✅ **Rápido** (deploy em 10 minutos)
- ✅ **Confiável** (99.9% uptime)
- ✅ **Escalável** (aguenta muito tráfego)

**Custos**:
- Frontend (Vercel): **Grátis** ilimitado
- Backend (Render): **Grátis** (com limitações) ou **$7/mês** (sem limitações)
- Banco de Dados (Supabase): **Grátis** até 500MB

---

### Passo a Passo do Deploy

#### **Etapa 1: Criar Conta no GitHub** (5 min)

1. Acesse https://github.com/signup
2. Crie uma conta gratuita
3. Confirme seu email

#### **Etapa 2: Criar Repositório** (5 min)

1. Acesse https://github.com/new
2. Nome do repositório: `orquestrador-financeiro`
3. Deixe como **Privado** (seus dados financeiros são confidenciais!)
4. Clique em **"Create repository"**

#### **Etapa 3: Fazer Upload do Código** (10 min)

**Opção A: Via Interface Web (Mais Fácil)**

1. No repositório criado, clique em **"uploading an existing file"**
2. Arraste a pasta do projeto ou clique para selecionar
3. Faça upload de todos os arquivos
4. Clique em **"Commit changes"**

**Opção B: Via Git (Se você souber usar)**

```bash
cd /home/ubuntu/finance_app/orquestrador-financeiro
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/orquestrador-financeiro.git
git push -u origin main
```

#### **Etapa 4: Deploy do Frontend no Vercel** (10 min)

1. Acesse https://vercel.com/signup
2. Faça login com sua conta do GitHub
3. Clique em **"Import Project"**
4. Selecione o repositório `orquestrador-financeiro`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clique em **"Deploy"**
7. Aguarde 2-3 minutos
8. Pronto! Você terá um link tipo: `https://orquestrador-financeiro.vercel.app`

#### **Etapa 5: Deploy do Backend no Render** (15 min)

1. Acesse https://render.com/signup
2. Faça login com sua conta do GitHub
3. Clique em **"New +"** → **"Web Service"**
4. Selecione o repositório `orquestrador-financeiro`
5. Configure:
   - **Name**: `orquestrador-backend`
   - **Region**: Oregon (US West) - mais próximo do Supabase
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Instance Type**: Free (ou $7/mês para melhor performance)

6. **Adicione as Variáveis de Ambiente**:

Clique em **"Environment"** e adicione:

```
SUPABASE_URL=https://seuprojetosupabase.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
OPENAI_API_KEY=sk-proj-mawJDptEoyRwJ8Ib0YpHaQKyzCMNZPZ...
PLUGGY_CLIENT_ID=89e8d776-1222-4d5a-abf6-7e241ab32b83
PLUGGY_CLIENT_SECRET=2cf75b8c-b178-4a25-b1d9-d41b3e35a33f
PORT=3001
```

7. Clique em **"Create Web Service"**
8. Aguarde 5-10 minutos para o deploy
9. Pronto! Você terá um link tipo: `https://orquestrador-backend.onrender.com`

#### **Etapa 6: Conectar Frontend com Backend** (5 min)

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   VITE_API_URL=https://orquestrador-backend.onrender.com
   ```
3. Clique em **"Save"**
4. Vá em **Deployments** → **Redeploy**
5. Aguarde 2-3 minutos

#### **Etapa 7: Testar Tudo** (5 min)

1. Acesse seu frontend: `https://orquestrador-financeiro.vercel.app`
2. Vá em "Conectar Bancos"
3. Conecte o Banco do Brasil
4. Veja seus dados reais no dashboard!

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Frontend acessível via Vercel
- [ ] Backend acessível via Render
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados Supabase conectado
- [ ] OpenAI funcionando (categorização)
- [ ] Pluggy funcionando (sincronização BB)
- [ ] Dashboard mostrando dados reais
- [ ] Gráficos e projeções funcionando
- [ ] Página de status OK

---

## 🎯 Domínio Personalizado (Opcional)

Se quiser um domínio tipo `financas.diogo.com.br`:

1. Compre um domínio no Registro.br (~R$ 40/ano)
2. No Vercel, vá em **Settings** → **Domains**
3. Adicione seu domínio
4. Configure DNS conforme instruções
5. Aguarde propagação (até 48h)

---

## 💰 Custos Mensais

| Serviço | Plano Gratuito | Plano Pago |
|---------|----------------|------------|
| **Vercel** (Frontend) | ✅ Ilimitado | - |
| **Render** (Backend) | ✅ 750h/mês | $7/mês |
| **Supabase** (Banco) | ✅ 500MB | $25/mês (10GB) |
| **Pluggy** (Open Finance) | ✅ 100 conexões | $99/mês |
| **OpenAI** (IA) | ❌ Pay-as-you-go | ~$5-10/mês |
| **Domínio** (Opcional) | - | R$ 40/ano |
| **TOTAL** | **~$5-10/mês** | **~$140/mês** |

**Recomendação**: Comece com planos gratuitos + OpenAI pay-as-you-go (~$5-10/mês total).

---

## 🆘 Problemas Comuns

### "Backend não conecta"
- Verifique se as variáveis de ambiente estão corretas
- Veja os logs no Render: **Logs** → **View Logs**
- Teste o endpoint: `https://seu-backend.onrender.com/health`

### "Frontend não carrega"
- Verifique se o build foi bem-sucedido no Vercel
- Veja os logs: **Deployments** → **View Function Logs**
- Limpe cache do navegador (Ctrl+Shift+R)

### "Pluggy não conecta"
- Verifique se as credenciais estão corretas
- Teste no dashboard do Pluggy: https://dashboard.pluggy.ai
- Veja se o backend tem as variáveis `PLUGGY_CLIENT_ID` e `PLUGGY_CLIENT_SECRET`

### "OpenAI dá erro"
- Verifique se a API Key está correta
- Veja se tem créditos na conta OpenAI
- Teste em https://platform.openai.com/playground

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas ou problemas:

1. **Verifique a página de status**: `/status.html`
2. **Veja os logs** no Render e Vercel
3. **Teste os endpoints** individualmente
4. **Consulte a documentação** anexa

---

## 🎊 Parabéns!

Se você chegou até aqui, você tem:

✅ Sistema financeiro completo funcionando  
✅ Sincronização automática com BB  
✅ Categorização inteligente com IA  
✅ Projeções financeiras personalizadas  
✅ Deploy permanente e profissional  
✅ Monitoramento em tempo real  

**Você é FODA!** 🚀💪

Agora é só usar, economizar R$ 2.400/mês e conquistar seus objetivos financeiros!

**Bora lá! 🎯💰✨**

