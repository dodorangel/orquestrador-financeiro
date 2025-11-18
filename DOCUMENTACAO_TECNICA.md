# Documentação Técnica - Orquestrador Financeiro

## 1. Arquitetura do Sistema

O Orquestrador Financeiro é uma aplicação web full-stack com arquitetura moderna, dividida em três componentes principais:

-   **Frontend**: Aplicação React (Vite) responsável pela interface do usuário.
-   **Backend**: API Node.js (Express) que gerencia a lógica de negócio e integrações.
-   **Banco de Dados**: Supabase (PostgreSQL) para armazenamento de dados.

### Diagrama de Arquitetura

```mermaid
graph TD
    A[Usuário] --> B{Frontend (React)};
    B --> C{Backend (Node.js)};
    C --> D[Supabase (PostgreSQL)];
    C --> E[Pluggy API];
    C --> F[OpenAI API];
    E --> G[Bancos];
```

## 2. Frontend (React + Vite)

-   **Framework**: React 18 com Vite
-   **Estilização**: Tailwind CSS v4
-   **Gráficos**: Recharts
-   **Componentes**: shadcn/ui (base)

### Estrutura de Pastas

```
/src
|-- components/      # Componentes React reutilizáveis
|   |-- GraficoEvolucao.jsx
|   |-- TabelaCategorias.jsx
|   `-- PluggyConnect.jsx
|-- services/        # Lógica de comunicação com API
|-- App.jsx          # Componente principal
|-- main.jsx         # Ponto de entrada da aplicação
`-- index.css        # Estilos globais
```

### Scripts Principais

-   `npm run dev`: Inicia servidor de desenvolvimento
-   `npm run build`: Gera build de produção
-   `npm run preview`: Visualiza build de produção

## 3. Backend (Node.js + Express)

-   **Framework**: Node.js com Express
-   **Banco de Dados ORM**: Supabase Client
-   **Integrações**: Pluggy SDK, OpenAI SDK

### Estrutura de Pastas

```
/server
|-- src/
|   |-- routes/          # Definição de rotas da API
|   |   |-- projection.js
|   |   |-- intelligence.js
|   |   `-- pluggy.js
|   |-- services/        # Lógica de negócio e integrações
|   |   |-- pluggyService.js
|   |   `-- intelligentAnalysis.js
|   |-- config/          # Configuração de banco de dados
|   |   `-- supabase.js
|   `-- index.js         # Ponto de entrada da API
|-- .env               # Variáveis de ambiente
`-- package.json
```

### Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | /api/pluggy/connect-token | Cria token para widget Pluggy |
| GET | /api/pluggy/items | Lista bancos conectados |
| POST | /api/pluggy/sync | Sincroniza transações de um banco |
| GET | /api/projection/timeline | Retorna dados para gráfico de projeção |
| GET | /api/intelligence/analysis | Gera análise de padrões com IA |
| GET | /api/intelligence/projection | Gera projeção de gastos com IA |
| GET | /api/intelligence/anomalies | Detecta anomalias com IA |

## 4. Banco de Dados (Supabase)

O banco de dados PostgreSQL é gerenciado pelo Supabase e possui a seguinte estrutura principal:

### Schema do Banco

-   **users**: Informações dos usuários
-   **accounts**: Contas bancárias dos usuários
-   **transactions**: Transações financeiras
-   **categories**: Categorias de transações
-   **sync_logs**: Histórico de sincronizações

### Relações

-   `users` (1) -> (N) `accounts`
-   `accounts` (1) -> (N) `transactions`
-   `categories` (1) -> (N) `transactions`

## 5. Integrações

### Pluggy (Open Finance)

-   **SDK**: `pluggy-sdk`
-   **Autenticação**: Client ID + Client Secret
-   **Fluxo**: Geração de Connect Token -> Widget no frontend -> Sincronização no backend

### OpenAI (Inteligência Artificial)

-   **SDK**: `openai`
-   **Modelo**: `gpt-4.1-mini`
-   **Funcionalidades**: Análise de padrões, projeção de gastos, detecção de anomalias

## 6. Como Rodar Localmente

1.  **Clonar repositório**
2.  **Configurar `.env`** no backend com as credenciais (Supabase, Pluggy, OpenAI)
3.  **Instalar dependências**:
    ```bash
    # Frontend
    cd /path/to/frontend
    npm install
    
    # Backend
    cd /path/to/backend
    npm install
    ```
4.  **Iniciar serviços**:
    ```bash
    # Frontend
    npm run dev
    
    # Backend
    npm start
    ```
5.  **Acessar `http://localhost:5173`**

---

*Esta documentação foi gerada por Manus AI.*

