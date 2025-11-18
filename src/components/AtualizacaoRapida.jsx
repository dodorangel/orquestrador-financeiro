import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Wallet, CreditCard, Save, CheckCircle, AlertTriangle, 
  DollarSign, Plus, Minus
} from 'lucide-react'

const AtualizacaoRapida = ({ onDataUpdate }) => {
  // Estados para os saldos
  const [saldos, setSaldos] = useState({
    bb_conta: 9884.51,
    bb_cartao: 19303.50,
    caixa_conta: 144.86,
    caixa_cartao: 175.69
  })

  // Estados para nova transação rápida
  const [novaTransacao, setNovaTransacao] = useState({
    valor: '',
    descricao: '',
    tipo: 'gasto' // 'gasto' ou 'receita'
  })

  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  // Carregar dados salvos
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('saldos_rapidos')
    if (dadosSalvos) {
      setSaldos(JSON.parse(dadosSalvos))
    }
  }, [])

  // Salvar dados
  const salvarDados = async () => {
    setSalvando(true)
    try {
      // Salvar no localStorage
      localStorage.setItem('saldos_rapidos', JSON.stringify(saldos))
      
      // Notificar componente pai
      if (onDataUpdate) {
        onDataUpdate({
          saldos,
          ultimaAtualizacao: new Date().toISOString()
        })
      }

      setMensagem('✅ Dados salvos com sucesso!')
      setTimeout(() => setMensagem(''), 3000)
    } catch (error) {
      setMensagem('❌ Erro ao salvar dados')
      setTimeout(() => setMensagem(''), 3000)
    }
    setSalvando(false)
  }

  // Atualizar saldo
  const atualizarSaldo = (campo, valor) => {
    setSaldos(prev => ({
      ...prev,
      [campo]: parseFloat(valor) || 0
    }))
  }

  // Adicionar transação rápida
  const adicionarTransacao = () => {
    if (!novaTransacao.valor || !novaTransacao.descricao) {
      setMensagem('❌ Preencha valor e descrição')
      setTimeout(() => setMensagem(''), 3000)
      return
    }

    const valor = parseFloat(novaTransacao.valor)
    if (isNaN(valor)) {
      setMensagem('❌ Valor inválido')
      setTimeout(() => setMensagem(''), 3000)
      return
    }

    // Salvar transação no localStorage
    const transacoes = JSON.parse(localStorage.getItem('transacoes_rapidas') || '[]')
    const novaTransacaoCompleta = {
      id: Date.now(),
      data: new Date().toISOString().split('T')[0],
      descricao: novaTransacao.descricao,
      valor: novaTransacao.tipo === 'gasto' ? -valor : valor,
      tipo: novaTransacao.tipo,
      timestamp: new Date().toISOString()
    }

    transacoes.unshift(novaTransacaoCompleta)
    localStorage.setItem('transacoes_rapidas', JSON.stringify(transacoes.slice(0, 50))) // Manter apenas 50

    // Limpar formulário
    setNovaTransacao({ valor: '', descricao: '', tipo: 'gasto' })
    setMensagem('✅ Transação adicionada!')
    setTimeout(() => setMensagem(''), 3000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de Status */}
      {mensagem && (
        <Alert className={mensagem.includes('✅') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <AlertDescription className="text-center font-medium">
            {mensagem}
          </AlertDescription>
        </Alert>
      )}

      {/* Atualização Rápida de Saldos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <span>Atualização Rápida de Saldos</span>
          </CardTitle>
          <CardDescription>
            Atualize seus saldos de forma simples e rápida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Banco do Brasil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-blue-50">
            <div className="space-y-2">
              <Label className="text-blue-800 font-medium">💳 Banco do Brasil - Conta</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={saldos.bb_conta}
                  onChange={(e) => atualizarSaldo('bb_conta', e.target.value)}
                  className="text-lg font-bold"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-blue-800 font-medium">💳 BB Visa - Fatura</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={saldos.bb_cartao}
                  onChange={(e) => atualizarSaldo('bb_cartao', e.target.value)}
                  className="text-lg font-bold text-red-600"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          {/* Caixa Econômica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-green-50">
            <div className="space-y-2">
              <Label className="text-green-800 font-medium">🏦 Caixa - Conta</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={saldos.caixa_conta}
                  onChange={(e) => atualizarSaldo('caixa_conta', e.target.value)}
                  className="text-lg font-bold"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-green-800 font-medium">💳 Caixa Elo - Fatura</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">R$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={saldos.caixa_cartao}
                  onChange={(e) => atualizarSaldo('caixa_cartao', e.target.value)}
                  className="text-lg font-bold text-red-600"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          {/* Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total em Contas</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(saldos.bb_conta + saldos.caixa_conta)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total em Dívidas</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(saldos.bb_cartao + saldos.caixa_cartao)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Saldo Líquido</p>
              <p className={`text-xl font-bold ${(saldos.bb_conta + saldos.caixa_conta - saldos.bb_cartao - saldos.caixa_cartao) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldos.bb_conta + saldos.caixa_conta - saldos.bb_cartao - saldos.caixa_cartao)}
              </p>
            </div>
          </div>

          {/* Botão de Salvar */}
          <Button 
            onClick={salvarDados} 
            disabled={salvando}
            className="w-full h-12 text-lg font-bold"
          >
            {salvando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Salvar Saldos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Adicionar Transação Rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Adicionar Gasto/Receita Rápido</span>
          </CardTitle>
          <CardDescription>
            Registre um gasto ou receita em segundos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="flex space-x-2">
                <Button
                  variant={novaTransacao.tipo === 'gasto' ? 'default' : 'outline'}
                  onClick={() => setNovaTransacao(prev => ({ ...prev, tipo: 'gasto' }))}
                  className="flex-1"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Gasto
                </Button>
                <Button
                  variant={novaTransacao.tipo === 'receita' ? 'default' : 'outline'}
                  onClick={() => setNovaTransacao(prev => ({ ...prev, tipo: 'receita' }))}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Receita
                </Button>
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={novaTransacao.valor}
                onChange={(e) => setNovaTransacao(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0,00"
                className="text-lg"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={novaTransacao.descricao}
                onChange={(e) => setNovaTransacao(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Ex: Almoço, Salário..."
                className="text-lg"
              />
            </div>
          </div>

          <Button 
            onClick={adicionarTransacao}
            className="w-full h-12 text-lg font-bold"
            disabled={!novaTransacao.valor || !novaTransacao.descricao}
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar {novaTransacao.tipo === 'gasto' ? 'Gasto' : 'Receita'}
          </Button>
        </CardContent>
      </Card>

      {/* Últimas Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <UltimasTransacoes />
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para mostrar últimas transações
const UltimasTransacoes = () => {
  const [transacoes, setTransacoes] = useState([])

  useEffect(() => {
    const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes_rapidas') || '[]')
    setTransacoes(transacoesSalvas.slice(0, 5)) // Mostrar apenas as 5 mais recentes
  }, [])

  // Recarregar transações a cada 2 segundos para mostrar atualizações
  useEffect(() => {
    const interval = setInterval(() => {
      const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes_rapidas') || '[]')
      setTransacoes(transacoesSalvas.slice(0, 5))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value))
  }

  if (transacoes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma transação registrada ainda.</p>
        <p className="text-sm">Adicione sua primeira transação acima!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transacoes.map((transacao) => (
        <div key={transacao.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${transacao.valor >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {transacao.valor >= 0 ? (
                <Plus className="h-4 w-4 text-green-600" />
              ) : (
                <Minus className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium">{transacao.descricao}</p>
              <p className="text-sm text-gray-500">{transacao.data}</p>
            </div>
          </div>
          <div className={`text-lg font-bold ${transacao.valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transacao.valor >= 0 ? '+' : '-'}{formatCurrency(transacao.valor)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AtualizacaoRapida
