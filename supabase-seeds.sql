-- Orquestrador Open Finance - Seeds
-- Categorias padrão e dados iniciais

-- ============================================
-- CATEGORIAS PRINCIPAIS (14 categorias)
-- ============================================

INSERT INTO categories (id, name, icon, color, is_system) VALUES
-- 1. Alimentação
('11111111-1111-1111-1111-111111111111', 'Alimentação', '🍔', '#FF6B6B', TRUE),
-- 2. Transporte
('22222222-2222-2222-2222-222222222222', 'Transporte', '🚗', '#4ECDC4', TRUE),
-- 3. Moradia
('33333333-3333-3333-3333-333333333333', 'Moradia', '🏠', '#45B7D1', TRUE),
-- 4. Saúde
('44444444-4444-4444-4444-444444444444', 'Saúde', '💊', '#96CEB4', TRUE),
-- 5. Educação
('55555555-5555-5555-5555-555555555555', 'Educação', '🎓', '#FFEAA7', TRUE),
-- 6. Pets
('66666666-6666-6666-6666-666666666666', 'Pets', '🐱', '#DFE6E9', TRUE),
-- 7. Cartão de Crédito
('77777777-7777-7777-7777-777777777777', 'Cartão de Crédito', '💳', '#FD79A8', TRUE),
-- 8. Lazer
('88888888-8888-8888-8888-888888888888', 'Lazer', '🎮', '#A29BFE', TRUE),
-- 9. Pessoal
('99999999-9999-9999-9999-999999999999', 'Pessoal', '👔', '#FAB1A0', TRUE),
-- 10. Investimentos
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Investimentos', '💰', '#55EFC4', TRUE),
-- 11. Assinaturas
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Assinaturas', '📱', '#74B9FF', TRUE),
-- 12. Impostos e Taxas
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Impostos e Taxas', '🏛️', '#636E72', TRUE),
-- 13. Manutenção
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Manutenção', '🔧', '#FD79A8', TRUE),
-- 14. Trabalho
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Trabalho', '💼', '#6C5CE7', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUBCATEGORIAS
-- ============================================

-- Alimentação
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Restaurante', '🍽️', '#FF6B6B', '11111111-1111-1111-1111-111111111111', TRUE),
('Mercado', '🛒', '#FF6B6B', '11111111-1111-1111-1111-111111111111', TRUE),
('Delivery', '🛵', '#FF6B6B', '11111111-1111-1111-1111-111111111111', TRUE),
('Padaria', '🥖', '#FF6B6B', '11111111-1111-1111-1111-111111111111', TRUE),
('Lanchonete', '🍔', '#FF6B6B', '11111111-1111-1111-1111-111111111111', TRUE)
ON CONFLICT DO NOTHING;

-- Transporte
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Uber/99', '🚕', '#4ECDC4', '22222222-2222-2222-2222-222222222222', TRUE),
('Combustível', '⛽', '#4ECDC4', '22222222-2222-2222-2222-222222222222', TRUE),
('Estacionamento', '🅿️', '#4ECDC4', '22222222-2222-2222-2222-222222222222', TRUE),
('Manutenção Veículo', '🔧', '#4ECDC4', '22222222-2222-2222-2222-222222222222', TRUE),
('Transporte Público', '🚌', '#4ECDC4', '22222222-2222-2222-2222-222222222222', TRUE)
ON CONFLICT DO NOTHING;

-- Moradia
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Aluguel', '🏠', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE),
('Condomínio', '🏢', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE),
('Luz', '💡', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE),
('Água', '💧', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE),
('Internet', '📡', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE),
('Gás', '🔥', '#45B7D1', '33333333-3333-3333-3333-333333333333', TRUE)
ON CONFLICT DO NOTHING;

-- Saúde
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Farmácia', '💊', '#96CEB4', '44444444-4444-4444-4444-444444444444', TRUE),
('Consultas', '👨‍⚕️', '#96CEB4', '44444444-4444-4444-4444-444444444444', TRUE),
('Plano de Saúde', '🏥', '#96CEB4', '44444444-4444-4444-4444-444444444444', TRUE),
('Exames', '🔬', '#96CEB4', '44444444-4444-4444-4444-444444444444', TRUE),
('Dentista', '🦷', '#96CEB4', '44444444-4444-4444-4444-444444444444', TRUE)
ON CONFLICT DO NOTHING;

-- Educação
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Faculdade', '🎓', '#FFEAA7', '55555555-5555-5555-5555-555555555555', TRUE),
('Cursos', '📚', '#FFEAA7', '55555555-5555-5555-5555-555555555555', TRUE),
('Livros', '📖', '#FFEAA7', '55555555-5555-5555-5555-555555555555', TRUE),
('Material Escolar', '✏️', '#FFEAA7', '55555555-5555-5555-5555-555555555555', TRUE)
ON CONFLICT DO NOTHING;

-- Pets
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Ração', '🍖', '#DFE6E9', '66666666-6666-6666-6666-666666666666', TRUE),
('Veterinário', '🏥', '#DFE6E9', '66666666-6666-6666-6666-666666666666', TRUE),
('Petshop', '🐾', '#DFE6E9', '66666666-6666-6666-6666-666666666666', TRUE)
ON CONFLICT DO NOTHING;

-- Lazer
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Streaming', '📺', '#A29BFE', '88888888-8888-8888-8888-888888888888', TRUE),
('Cinema', '🎬', '#A29BFE', '88888888-8888-8888-8888-888888888888', TRUE),
('Viagens', '✈️', '#A29BFE', '88888888-8888-8888-8888-888888888888', TRUE),
('Shows/Eventos', '🎵', '#A29BFE', '88888888-8888-8888-8888-888888888888', TRUE)
ON CONFLICT DO NOTHING;

-- Pessoal
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Roupas', '👕', '#FAB1A0', '99999999-9999-9999-9999-999999999999', TRUE),
('Cabeleireiro', '💇', '#FAB1A0', '99999999-9999-9999-9999-999999999999', TRUE),
('Academia', '💪', '#FAB1A0', '99999999-9999-9999-9999-999999999999', TRUE),
('Cosméticos', '💄', '#FAB1A0', '99999999-9999-9999-9999-999999999999', TRUE)
ON CONFLICT DO NOTHING;

-- Assinaturas
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Netflix', '📺', '#74B9FF', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE),
('Spotify', '🎵', '#74B9FF', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE),
('Amazon Prime', '📦', '#74B9FF', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE),
('iCloud', '☁️', '#74B9FF', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', TRUE)
ON CONFLICT DO NOTHING;

-- Impostos e Taxas
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('IPTU', '🏛️', '#636E72', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE),
('IPVA', '🚗', '#636E72', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE),
('Seguro Carro', '🚗', '#636E72', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE),
('Seguro Casa', '🏠', '#636E72', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE),
('Imposto de Renda', '💰', '#636E72', 'cccccccc-cccc-cccc-cccc-cccccccccccc', TRUE)
ON CONFLICT DO NOTHING;

-- Trabalho
INSERT INTO categories (name, icon, color, parent_id, is_system) VALUES
('Material', '📎', '#6C5CE7', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', TRUE),
('Equipamentos', '💻', '#6C5CE7', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', TRUE),
('Cursos Profissionais', '📚', '#6C5CE7', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- REGRAS DE CATEGORIZAÇÃO AUTOMÁTICA
-- ============================================

-- Tabela auxiliar para mapeamento de palavras-chave
CREATE TABLE IF NOT EXISTS categorization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  confidence INT DEFAULT 100, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regras de categorização (palavras-chave comuns)
INSERT INTO categorization_rules (keyword, category_id, confidence) VALUES
-- Alimentação
('IFOOD', (SELECT id FROM categories WHERE name = 'Delivery'), 100),
('UBER EATS', (SELECT id FROM categories WHERE name = 'Delivery'), 100),
('RAPPI', (SELECT id FROM categories WHERE name = 'Delivery'), 100),
('RESTAURANTE', (SELECT id FROM categories WHERE name = 'Restaurante'), 90),
('LANCHONETE', (SELECT id FROM categories WHERE name = 'Lanchonete'), 90),
('PADARIA', (SELECT id FROM categories WHERE name = 'Padaria'), 90),
('MERCADO', (SELECT id FROM categories WHERE name = 'Mercado'), 90),
('SUPERMERCADO', (SELECT id FROM categories WHERE name = 'Mercado'), 90),
('CARREFOUR', (SELECT id FROM categories WHERE name = 'Mercado'), 100),
('EXTRA', (SELECT id FROM categories WHERE name = 'Mercado'), 100),
('PÃO DE AÇUCAR', (SELECT id FROM categories WHERE name = 'Mercado'), 100),

-- Transporte
('UBER', (SELECT id FROM categories WHERE name = 'Uber/99'), 100),
('99POP', (SELECT id FROM categories WHERE name = 'Uber/99'), 100),
('99TAXI', (SELECT id FROM categories WHERE name = 'Uber/99'), 100),
('POSTO', (SELECT id FROM categories WHERE name = 'Combustível'), 80),
('COMBUSTIVEL', (SELECT id FROM categories WHERE name = 'Combustível'), 90),
('GASOLINA', (SELECT id FROM categories WHERE name = 'Combustível'), 90),
('SHELL', (SELECT id FROM categories WHERE name = 'Combustível'), 100),
('IPIRANGA', (SELECT id FROM categories WHERE name = 'Combustível'), 100),
('ESTACIONAMENTO', (SELECT id FROM categories WHERE name = 'Estacionamento'), 100),

-- Saúde
('FARMACIA', (SELECT id FROM categories WHERE name = 'Farmácia'), 100),
('DROGARIA', (SELECT id FROM categories WHERE name = 'Farmácia'), 100),
('DROGA RAIA', (SELECT id FROM categories WHERE name = 'Farmácia'), 100),
('DROGASIL', (SELECT id FROM categories WHERE name = 'Farmácia'), 100),
('CONSULTA', (SELECT id FROM categories WHERE name = 'Consultas'), 90),
('MEDICO', (SELECT id FROM categories WHERE name = 'Consultas'), 90),
('CLINICA', (SELECT id FROM categories WHERE name = 'Consultas'), 80),

-- Streaming e Assinaturas
('NETFLIX', (SELECT id FROM categories WHERE name = 'Netflix'), 100),
('SPOTIFY', (SELECT id FROM categories WHERE name = 'Spotify'), 100),
('AMAZON PRIME', (SELECT id FROM categories WHERE name = 'Amazon Prime'), 100),
('ICLOUD', (SELECT id FROM categories WHERE name = 'iCloud'), 100),
('APPLE.COM', (SELECT id FROM categories WHERE name = 'iCloud'), 90),

-- Pets
('PETSHOP', (SELECT id FROM categories WHERE name = 'Petshop'), 100),
('VETERINARI', (SELECT id FROM categories WHERE name = 'Veterinário'), 90),
('RACAO', (SELECT id FROM categories WHERE name = 'Ração'), 90)

ON CONFLICT DO NOTHING;

