import { useState, useEffect } from 'react';

const API_URL = 'https://3001-iihbw0n68wr5dxe8om16g-89d11ba9.manusvm.computer/api';
const USER_ID = '50ab65c7-e7ad-4858-8d2e-723cba7d0842';

export default function TabelaCategorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}/projection/by-category?userId=${USER_ID}`);
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatMonth = (month) => {
    const [year, monthNum] = month.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[parseInt(monthNum) - 1];
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'SUPERMERCADO': '🛒',
      'RESTAURANTES': '🍔',
      'DÍVIDAS': '💳',
      'ALUGUEL': '🏠',
      'TRANSPORTE': '🚗',
      'EDUCAÇÃO': '📚',
      'SAÚDE': '💊',
      'LAZER': '🎬',
      'PET SHOP': '🐱'
    };
    return icons[category] || '📊';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'SUPERMERCADO': 'bg-green-100 text-green-800',
      'RESTAURANTES': 'bg-orange-100 text-orange-800',
      'DÍVIDAS': 'bg-red-100 text-red-800',
      'ALUGUEL': 'bg-blue-100 text-blue-800',
      'TRANSPORTE': 'bg-purple-100 text-purple-800',
      'EDUCAÇÃO': 'bg-indigo-100 text-indigo-800',
      'SAÚDE': 'bg-pink-100 text-pink-800',
      'LAZER': 'bg-yellow-100 text-yellow-800',
      'PET SHOP': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-slate-600">Carregando categorias...</span>
        </div>
      </div>
    );
  }

  // Pegar todos os meses únicos
  const allMonths = [...new Set(
    categories.flatMap(cat => Object.keys(cat.months))
  )].sort();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Gastos por Categoria</h2>
        <p className="text-slate-600 mt-1">{categories.length} categorias encontradas</p>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">
                Categoria
              </th>
              {allMonths.map(month => (
                <th key={month} className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {formatMonth(month)}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider sticky right-0 bg-slate-50 z-10">
                Total
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider sticky right-0 bg-slate-50 z-10">
                Média
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category, index) => (
              <tr 
                key={index} 
                className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
                onClick={() => toggleCategory(category.category)}
              >
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white hover:bg-purple-50 z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(category.category)}</span>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(category.category)}`}>
                        {category.category}
                      </span>
                    </div>
                  </div>
                </td>
                {allMonths.map(month => (
                  <td key={month} className="px-4 py-4 text-center text-sm">
                    {category.months[month] ? (
                      <span className="font-medium text-slate-700">
                        {formatCurrency(category.months[month])}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-white hover:bg-purple-50 z-10">
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(category.total)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-white hover:bg-purple-50 z-10">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(category.average)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 border-t-2 border-slate-300">
            <tr>
              <td className="px-6 py-4 font-bold text-slate-800 sticky left-0 bg-slate-100 z-10">
                TOTAL GERAL
              </td>
              {allMonths.map(month => {
                const monthTotal = categories.reduce((sum, cat) => 
                  sum + (cat.months[month] || 0), 0
                );
                return (
                  <td key={month} className="px-4 py-4 text-center font-bold text-slate-900">
                    {formatCurrency(monthTotal)}
                  </td>
                );
              })}
              <td className="px-6 py-4 text-right font-bold text-lg text-slate-900 sticky right-0 bg-slate-100 z-10">
                {formatCurrency(categories.reduce((sum, cat) => sum + cat.total, 0))}
              </td>
              <td className="px-6 py-4 text-right font-bold text-blue-700 sticky right-0 bg-slate-100 z-10">
                {formatCurrency(
                  categories.reduce((sum, cat) => sum + cat.average, 0)
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Dica */}
      <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> Clique em uma categoria para ver mais detalhes (em breve)
        </p>
      </div>
    </div>
  );
}

