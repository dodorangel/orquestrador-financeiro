import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const API_URL = 'https://3001-iihbw0n68wr5dxe8om16g-89d11ba9.manusvm.computer/api';
const USER_ID = '50ab65c7-e7ad-4858-8d2e-723cba7d0842';

export default function GraficoEvolucao() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}/projection/timeline?userId=${USER_ID}&months=6`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data.timeline);
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatMonth = (month) => {
    const [year, monthNum] = month.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(monthNum) - 1]}/${year.substring(2)}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-slate-200">
          <p className="font-bold text-slate-800 mb-2">
            {formatMonth(data.month)}
            {data.isProjection && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Projeção</span>}
          </p>
          <p className="text-green-600 font-semibold">
            💰 Receitas: {formatCurrency(data.income)}
          </p>
          <p className="text-red-600 font-semibold">
            💸 Despesas: {formatCurrency(data.expenses)}
          </p>
          <p className={`font-bold ${data.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            💚 Saldo: {formatCurrency(data.balance)}
          </p>
          {data.isProjection && data.confidence && (
            <p className="text-xs text-slate-500 mt-2">
              Confiança: {Math.round(data.confidence * 100)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-slate-600">Carregando dados...</span>
        </div>
      </div>
    );
  }

  // Encontrar índice onde começa a projeção
  const projectionStartIndex = data.findIndex(d => d.isProjection);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Evolução Temporal</h2>
        <p className="text-slate-600 mt-1">
          Histórico de {summary?.totalMonths || 0} meses + Projeção de {summary?.projectedMonths || 0} meses
        </p>
      </div>

      {/* Resumo */}
      {summary && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">Média Mensal - Receitas</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(summary.avgMonthlyIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Média Mensal - Despesas</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(summary.avgMonthlyExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Média Mensal - Saldo</p>
              <p className={`text-xl font-bold ${summary.avgMonthlyBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(summary.avgMonthlyBalance)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatMonth}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Linha vertical separando histórico de projeção */}
            {projectionStartIndex > 0 && (
              <ReferenceLine 
                x={data[projectionStartIndex - 1].month} 
                stroke="#9333ea" 
                strokeDasharray="5 5"
                label={{ value: 'HOJE', position: 'top', fill: '#9333ea', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            
            {/* Linha de Receitas */}
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Receitas"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isProjection ? "5 5" : "0"}
            />
            
            {/* Linha de Despesas */}
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Despesas"
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isProjection ? "5 5" : "0"}
            />
            
            {/* Linha de Saldo */}
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Saldo"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
              strokeDasharray={(entry) => entry.isProjection ? "5 5" : "0"}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legenda adicional */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-green-500"></div>
            <span className="text-slate-600">Dados Reais</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-purple-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #a855f7, #a855f7 5px, transparent 5px, transparent 10px)' }}></div>
            <span className="text-slate-600">Projeção IA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

