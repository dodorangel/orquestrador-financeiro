import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { 
  Wallet, CreditCard, TrendingUp, TrendingDown, AlertTriangle, 
  Target, Calendar, Brain, Focus, CheckCircle, Clock, DollarSign,
  PiggyBank, ShoppingCart, Home, Car, Heart, GraduationCap
} from 'lucide-react'
import './App.css'
import dadosFinanceiros from './assets/dados_financeiros_atualizados.json'
import AlertasInteligentes from './components/AlertasInteligentes.jsx'
import SimuladorQuitacao from './components/SimuladorQuitacao.jsx'
import AtualizacaoRapida from './components/AtualizacaoRapida.jsx'
import ProjecaoAnual from './components/ProjecaoAnual.jsx'

// Dados reais atualizados em 29/10/2025
const saldosAtuais = {
  banco_brasil: {
    conta_corrente: 9884.51,
    cartao_visa: -19303.50,
    vencimento_cartao: "22/10/2025",
    limite_cartao: 58399.00
  },
  caixa_economica: {
    conta_corrente: 144.86,
    cartao_elo: -175.69,
    vencimento_cartao: "11/10/2025",
    limite_cartao: 3000.00
  }
}

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [modoFoco, setModoFoco] = useState(false)
  const [transacoes, setTransacoes] = useState([])

  // Dados consolidados
  const saldoTotalContas = saldosAtuais.banco_brasil.conta_corrente + saldosAtuais.caixa_economica.conta_corrente
  const dividaTotalCartoes = Math.abs(saldosAtuais.banco_brasil.cartao_visa) + Math.abs(saldosAtuais.caixa_economica.cartao_elo)
  const saldoLiquido = saldoTotalContas - dividaTotalCartoes
  const utilizacaoCartaoBB = (Math.abs(saldosAtuais.banco_brasil.cartao_visa) / saldosAtuais.banco_brasil.limite_cartao) * 100

  // Dados para gráficos baseados na análise real
  const gastosCategoria = [
    { name: 'Tecnologia', value: 3021.78, color: '#FF8042' },
    { name: 'Supermercado', value: 1564.24, color: '#0088FE' },
    { name: 'Educação', value: 894.60, color: '#00C49F' },
    { name: 'Serviços', value: 854.95, color: '#FFBB28' },
    { name: 'Alimentação', value: 790.89, color: '#8884D8' },
    { name: 'Combustível', value: 585.81, color: '#82CA9D' },
    { name: 'Assinaturas', value: 393.43, color: '#FFC658' },
    { name: 'Outros', value: 1473.26, color: '#FF7C7C' }
  ]

  const evolucaoMensal = [
    { mes: 'Jul/25', receita: 9446.62, despesas: 8500, saldo: 946.62 },
    { mes: 'Ago/25', receita: 9446.62, despesas: 9200, saldo: 246.62 },
    { mes: 'Set/25', receita: 19728.07, despesas: 9578.96, saldo: 10149.11 }
  ]

  const proximosVencimentos = [
    { descricao: 'Cartão BB Visa', valor: 19303.50, vencimento: '22/10/2025', status: 'vencido' },
    { descricao: 'Cartão Caixa Elo', valor: 175.69, vencimento: '11/10/2025', status: 'vencido' },
    { descricao: 'Financiamento Habitacional', valor: 1344.98, vencimento: '23/11/2025', status: 'pendente' },
    { descricao: 'Previdência FUNCEF', valor: 1823.18, vencimento: '22/11/2025', status: 'pendente' }
  ]

  const metasFinanceiras = [
    { 
      nome: 'Controle Cartão BB', 
      atual: utilizacaoCartaoBB, 
      meta: 30, 
      tipo: 'reducao',
      icon: CreditCard,
      cor: utilizacaoCartaoBB > 30 ? 'destructive' : 'default'
    },
    { 
      nome: 'Gastos Tecnologia', 
      atual: 3021.78, 
      meta: 2000, 
      tipo: 'limite',
      icon: ShoppingCart,
      cor: 'destructive'
    },
    { 
      nome: 'Reserva Emergência', 
      atual: saldoTotalContas, 
      meta: 15000, 
      tipo: 'economia',
      icon: PiggyBank,
      cor: 'default'
    }
  ]

  const acoesPrioritarias = [
    {
      id: 1,
      titulo: 'Pagar Cartão BB (URGENTE)',
      descricao: 'Fatura vencida de R$ 19.303,50',
      prioridade: 'alta',
      categoria: 'pagamento',
      concluida: false
    },
    {
      id: 2,
      titulo: 'Revisar gastos com Tecnologia',
      descricao: 'Reduzir de R$ 3.021 para R$ 2.000/mês',
      prioridade: 'alta',
      categoria: 'controle',
      concluida: false
    },
    {
      id: 3,
      titulo: 'Cancelar assinaturas desnecessárias',
      descricao: 'Economizar R$ 200/mês em apps e serviços',
      prioridade: 'media',
      categoria: 'economia',
      concluida: false
    }
  ]

  const [acoes, setAcoes] = useState(acoesPrioritarias)

  const marcarConcluida = (id) => {
    setAcoes(acoes.map(acao => 
      acao.id === id ? { ...acao, concluida: !acao.concluida } : acao
    ))
  }

  const getPrioridadeColor = (prioridade) => {
    switch(prioridade) {
      case 'alta': return 'destructive'
      case 'media': return 'default'
      case 'baixa': return 'secondary'
      default: return 'default'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Orquestrador Financeiro</h1>
              </div>
              {modoFoco && (
                <Badge variant="secondary" className="animate-pulse">
                  <Focus className="h-3 w-3 mr-1" />
                  Modo Foco Ativo
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={modoFoco ? "default" : "outline"}
                size="sm"
                onClick={() => setModoFoco(!modoFoco)}
              >
                <Focus className="h-4 w-4 mr-2" />
                {modoFoco ? 'Sair do Foco' : 'Modo Foco'}
              </Button>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                <p className={`text-lg font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(saldoLiquido)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alertas Críticos */}
      {(utilizacaoCartaoBB > 30 || saldoLiquido < 0) && (
        <div className="container mx-auto px-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção Necessária!</AlertTitle>
            <AlertDescription>
              {utilizacaoCartaoBB > 30 && `Cartão BB com utilização alta (${utilizacaoCartaoBB.toFixed(1)}%). `}
              {saldoLiquido < 0 && `Saldo líquido negativo: ${formatCurrency(saldoLiquido)}.`}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="projecao">Projeção Anual</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          {/* Dashboard Principal */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total em Contas</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(saldoTotalContas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    BB: {formatCurrency(saldosAtuais.banco_brasil.conta_corrente)} | 
                    Caixa: {formatCurrency(saldosAtuais.caixa_economica.conta_corrente)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total em Dívidas</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(dividaTotalCartoes)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Visa: {formatCurrency(Math.abs(saldosAtuais.banco_brasil.cartao_visa))} | 
                    Elo: {formatCurrency(Math.abs(saldosAtuais.caixa_economica.cartao_elo))}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Média</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dadosFinanceiros.receita_media)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Baseado nos últimos 3 meses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comprometimento</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {dadosFinanceiros.comprometimento.toFixed(1)}%
                  </div>
                  <Progress value={dadosFinanceiros.comprometimento} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gastos por Categoria (Setembro)</CardTitle>
                  <CardDescription>Distribuição dos gastos do mês atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gastosCategoria}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {gastosCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evolução Mensal</CardTitle>
                  <CardDescription>Receitas vs Despesas nos últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receita" fill="#00C49F" name="Receita" />
                      <Bar dataKey="despesas" fill="#FF8042" name="Despesas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Próximos Vencimentos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
                <CardDescription>Contas e compromissos financeiros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proximosVencimentos.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.descricao}</p>
                          <p className="text-sm text-muted-foreground">Vencimento: {item.vencimento}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(item.valor)}</p>
                        <Badge variant={item.status === 'vencido' ? 'destructive' : 'default'}>
                          {item.status === 'vencido' ? 'Vencido' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Painel Hoje (TDAH-friendly) */}
          <TabsContent value="hoje" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Foco de Hoje - 3 Ações Prioritárias</span>
                </CardTitle>
                <CardDescription>
                  Concentre-se apenas nestas tarefas para manter sua saúde financeira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acoes.map((acao) => (
                    <div key={acao.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => marcarConcluida(acao.id)}
                        className="p-0"
                      >
                        {acao.concluida ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Clock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${acao.concluida ? 'line-through text-muted-foreground' : ''}`}>
                            {acao.titulo}
                          </h3>
                          <Badge variant={getPrioridadeColor(acao.prioridade)}>
                            {acao.prioridade}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{acao.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resumo Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Disponível Hoje</p>
                      <p className="text-xl font-bold">{formatCurrency(saldoTotalContas)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cartão BB</p>
                      <p className="text-xl font-bold text-red-600">
                        {utilizacaoCartaoBB.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Meta do Mês</p>
                      <p className="text-xl font-bold">Controle</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transações */}
          <TabsContent value="transacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Transações</CardTitle>
                <CardDescription>Controle pari-passo: prevista → lançada → conciliada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento. 
                    <br />
                    Aqui você poderá gerenciar todas as suas transações com fluxo de conciliação.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metas */}
          <TabsContent value="metas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metasFinanceiras.map((meta, index) => {
                const progresso = meta.tipo === 'reducao' 
                  ? Math.max(0, 100 - (meta.atual / meta.meta * 100))
                  : (meta.atual / meta.meta * 100)
                
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <meta.icon className="h-5 w-5" />
                        <span>{meta.nome}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Atual:</span>
                          <span>{meta.tipo === 'reducao' ? `${meta.atual.toFixed(1)}%` : formatCurrency(meta.atual)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Meta:</span>
                          <span>{meta.tipo === 'reducao' ? `${meta.meta}%` : formatCurrency(meta.meta)}</span>
                        </div>
                        <Progress value={Math.min(100, progresso)} className="mt-2" />
                        <p className="text-xs text-muted-foreground">
                          {progresso >= 100 ? '✅ Meta atingida!' : `${progresso.toFixed(1)}% da meta`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Ferramentas */}
          <TabsContent value="ferramentas" className="space-y-6">
            <Tabs defaultValue="alertas" className="space-y-4">
              <TabsList>
                <TabsTrigger value="alertas">Alertas Inteligentes</TabsTrigger>
                <TabsTrigger value="simulador">Simulador de Quitação</TabsTrigger>
              </TabsList>
              
              <TabsContent value="alertas">
                <AlertasInteligentes 
                  dadosFinanceiros={dadosFinanceiros} 
                  saldosAtuais={saldosAtuais} 
                />
              </TabsContent>
              
              <TabsContent value="simulador">
                <SimuladorQuitacao saldosAtuais={saldosAtuais} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Atualização Rápida de Dados */}
          <TabsContent value="dados" className="space-y-6">
            <AtualizacaoRapida onDataUpdate={(dados) => {
              // Atualizar dados da aplicação quando houver mudanças
              console.log('Dados atualizados:', dados)
            }} />
          </TabsContent>

          {/* Projeção Anual */}
          <TabsContent value="projecao" className="space-y-6">
            <ProjecaoAnual />
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
                <CardDescription>Simulação dos próximos 3 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={evolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="saldo" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
