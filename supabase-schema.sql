-- Orquestrador Open Finance - Database Schema
-- PostgreSQL / Supabase

-- ============================================
-- TABELA: users
-- Usuários do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: bank_accounts
-- Contas bancárias do usuário
-- ============================================
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_code VARCHAR(10) NOT NULL, -- Código COMPE (ex: 001 para BB)
  bank_name VARCHAR(100) NOT NULL, -- Nome do banco
  agency VARCHAR(20) NOT NULL, -- Agência sem DV
  account VARCHAR(20) NOT NULL, -- Conta sem DV
  account_type VARCHAR(20) NOT NULL, -- 'checking', 'savings', 'credit_card'
  balance DECIMAL(15, 2) DEFAULT 0, -- Saldo atual
  available_balance DECIMAL(15, 2) DEFAULT 0, -- Saldo disponível
  credit_limit DECIMAL(15, 2), -- Limite de crédito (para cartões)
  is_primary BOOLEAN DEFAULT FALSE, -- Conta principal
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bank_code, agency, account)
);

-- ============================================
-- TABELA: categories
-- Categorias de transações
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL para categorias padrão
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- Nome do ícone
  color VARCHAR(20), -- Cor em hex
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE, -- Para subcategorias
  is_system BOOLEAN DEFAULT FALSE, -- Categoria do sistema (não pode ser deletada)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: tags
-- Tags personalizadas
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ============================================
-- TABELA: transactions
-- Transações financeiras
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  external_id VARCHAR(255), -- ID da transação no banco
  type VARCHAR(20) NOT NULL, -- 'income', 'expense', 'transfer'
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
  payment_method VARCHAR(50), -- 'pix', 'ted', 'boleto', 'debit_card', 'credit_card', 'cash'
  
  -- Dados da contrapartida
  counterparty_name VARCHAR(255),
  counterparty_document VARCHAR(20), -- CPF/CNPJ
  counterparty_bank VARCHAR(10),
  counterparty_agency VARCHAR(20),
  counterparty_account VARCHAR(20),
  
  -- Metadados
  history_code VARCHAR(10), -- Código de histórico do BB
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_id UUID, -- ID do grupo de recorrência
  installment_number INT, -- Número da parcela (se parcelado)
  total_installments INT, -- Total de parcelas
  
  -- Flags
  is_transfer BOOLEAN DEFAULT FALSE, -- Se é transferência entre contas próprias
  is_reviewed BOOLEAN DEFAULT FALSE, -- Se foi revisado pelo usuário
  is_categorized_by_ai BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(account_id, external_id)
);

-- ============================================
-- TABELA: transaction_tags
-- Relacionamento entre transações e tags
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_tags (
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);

-- ============================================
-- TABELA: installments
-- Parcelas de compras (principalmente cartão)
-- ============================================
CREATE TABLE IF NOT EXISTS installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  description TEXT NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL, -- Valor total da compra
  installment_amount DECIMAL(15, 2) NOT NULL, -- Valor de cada parcela
  current_installment INT NOT NULL, -- Parcela atual
  total_installments INT NOT NULL, -- Total de parcelas
  
  first_due_date DATE NOT NULL, -- Data da primeira parcela
  merchant VARCHAR(255), -- Nome do estabelecimento
  
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: recurring_expenses
-- Despesas eventuais (IPTU, IPVA, seguro, etc)
-- ============================================
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'semiannual', 'annual'
  due_day INT, -- Dia do vencimento
  due_month INT, -- Mês do vencimento (para anuais)
  
  next_due_date DATE,
  last_paid_date DATE,
  
  monthly_provision DECIMAL(15, 2), -- Provisão mensal
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: category_limits
-- Limites de gastos por categoria
-- ============================================
CREATE TABLE IF NOT EXISTS category_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  
  monthly_limit DECIMAL(15, 2) NOT NULL,
  alert_threshold INT DEFAULT 90, -- Percentual para alertar (ex: 90%)
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, category_id)
);

-- ============================================
-- TABELA: alerts
-- Alertas e notificações
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'low_balance', 'bill_due', 'limit_reached', etc
  severity VARCHAR(20) NOT NULL, -- 'critical', 'warning', 'info'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(255), -- URL para ação recomendada
  
  related_transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  related_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA: sync_logs
-- Logs de sincronização com bancos
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  transactions_imported INT DEFAULT 0,
  transactions_updated INT DEFAULT 0,
  transactions_skipped INT DEFAULT 0,
  
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: bb_tokens
-- Tokens OAuth2 do Banco do Brasil
-- ============================================
CREATE TABLE IF NOT EXISTS bb_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  scope TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Transações
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);

-- Contas
CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_active ON bank_accounts(is_active);

-- Categorias
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Alertas
CREATE INDEX idx_alerts_user_unread ON alerts(user_id, is_read);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Parcelas
CREATE INDEX idx_installments_user ON installments(user_id);
CREATE INDEX idx_installments_account ON installments(account_id);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON installments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_expenses_updated_at BEFORE UPDATE ON recurring_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_limits_updated_at BEFORE UPDATE ON category_limits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bb_tokens_updated_at BEFORE UPDATE ON bb_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

