import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { 
  Upload, Download, RefreshCw, Database, FileText, 
  CreditCard, Wallet, Calendar, CheckCircle, AlertTriangle,
  Plus, Edit, Trash2, Save, X
} from 'lucide-react'

const GerenciadorDados = ({ onDataUpdate }) => {
  const [saldos, setSaldos] = useState({
    banco_brasil: { conta_corrente: 0, cartao_visa: 0, limite_cartao: 58399 },
    caixa_economica: { conta_corrente: 0, cartao_elo: 0, limite_cartao: 3000 }
  })
  
  const [novaTransacao, setNovaTransacao] = useState({
    data: '',
    descricao: '',
    valor: '',
    categoria: '',
    tipo: 'despesa',
    conta: 'banco_brasil'
  })
  
  const [transacoes, setTransacoes] = useState([])
  const [editandoTransacao, setEditandoTransacao] = useState(null)
  const [importandoExtrato, setImportandoExtrato] = useState(false)
  const [extratoTexto, setExtratoTexto] = useState('')

  const categorias = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação',
    'Tecnologia', 'Lazer', 'Vestuário', 'Supermercado', 'Serviços',
    'Investimentos', 'Outros'
  ]

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('orquestrador_dados')
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos)
      setSaldos(dados.saldos || saldos)
      setTransacoes(dados.transacoes || [])
    }
  }, [])

  // Salvar dados no localStorage
  const salvarDados = () => {
    const dados = {
      saldos,
      transacoes,
      ultimaAtualizacao: new Date().toISOString()
    }
    localStorage.setItem('orquestrador_dados', JSON.stringify(dados))
    if (onDataUpdate) onDataUpdate(dados)
  }

  // Atualizar saldos
  const atualizarSaldo = (banco, tipo, valor) => {
    setSaldos(prev => ({
      ...prev,
      [banco]: {
        ...prev[banco],
        [tipo]: parseFloat(valor) || 0
      }
    }))
  }

  // Adicionar nova transação
  const adicionarTransacao = () => {
    if (!novaTransacao.data || !novaTransacao.descricao || !novaTransacao.valor) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const transacao = {
      id: Date.now(),
      ...novaTransacao,
      valor: parseFloat(novaTransacao.valor),
      status: 'lançada',
      dataLancamento: new Date().toISOString()
    }

    setTransacoes(prev => [transacao, ...prev])
    setNovaTransacao({
      data: '',
      descricao: '',
      valor: '',
      categoria: '',
      tipo: 'despesa',
      conta: 'banco_brasil'
    })
  }

  // Editar transação
  const editarTransacao = (transacao) => {
    setEditandoTransacao(transacao)
    setNovaTransacao({
      data: transacao.data,
      descricao: transacao.descricao,
      valor: transacao.valor.toString(),
      categoria: transacao.categoria,
      tipo: transacao.tipo,
      conta: transacao.conta
    })
  }

  // Salvar edição
  const salvarEdicao = () => {
    setTransacoes(prev => prev.map(t => 
      t.id === editandoTransacao.id 
        ? { ...t, ...novaTransacao, valor: parseFloat(novaTransacao.valor) }
        : t
    ))
    cancelarEdicao()
  }

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoTransacao(null)
    setNovaTransacao({
      data: '',
      descricao: '',
      valor: '',
      categoria: '',
      tipo: 'despesa',
      conta: 'banco_brasil'
    })
  }

  // Excluir transação
  const excluirTransacao = (id) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransacoes(prev => prev.filter(t => t.id !== id))
    }
  }

  // Processar extrato importado
  const processarExtrato = () => {
    if (!extratoTexto.trim()) return

    const linhas = extratoTexto.split('\n')
    const novasTransacoes = []

    linhas.forEach((linha, index) => {
      const linha_limpa = linha.trim()
      if (!linha_limpa) return

      // Tentar extrair data, descrição e valor
      const regexData = /(\d{2}\/\d{2}\/\d{4})/
      const regexValor = /([\d.,]+)/g
      
      const matchData = linha_limpa.match(regexData)
      const matchesValor = [...linha_limpa.matchAll(regexValor)]
      
      if (matchData && matchesValor.length > 0) {
        const data = matchData[1]
        const valor = parseFloat(matchesValor[matchesValor.length - 1][1].replace(',', '.'))
        const descricao = linha_limpa.replace(regexData, '').replace(/[\d.,]+/g, '').trim()

        if (descricao && valor) {
          novasTransacoes.push({
            id: Date.now() + index,
            data: data,
            descricao: descricao,
            valor: Math.abs(valor),
            categoria: 'Outros',
            tipo: valor < 0 ? 'despesa' : 'receita',
            conta: 'banco_brasil',
            status: 'importada',
            dataLancamento: new Date().toISOString()
          })
        }
      }
    })

    if (novasTransacoes.length > 0) {
      setTransacoes(prev => [...novasTransacoes, ...prev])
      setExtratoTexto('')
      setImportandoExtrato(false)
      alert(`${novasTransacoes.length} transações importadas com sucesso!`)
    } else {
      alert('Não foi possível extrair transações do texto fornecido.')
    }
  }

  // Exportar dados
  const exportarDados = () => {
    const dados = {
      saldos,
      transacoes,
      exportadoEm: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orquestrador_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Importar dados
  const importarDados = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result)
        if (dados.saldos) setSaldos(dados.saldos)
        if (dados.transacoes) setTransacoes(dados.transacoes)
        alert('Dados importados com sucesso!')
      } catch (error) {
        alert('Erro ao importar dados. Verifique o formato do arquivo.')
      }
    }
    reader.readAsText(file)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Gerenciador de Dados Financeiros</span>
          </CardTitle>
          <CardDescription>
            Central para atualizar saldos, adicionar transações e gerenciar seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button onClick={salvarDados} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </Button>
            <Button variant="outline" onClick={exportarDados} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar Dados</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Importar Dados</span>
              <input
                type="file"
                accept=".json"
                onChange={importarDados}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="saldos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="saldos">Saldos</TabsTrigger>
          <TabsTrigger value="transacoes">Transações</TabsTrigger>
          <TabsTrigger value="importar">Importar Extrato</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Atualização de Saldos */}
        <TabsContent value="saldos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banco do Brasil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span>Banco do Brasil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bb-conta">Conta Corrente</Label>
                  <Input
                    id="bb-conta"
                    type="number"
                    step="0.01"
                    value={saldos.banco_brasil.conta_corrente}
                    onChange={(e) => atualizarSaldo('banco_brasil', 'conta_corrente', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="bb-cartao">Cartão Visa (valor negativo)</Label>
                  <Input
                    id="bb-cartao"
                    type="number"
                    step="0.01"
                    value={saldos.banco_brasil.cartao_visa}
                    onChange={(e) => atualizarSaldo('banco_brasil', 'cartao_visa', e.target.value)}
                    placeholder="-0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="bb-limite">Limite do Cartão</Label>
                  <Input
                    id="bb-limite"
                    type="number"
                    step="0.01"
                    value={saldos.banco_brasil.limite_cartao}
                    onChange={(e) => atualizarSaldo('banco_brasil', 'limite_cartao', e.target.value)}
                    placeholder="58399,00"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Caixa Econômica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <span>Caixa Econômica</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="caixa-conta">Conta Corrente</Label>
                  <Input
                    id="caixa-conta"
                    type="number"
                    step="0.01"
                    value={saldos.caixa_economica.conta_corrente}
                    onChange={(e) => atualizarSaldo('caixa_economica', 'conta_corrente', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="caixa-cartao">Cartão Elo (valor negativo)</Label>
                  <Input
                    id="caixa-cartao"
                    type="number"
                    step="0.01"
                    value={saldos.caixa_economica.cartao_elo}
                    onChange={(e) => atualizarSaldo('caixa_economica', 'cartao_elo', e.target.value)}
                    placeholder="-0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="caixa-limite">Limite do Cartão</Label>
                  <Input
                    id="caixa-limite"
                    type="number"
                    step="0.01"
                    value={saldos.caixa_economica.limite_cartao}
                    onChange={(e) => atualizarSaldo('caixa_economica', 'limite_cartao', e.target.value)}
                    placeholder="3000,00"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestão de Transações */}
        <TabsContent value="transacoes" className="space-y-4">
          {/* Formulário de Nova Transação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>{editandoTransacao ? 'Editar Transação' : 'Nova Transação'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novaTransacao.data}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={novaTransacao.descricao}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Ex: Supermercado Extra"
                  />
                </div>
                <div>
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={novaTransacao.valor}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    value={novaTransacao.categoria}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <select
                    id="tipo"
                    value={novaTransacao.tipo}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="despesa">Despesa</option>
                    <option value="receita">Receita</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="conta">Conta</Label>
                  <select
                    id="conta"
                    value={novaTransacao.conta}
                    onChange={(e) => setNovaTransacao(prev => ({ ...prev, conta: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="banco_brasil">Banco do Brasil</option>
                    <option value="caixa_economica">Caixa Econômica</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {editandoTransacao ? (
                  <>
                    <Button onClick={salvarEdicao}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Edição
                    </Button>
                    <Button variant="outline" onClick={cancelarEdicao}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={adicionarTransacao}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Transação
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Transações */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                {transacoes.length} transações registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transacoes.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{transacao.descricao}</span>
                        <Badge variant={transacao.tipo === 'receita' ? 'default' : 'secondary'}>
                          {transacao.categoria}
                        </Badge>
                        <Badge variant="outline">
                          {transacao.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transacao.data)} • {transacao.conta.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editarTransacao(transacao)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => excluirTransacao(transacao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {transacoes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma transação registrada ainda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Importar Extrato */}
        <TabsContent value="importar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Importar Extrato Bancário</span>
              </CardTitle>
              <CardDescription>
                Cole o texto do seu extrato bancário para importar transações automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Como usar:</AlertTitle>
                <AlertDescription>
                  1. Copie o texto do seu extrato bancário (PDF ou site do banco)
                  2. Cole no campo abaixo
                  3. Clique em "Processar Extrato"
                  4. Revise as transações importadas antes de salvar
                </AlertDescription>
              </Alert>
              
              <div>
                <Label htmlFor="extrato">Texto do Extrato</Label>
                <Textarea
                  id="extrato"
                  value={extratoTexto}
                  onChange={(e) => setExtratoTexto(e.target.value)}
                  placeholder="Cole aqui o texto do seu extrato bancário..."
                  rows={10}
                />
              </div>
              
              <Button onClick={processarExtrato} disabled={!extratoTexto.trim()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Processar Extrato
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup e Sincronização */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Backup e Sincronização</span>
              </CardTitle>
              <CardDescription>
                Gerencie backups dos seus dados e configure sincronização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Download className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Backup Manual</h3>
                        <p className="text-sm text-muted-foreground">
                          Baixe um arquivo com todos os seus dados
                        </p>
                      </div>
                    </div>
                    <Button onClick={exportarDados} className="w-full">
                      Fazer Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Upload className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium">Restaurar Backup</h3>
                        <p className="text-sm text-muted-foreground">
                          Carregue um arquivo de backup anterior
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full relative">
                      Restaurar Dados
                      <input
                        type="file"
                        accept=".json"
                        onChange={importarDados}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Backup Automático Ativo</AlertTitle>
                <AlertDescription>
                  Seus dados são salvos automaticamente no navegador a cada alteração.
                  Recomendamos fazer backup manual semanalmente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GerenciadorDados
