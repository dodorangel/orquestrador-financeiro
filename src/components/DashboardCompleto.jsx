import { useState, useEffect } from 'react';

export default function DashboardCompleto() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [syncLogs, setSyncLogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = '50ab65c7-e7ad-4858-8d2e-723cba7d0842'; // Usuário de teste
  const accountId = 'a0dc2ab4-a61d-4a40-8418-719de2bd6e45'; // Conta BB de teste

  const API_URL = 'https://3001-iihbw0n68wr5dxe8om16g-89d11ba9.manusvm.computer/api';

  // Carrega dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar transações
      const transRes = await fetch(`${API_URL}/transactions?userId=${userId}&limit=50`);
      const transData = await transRes.json();
      if (transData.success) {
        setTransactions(transData.data);
      }

      // Carregar resumo
      const summaryRes = await fetch(`${API_URL}/transactions/summary?userId=${userId}`);
      const summaryData = await summaryRes.json();
      if (summaryData.success) {
        setSummary(summaryData.data);
      }

      // Carregar logs de sincronização
      const logsRes = await fetch(`${API_URL}/sync/logs?userId=${userId}&limit=10`);
      const logsData = await logsRes.json();
      if (logsData.success) {
        setSyncLogs(logsData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/sync/bb/extratos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountId })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `✅ Sincronização concluída! ${data.data.imported} transações importadas.` });
        loadData();
      } else {
        setMessage({ type: 'error', text: `❌ Erro: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Erro ao sincronizar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorize = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/categorize/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, limit: 50 })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `✅ Categorização concluída! ${data.data.categorized} transações categorizadas.` });
        loadData();
      } else {
        setMessage({ type: 'error', text: `❌ Erro: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Erro ao categorizar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Orquestrador Financeiro
              </h1>
              <p className="text-slate-600 mt-1">Controle inteligente com integração Open Finance</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSync}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Sincronizando...' : 'Sincronizar BB'}
              </button>
              
              <button
                onClick={handleCategorize}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {loading ? 'Categorizando...' : 'Categorizar com IA'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de Feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl shadow-lg ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800'
          }`}>
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Receitas */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 font-semibold">Receitas</span>
              <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(summary?.totalIncome || 0)}</p>
          </div>

          {/* Despesas */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 font-semibold">Despesas</span>
              <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(summary?.totalExpenses || 0)}</p>
          </div>

          {/* Saldo */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 font-semibold">Saldo</span>
              <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(summary?.balance || 0)}</p>
          </div>

          {/* Transações */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 font-semibold">Transações</span>
              <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-3xl font-bold">{summary?.totalTransactions || 0}</p>
          </div>
        </div>

        {/* Tabela de Transações */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Últimas Transações</h2>
            <p className="text-slate-600 mt-1">{transactions.length} transações encontradas</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {transaction.payment_method || 'other'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {transaction.status === 'completed' ? 'Concluída' : transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histórico de Sincronizações */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Histórico de Sincronizações</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {syncLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    log.status === 'success' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {log.status === 'success' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {log.status === 'success' ? 'Sincronização bem-sucedida' : 'Erro na sincronização'}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      {log.transactions_imported || 0} importadas • {log.transactions_skipped || 0} ignoradas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

