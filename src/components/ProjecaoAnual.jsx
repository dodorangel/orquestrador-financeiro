import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, 
  DollarSign, PiggyBank, CreditCard, Home, Zap, CheckCircle
} from 'lucide-react'

const ProjecaoAnual = () => {
  const [cenarioAtivo, setCenarioAtivo] = useState('atual')
  
  // Dados reais baseados na análise
  const dadosReais = {
    receita_mensal: 16333.69,
    despesas_fixas_mensal: 15500.03,
    saldo_disponivel_mensal: 833.66,
    gastos_variaveis_atuais: 8000, // Estimativa baseada no cartão
    perfil_investidor: "Construtor"
  }

  // Cenários de projeção anual
  const cenarios = {
    atual: {
      nome: "Sem Controle (Atual)",
      cor: "#ef4444",
      icon: AlertTriangle,
      descricao: "Mantém padrão atual - SITUAÇÃO CRÍTICA",
      receita_anual: dadosReais.receita_mensal * 12,
      despesas_fixas_anual: dadosReais.despesas_fixas_mensal * 12,
      gastos_variaveis_anual: dadosReais.gastos_variaveis_atuais * 12,
      saldo_final: (dadosReais.receita_mensal * 12) - (dadosReais.despesas_fixas_mensal * 12) - (dadosReais.gastos_variaveis_atuais * 12),
      investimentos: 0,
      reserva_emergencia: 0,
      caracteristicas: [
        "Gastos com cartão mantidos em R$ 8.000/mês",
        "Sem controle de compras online", 
        "Endividamento crescente",
        "Sem reserva de emergência",
        "Risco financeiro alto"
      ]
    },
    moderado: {
      nome: "Ajustes Moderados",
      cor: "#f59e0b",
      icon: Target,
      descricao: "Redução de 30% nos gastos variáveis",
      receita_anual: dadosReais.receita_mensal * 12,
      despesas_fixas_anual: dadosReais.despesas_fixas_mensal * 12,
      gastos_variaveis_anual: (dadosReais.gastos_variaveis_atuais * 0.7) * 12,
      saldo_final: (dadosReais.receita_mensal * 12) - (dadosReais.despesas_fixas_mensal * 12) - ((dadosReais.gastos_variaveis_atuais * 0.7) * 12),
      investimentos: (dadosReais.gastos_variaveis_atuais * 0.15) * 12,
      reserva_emergencia: (dadosReais.gastos_variaveis_atuais * 0.15) * 12,
      caracteristicas: [
        "Gastos com cartão reduzidos para R$ 5.600/mês",
        "Controle básico de compras online",
        "Reserva de emergência: R$ 14.400/ano",
        "Investimentos conservadores: R$ 14.400/ano",
        "Adequado ao perfil Construtor"
      ]
    },
    rigoroso: {
      nome: "Controle Rigoroso",
      cor: "#22c55e",
      icon: CheckCircle,
      descricao: "Redução de 50% + foco em investimentos",
      receita_anual: dadosReais.receita_mensal * 12,
      despesas_fixas_anual: dadosReais.despesas_fixas_mensal * 12,
      gastos_variaveis_anual: (dadosReais.gastos_variaveis_atuais * 0.5) * 12,
      saldo_final: (dadosReais.receita_mensal * 12) - (dadosReais.despesas_fixas_mensal * 12) - ((dadosReais.gastos_variaveis_atuais * 0.5) * 12),
      investimentos: (dadosReais.gastos_variaveis_atuais * 0.3) * 12,
      reserva_emergencia: (dadosReais.gastos_variaveis_atuais * 0.2) * 12,
      quitacao_dividas: (dadosReais.gastos_variaveis_atuais * 0.2) * 12,
      caracteristicas: [
        "Gastos variáveis reduzidos para R$ 4.000/mês",
        "Quitação acelerada: R$ 19.200/ano",
        "Reserva robusta: R$ 19.200/ano", 
        "Investimentos: R$ 28.800/ano",
        "Transformação financeira completa"
      ]
    }
  }

  // Dados para gráfico mensal (similar ao da imagem)
  const dadosMensais = Array.from({ length: 12 }, (_, i) => {
    const mes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]
    const cenario = cenarios[cenarioAtivo]
    
    return {
      mes,
      receita: cenario.receita_anual / 12,
      despesas: (cenario.despesas_fixas_anual + cenario.gastos_variaveis_anual) / 12,
      saldo_acumulado: ((cenario.receita_anual / 12) - ((cenario.despesas_fixas_anual + cenario.gastos_variaveis_anual) / 12)) * (i + 1)
    }
  })

  // Dados para gráfico de composição de gastos
  const composicaoGastos = [
    { nome: 'Empréstimos', valor: (1820.99 + 900.88 + 1341.86) * 12, cor: '#ef4444' },
    { nome: 'Casa & Serviços', valor: (1680 + 880 + 700 + 600 + 332.88) * 12, cor: '#f59e0b' },
    { nome: 'Educação & Saúde', valor: (568.89 + 349 + 33.08) * 12, cor: '#3b82f6' },
    { nome: 'Assinaturas', valor: (99.9 + 149.9 + 54.9 + 66.9 + 194.9) * 12, cor: '#8b5cf6' },
    { nome: 'Vida & Lazer', valor: (810 + 600 + 500 + 2000 + 300) * 12, cor: '#22c55e' }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const cenarioSelecionado = cenarios[cenarioAtivo]
  const IconeCenario = cenarioSelecionado.icon

  return (
    <div className="space-y-6">
      {/* Alerta Crítico */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>SITUAÇÃO CRÍTICA IDENTIFICADA:</strong> Suas despesas excedem sua receita disponível. 
          Sobram apenas R$ 833,66/mês para gastos variáveis, mas você gasta ~R$ 8.000/mês com cartão.
        </AlertDescription>
      </Alert>

      {/* Seletor de Cenários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Projeção Anual - Cenários Financeiros</span>
          </CardTitle>
          <CardDescription>
            Baseado nos seus dados reais dos últimos 12 meses. Perfil: <strong>Construtor</strong> (Ambima)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={cenarioAtivo} onValueChange={setCenarioAtivo}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="atual" className="text-red-600">Atual</TabsTrigger>
              <TabsTrigger value="moderado" className="text-orange-600">Moderado</TabsTrigger>
              <TabsTrigger value="rigoroso" className="text-green-600">Rigoroso</TabsTrigger>
            </TabsList>

            {Object.entries(cenarios).map(([key, cenario]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                {/* Resumo do Cenário */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-l-4" style={{ borderLeftColor: cenario.cor }}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconeCenario className="h-5 w-5" style={{ color: cenario.cor }} />
                        <h3 className="font-semibold">{cenario.nome}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{cenario.descricao}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Receita Anual</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(cenario.receita_anual)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Despesas Totais</span>
                      </div>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(cenario.despesas_fixas_anual + cenario.gastos_variaveis_anual)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        {cenario.saldo_final >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">Saldo Final</span>
                      </div>
                      <p className={`text-xl font-bold ${cenario.saldo_final >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(cenario.saldo_final)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Características do Cenário */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Características deste Cenário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cenario.caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: cenario.cor }}></div>
                          <span className="text-sm">{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Investimentos e Reservas (se aplicável) */}
                {(cenario.investimentos > 0 || cenario.reserva_emergencia > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cenario.investimentos > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <PiggyBank className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Investimentos Anuais</span>
                          </div>
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(cenario.investimentos)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(cenario.investimentos / 12)}/mês
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {cenario.reserva_emergencia > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <Home className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Reserva Emergência</span>
                          </div>
                          <p className="text-lg font-bold text-purple-600">
                            {formatCurrency(cenario.reserva_emergencia)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(cenario.reserva_emergencia / 12)}/mês
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {cenario.quitacao_dividas > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <Zap className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Quitação Dívidas</span>
                          </div>
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(cenario.quitacao_dividas)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(cenario.quitacao_dividas / 12)}/mês
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Gráfico de Evolução Mensal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal - {cenarioSelecionado.nome}</CardTitle>
            <CardDescription>Receitas vs Despesas ao longo do ano</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="Receitas"
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composição das Despesas Fixas</CardTitle>
            <CardDescription>Distribuição por categoria (anual)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={composicaoGastos}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="valor"
                  label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                >
                  {composicaoGastos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Saldo Acumulado */}
      <Card>
        <CardHeader>
          <CardTitle>Saldo Acumulado - {cenarioSelecionado.nome}</CardTitle>
          <CardDescription>
            Evolução do saldo ao longo do ano (similar ao gráfico da sua imagem)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area
                type="monotone"
                dataKey="saldo_acumulado"
                stroke={cenarioSelecionado.cor}
                fill={cenarioSelecionado.cor}
                fillOpacity={0.3}
                strokeWidth={3}
                name="Saldo Acumulado"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Integração Open Finance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Integração Open Finance Brasil</span>
          </CardTitle>
          <CardDescription>
            Conecte suas contas bancárias para atualização automática dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Em desenvolvimento:</strong> Integração com APIs do Banco do Brasil e Caixa Econômica 
              via Open Finance Brasil para sincronização automática de extratos e saldos.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🏦 Banco do Brasil</h4>
              <p className="text-sm text-gray-600 mb-2">API Open Finance disponível</p>
              <Button variant="outline" disabled>
                Conectar (Em breve)
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🏦 Caixa Econômica</h4>
              <p className="text-sm text-gray-600 mb-2">API Open Finance disponível</p>
              <Button variant="outline" disabled>
                Conectar (Em breve)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjecaoAnual
