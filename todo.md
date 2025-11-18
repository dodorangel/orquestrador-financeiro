# Orquestrador Open Finance - TODO

## 🎯 DESENVOLVIMENTO INTENSIVO (29-30 OUT 2025)

### ✅ Concluído
- [x] Análise financeira completa dos últimos 12 meses
- [x] Dashboard React inicial funcionando
- [x] Schema completo do banco de dados (14 tabelas)
- [x] Seeds com 14 categorias + 50 subcategorias
- [x] Regras de categorização automática
- [x] Documentação da API do BB
- [x] Roadmap completo definido

### 🔄 DIA 1 - HOJE (29/10) - Backend e Integração BB

#### Manhã (4-5h)
- [x] Configurar Supabase (banco de dados em produção)
- [x] Executar schema SQL no Supabase
- [x] Executar seeds no Supabase
- [x] Criar arquivo .env com credenciais
- [x] Implementar backend básico (Node.js)
- [ ] Configurar tRPC para API
- [x] Implementar OAuth2 com Banco do Brasil
- [ ] Testar autenticação em homologação

#### Tarde (4-5h)
- [x] Criar serviço de sincronização de extratos
- [x] Implementar paginação automática (200 registros/página)
- [x] Processar e normalizar transações do BB
- [x] Salvar transações no banco de dados
- [x] Detectar duplicatas
- [x] Criar logs de sincronização
- [ ] Testar sincronização com dados reais do usuário
- [ ] Botão "Sincronizar Agora" na interface

**Meta do Dia 1:** Sistema conectado ao BB e sincronizando extratos ✅

### 🔄 DIA 2 - AMANHÃ (30/10) - IA e Interface

#### Manhã (4-5h)
- [ ] Integrar OpenAI API
- [ ] Implementar categorização automática com IA
- [ ] Sistema de aprendizado com correções do usuário
- [ ] Detectar parcelas de cartão automaticamente
- [ ] Agrupar parcelas da mesma compra
- [ ] Calcular parcelas futuras
- [ ] Implementar limites por categoria
- [ ] Alertas quando atingir 90% do limite

#### Tarde (4-5h)
- [ ] Dashboard completo com dados reais do BB
- [ ] Calendário financeiro
- [ ] Painel "Hoje" (ADHD-friendly)
- [ ] Painel "Esta Semana"
- [ ] Painel "Este Mês"
- [ ] Consolidação de cartão (fatura atual e próxima)
- [ ] Lançamentos rápidos (3 toques)
- [ ] Sistema de alertas inteligentes
- [ ] Modo "Tela Pública" (mascarar valores)

**Meta do Dia 2:** MVP completo funcionando ✅

### 🔄 Finalização
- [ ] Testes completos
- [ ] Ajustes de UX
- [ ] Documentação de uso
- [ ] Deploy em produção
- [ ] Criar checkpoint final
- [ ] Entregar link ao usuário

## 📊 Consumo de Créditos Estimado

- Dia 1: ~100.000 créditos
- Dia 2: ~100.000 créditos
- **Total**: ~200.000 créditos
- **Disponível**: 462.000 créditos
- **Sobra**: ~262.000 créditos

## 🎯 Compromisso

**Até 30/10 à noite**: MVP completo funcionando com integração BB! 🚀

