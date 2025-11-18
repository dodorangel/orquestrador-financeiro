import { useState, useEffect } from 'react';

const BACKEND_URL = 'https://3001-iihbw0n68wr5dxe8om16g-89d11ba9.manusvm.computer/api';
const USER_ID = '50ab65c7-e7ad-4858-8d2e-723cba7d0842';
const ACCOUNT_ID = 'a0dc2ab4-a61d-4a40-8418-719de2bd6e45';

export default function PluggyConnect() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  // Carrega items ao montar componente
  useEffect(() => {
    loadItems();
  }, []);

  // Carrega lista de items (bancos conectados)
  const loadItems = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/pluggy/items?userId=${USER_ID}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Erro ao carregar items:', error);
    }
  };

  // Abre widget de conexão
  const openWidget = async () => {
    try {
      setLoading(true);
      setMessage('Criando token de conexão...');

      // Cria Connect Token
      const response = await fetch(`${BACKEND_URL}/pluggy/connect-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setMessage('Abrindo widget de conexão...');

      // Abre widget Pluggy
      const pluggyConnect = new window.PluggyConnect({
        connectToken: data.token,
        includeSandbox: true, // Permite bancos de teste
        onSuccess: async (itemData) => {
          console.log('✅ Banco conectado com sucesso!', itemData);
          setMessage(`Banco conectado: ${itemData.connector.name}`);
          
          // Recarrega lista de items
          await loadItems();
          
          // Sincroniza automaticamente
          if (itemData.item && itemData.item.id) {
            await syncItemAutomatically(itemData.item.id);
          }
        },
        onError: (error) => {
          console.error('❌ Erro ao conectar banco:', error);
          setMessage(`Erro: ${error.message || 'Falha ao conectar'}`);
        },
        onClose: () => {
          console.log('Widget fechado');
          setMessage('');
        },
      });

      pluggyConnect.init();
    } catch (error) {
      console.error('Erro ao abrir widget:', error);
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Sincroniza item automaticamente após conexão
  const syncItemAutomatically = async (itemId) => {
    try {
      setSyncing(true);
      setMessage('🔄 Buscando contas...');

      // Busca contas do item
      const accountsResponse = await fetch(`${BACKEND_URL}/pluggy/accounts/${itemId}`);
      const accountsData = await accountsResponse.json();

      if (!accountsData.success || accountsData.accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada');
      }

      setMessage(`📊 ${accountsData.accounts.length} conta(s) encontrada(s). Sincronizando transações...`);

      // Sincroniza primeira conta (pode ser expandido para múltiplas contas)
      const pluggyAccountId = accountsData.accounts[0].id;

      const syncResponse = await fetch(`${BACKEND_URL}/pluggy/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          itemId: itemId,
          pluggyAccountId: pluggyAccountId,
        }),
      });

      const syncData = await syncResponse.json();

      if (syncData.success) {
        setMessage(`✅ ${syncData.imported} transações importadas! ${syncData.skipped} duplicatas ignoradas.`);
        
        // Aguarda 3 segundos e limpa mensagem
        setTimeout(() => {
          setMessage('');
          // Recarrega página para atualizar dashboard
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(syncData.error);
      }

    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Sincroniza item manualmente
  const syncItem = async (itemId) => {
    await syncItemAutomatically(itemId);
  };

  // Deleta item (desconecta banco)
  const deleteItem = async (itemId) => {
    if (!confirm('Deseja realmente desconectar este banco?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/pluggy/items/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Banco desconectado!');
        await loadItems();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      setMessage(`❌ Erro: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bancos Conectados</h2>
          <p className="text-gray-600">Conecte seus bancos para sincronização automática</p>
        </div>
        <button
          onClick={openWidget}
          disabled={loading || syncing}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Carregando...' : '+ Conectar Banco'}
        </button>
      </div>

      {/* Mensagem de status */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.includes('❌') || message.includes('Erro') 
            ? 'bg-red-100 text-red-800' 
            : message.includes('✅')
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Lista de bancos conectados */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum banco conectado</h3>
          <p className="text-gray-500">Clique em "Conectar Banco" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {item.connector.imageUrl ? (
                    <img 
                      src={item.connector.imageUrl} 
                      alt={item.connector.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      🏦
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.connector.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.status === 'UPDATED' ? '✅ Atualizado' : '⚠️ Requer atualização'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <p>Última atualização: {new Date(item.updatedAt).toLocaleString('pt-BR')}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => syncItem(item.id)}
                  disabled={syncing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  🔄 Sincronizar
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Como funciona?
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Clique em "Conectar Banco" e escolha seu banco</li>
          <li>• Faça login com suas credenciais (seguro via Pluggy)</li>
          <li>• Suas transações serão sincronizadas automaticamente</li>
          <li>• Você pode conectar múltiplos bancos e cartões</li>
        </ul>
      </div>
    </div>
  );
}

