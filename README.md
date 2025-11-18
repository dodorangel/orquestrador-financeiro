# 💰 Orquestrador Financeiro

Sistema completo de gestão financeira pessoal com integração Open Finance, análise inteligente com IA e projeções financeiras.

## 🎯 Funcionalidades

### ✅ Implementadas

- **Dashboard Interativo** - Visualização completa de receitas, despesas e saldo
- **Gráfico de Evolução Temporal** - Histórico + projeção dos próximos 6 meses
- **Tabela por Categoria** - Análise detalhada de gastos por categoria
- **Integração Pluggy** - Sincronização automática com Banco do Brasil e outros bancos
- **Categorização com IA** - OpenAI GPT-4.1-mini para categorizar transações
- **Projeções Inteligentes** - Algoritmos de média móvel e regressão linear
- **Insights Personalizados** - Sugestões de economia baseadas em padrões
- **Detecção de Parcelas** - Identifica automaticamente compras parceladas
- **Página de Status** - Monitoramento em tempo real de todos os serviços

### 🚧 Roadmap Futuro

- Dark Mode
- Exportação de relatórios (PDF, Excel)
- Alertas via SMS/Email
- Metas financeiras personalizadas
- Gráficos adicionais (pizza, barras, heatmap)
- Controle de dívidas com simulador de quitação
- App mobile (React Native)

## 🛠️ Tecnologias

### Frontend
- React 18 + Vite
- Tailwind CSS
- Recharts (gráficos)
- Pluggy Connect Widget

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- OpenAI API
- Pluggy API

## 📦 Estrutura do Projeto

```
orquestrador-financeiro/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── App.jsx            # Componente principal
│   └── index.css          # Estilos globais
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configurações (Supabase)
│   │   ├── services/      # Serviços (Pluggy, OpenAI, etc.)
│   │   ├── routes/        # Rotas da API
│   │   └── index.js       # Servidor Express
│   └── package.json
├── supabase-schema.sql    # Schema do banco de dados
├── supabase-seeds.sql     # Dados iniciais (categorias)
└── package.json           # Dependências do frontend
```

## 🚀 Deploy

Siga o **GUIA_DEPLOY_1_PAGINA.md** para fazer deploy em 15 minutos usando Vercel + Render (gratuito).

## 🔐 Variáveis de Ambiente

### Backend (.env)

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
OPENAI_API_KEY=sk-proj-...
PLUGGY_CLIENT_ID=89e8d776-1222-4d5a-abf6-7e241ab32b83
PLUGGY_CLIENT_SECRET=2cf75b8c-b178-4a25-b1d9-d41b3e35a33f
PORT=3001
```

### Frontend (.env)

```
VITE_API_URL=https://seu-backend.onrender.com
```

## 📖 Documentação

- **GUIA_DEPLOY_1_PAGINA.md** - Deploy permanente em 15 minutos
- **MANUAL_DO_USUARIO.md** - Como usar o sistema
- **DOCUMENTACAO_TECNICA.md** - Arquitetura e APIs
- **GUIA_PRATICO_FINAL.md** - Conectar BB + Deploy completo

## 💰 Custos Mensais

| Serviço | Plano Gratuito | Plano Pago |
|---------|----------------|------------|
| Vercel (Frontend) | ✅ Ilimitado | - |
| Render (Backend) | ✅ 750h/mês | $7/mês |
| Supabase (Banco) | ✅ 500MB | $25/mês |
| Pluggy (Open Finance) | ✅ 100 conexões | $99/mês |
| OpenAI (IA) | ❌ Pay-as-you-go | ~$5-10/mês |
| **TOTAL** | **~$5-10/mês** | **~$140/mês** |

## 🆘 Suporte

- **Página de Status**: `/status.html`
- **Logs do Render**: https://dashboard.render.com
- **Logs do Vercel**: https://vercel.com/dashboard
- **Dashboard Pluggy**: https://dashboard.pluggy.ai

## 📝 Licença

Projeto pessoal desenvolvido para controle financeiro individual.

## 👤 Autor

Desenvolvido por **Manus AI** para Diogo.

---

**Bora ter controle total das finanças e conquistar seus objetivos! 💪🚀**

