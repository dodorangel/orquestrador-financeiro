import { useState } from 'react';
import GraficoEvolucao from './components/GraficoEvolucao';
import TabelaCategorias from './components/TabelaCategorias';
import DashboardCompleto from './components/DashboardCompleto';
import PluggyConnect from './components/PluggyConnect';

function App() {
  const [activeView, setActiveView] = useState('projecao'); // 'projecao', 'dashboard' ou 'connect'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Orquestrador Financeiro
              </h1>
              <p className="text-slate-600 mt-1">Controle inteligente das suas finanças</p>
            </div>
            
            {/* Navegação */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveView('projecao')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeView === 'projecao'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                📊 Projeção
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeView === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                💳 Dashboard
              </button>
              <button
                onClick={() => setActiveView('connect')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeView === 'connect'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                🏬 Conectar Bancos
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'projecao' ? (
          <div className="space-y-8">
            {/* Banner Informativo */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🔮</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Projeção Financeira Inteligente</h2>
                  <p className="text-purple-100 text-lg">
                    Visualize sua evolução financeira e projete os próximos 6 meses com base em seus padrões de gastos.
                    A IA analisa seus dados históricos e prevê tendências futuras.
                  </p>
                </div>
              </div>
            </div>

            {/* Gráfico de Evolução */}
            <GraficoEvolucao />

            {/* Tabela por Categoria */}
            <TabelaCategorias />

            {/* Cards de Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2">Economia Potencial</h3>
                <p className="text-3xl font-bold mb-2">R$ 2.400/mês</p>
                <p className="text-green-100 text-sm">
                  Aplicando o cenário moderado de economia
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-2">Tendência</h3>
                <p className="text-3xl font-bold mb-2">Estável</p>
                <p className="text-blue-100 text-sm">
                  Seus gastos estão se mantendo consistentes
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Meta do Mês</h3>
                <p className="text-3xl font-bold mb-2">R$ 14.000</p>
                <p className="text-purple-100 text-sm">
                  Limite de gastos para este mês
                </p>
              </div>
            </div>

            {/* Dicas de Economia */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Dicas Inteligentes de Economia
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Supermercado</h4>
                    <p className="text-slate-600 text-sm">
                      Você gastou R$ 7.000 em supermercado nos últimos 11 meses. Planeje suas compras e economize até R$ 500/mês.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                  <span className="text-2xl">🍔</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Restaurantes</h4>
                    <p className="text-slate-600 text-sm">
                      Gastos com delivery e restaurantes: R$ 3.500. Reduzindo para 2x por semana, economize R$ 800/mês.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                  <span className="text-2xl">💳</span>
                  <div>
                    <h4 className="font-bold text-slate-800">Dívidas</h4>
                    <p className="text-slate-600 text-sm">
                      Priorize quitar dívidas com juros altos. Economizando R$ 1.000/mês, você quita em 8 meses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeView === 'dashboard' ? (
          <DashboardCompleto />
        ) : (
          <PluggyConnect />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600 text-sm">
            Orquestrador Financeiro - Desenvolvido com 💜 para ajudar você a ter controle total das suas finanças
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

