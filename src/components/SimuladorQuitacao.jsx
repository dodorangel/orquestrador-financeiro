import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Calculator, CreditCard, TrendingDown, Calendar, 
  DollarSign, Target, CheckCircle
} from 'lucide-react'

const SimuladorQuitacao = ({ saldosAtuais }) => {
  const [valorPagamento, setValorPagamento] = useState('')
  const [simulacao, setSimulacao] = useState(null)
  const [estrategia, setEstrategia] = useState('minimo')

  const dividaTotal = Math.abs(saldosAtuais.banco_brasil.cartao_visa) + Math.abs(saldosAtuais.caixa_economica.cartao_elo)
  const dividaBB = Math.abs(saldosAtuais.banco_brasil.cartao_visa)
  const dividaCaixa = Math.abs(saldosAtuais.caixa_economica.cartao_elo)

  // Taxas de juros aproximadas (CET)
  const jurosBB = 0.1240 // 12.40% ao mês (CET típico cartão)
  const jurosCaixa = 0.1150 // 11.50% ao mês

  const calcularSimulacao = () => {
    if (!valorPagamento || parseFloat(valorPagamento) <= 0) return

    const pagamento = parseFloat(valorPagamento)
    const resultados = []

    // Simulação para BB (maior dívida)
    if (dividaBB > 0) {
      const meses = calcularMesesQuitacao(dividaBB, pagamento * 0.8, jurosBB) // 80% do pagamento para BB
      const jurosTotal = (meses * pagamento * 0.8) - dividaBB
      
      resultados.push({
        banco: 'Banco do Brasil',
        divida: dividaBB,
        pagamentoMensal: pagamento * 0.8,
        meses: meses,
        jurosTotal: Math.max(0, jurosTotal),
        valorTotal: dividaBB + Math.max(0, jurosTotal)
      })
    }

    // Simulação para Caixa (menor dívida)
    if (dividaCaixa > 0) {
      const meses = calcularMesesQuitacao(dividaCaixa, pagamento * 0.2, jurosCaixa) // 20% do pagamento para Caixa
      const jurosTotal = (meses * pagamento * 0.2) - dividaCaixa
      
      resultados.push({
        banco: 'Caixa Econômica',
        divida: dividaCaixa,
        pagamentoMensal: pagamento * 0.2,
        meses: meses,
        jurosTotal: Math.max(0, jurosTotal),
        valorTotal: dividaCaixa + Math.max(0, jurosTotal)
      })
    }

    setSimulacao({
      pagamentoTotal: pagamento,
      resultados: resultados,
      mesesMaximo: Math.max(...resultados.map(r => r.meses)),
      jurosTotal: resultados.reduce((acc, r) => acc + r.jurosTotal, 0),
      valorTotalPago: resultados.reduce((acc, r) => acc + r.valorTotal, 0)
    })
  }

  const calcularMesesQuitacao = (divida, pagamento, juros) => {
    if (pagamento <= divida * juros) {
      return 999 // Pagamento insuficiente para cobrir juros
    }
    
    let saldo = divida
    let meses = 0
    
    while (saldo > 0.01 && meses < 240) { // Máximo 20 anos
      const jurosMes = saldo * juros
      const amortizacao = pagamento - jurosMes
      saldo -= amortizacao
      meses++
    }
    
    return meses
  }

  const estrategiasPredefinidas = [
    {
      nome: 'Pagamento Mínimo',
      valor: dividaTotal * 0.15, // 15% da dívida
      descricao: 'Pagamento mínimo para não acumular juros'
    },
    {
      nome: 'Agressiva',
      valor: 2500,
      descricao: 'Quitação rápida com valor fixo'
    },
    {
      nome: 'Equilibrada',
      valor: 1500,
      descricao: 'Balanceio entre prazo e valor'
    },
    {
      nome: 'Conservadora',
      valor: 800,
      descricao: 'Pagamento menor, prazo maior'
    }
  ]

  const aplicarEstrategia = (valor) => {
    setValorPagamento(valor.toString())
  }

  useEffect(() => {
    if (valorPagamento) {
      calcularSimulacao()
    }
  }, [valorPagamento])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Simulador de Quitação de Cartões</span>
          </CardTitle>
          <CardDescription>
            Simule diferentes cenários para quitar suas dívidas de cartão de crédito
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resumo das Dívidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">BB Visa</p>
                    <p className="text-xl font-bold">{formatCurrency(dividaBB)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Caixa Elo</p>
                    <p className="text-xl font-bold">{formatCurrency(dividaCaixa)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(dividaTotal)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estratégias Predefinidas */}
          <div>
            <Label className="text-base font-medium">Estratégias Recomendadas</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {estrategiasPredefinidas.map((est, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start"
                  onClick={() => aplicarEstrategia(est.valor)}
                >
                  <span className="font-medium">{est.nome}</span>
                  <span className="text-sm text-muted-foreground">{formatCurrency(est.valor)}</span>
                  <span className="text-xs text-muted-foreground mt-1">{est.descricao}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Input Personalizado */}
          <div className="space-y-2">
            <Label htmlFor="valor-pagamento">Valor do Pagamento Mensal</Label>
            <div className="flex space-x-2">
              <Input
                id="valor-pagamento"
                type="number"
                placeholder="Ex: 2500"
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
                className="flex-1"
              />
              <Button onClick={calcularSimulacao}>
                <Calculator className="h-4 w-4 mr-2" />
                Simular
              </Button>
            </div>
          </div>

          {/* Resultados da Simulação */}
          {simulacao && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Resultados da Simulação</h3>
                
                {/* Resumo Geral */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tempo Total</p>
                          <p className="text-lg font-bold">
                            {simulacao.mesesMaximo} meses
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Pagamento Mensal</p>
                          <p className="text-lg font-bold">
                            {formatCurrency(simulacao.pagamentoTotal)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Juros Total</p>
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(simulacao.jurosTotal)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Target className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Pago</p>
                          <p className="text-lg font-bold">
                            {formatCurrency(simulacao.valorTotalPago)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detalhes por Cartão */}
                <div className="space-y-4">
                  <h4 className="font-medium">Detalhamento por Cartão</h4>
                  {simulacao.resultados.map((resultado, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">{resultado.banco}</h5>
                          <Badge variant={resultado.meses < 12 ? "default" : resultado.meses < 24 ? "secondary" : "destructive"}>
                            {resultado.meses} meses
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dívida Atual</p>
                            <p className="font-medium">{formatCurrency(resultado.divida)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pagamento Mensal</p>
                            <p className="font-medium">{formatCurrency(resultado.pagamentoMensal)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Juros Total</p>
                            <p className="font-medium text-red-600">{formatCurrency(resultado.jurosTotal)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total a Pagar</p>
                            <p className="font-medium">{formatCurrency(resultado.valorTotal)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recomendações */}
                <Card className="mt-6">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-green-600">Recomendações</h5>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          {simulacao.mesesMaximo <= 12 && (
                            <p>✅ Excelente! Você quitará suas dívidas em menos de 1 ano.</p>
                          )}
                          {simulacao.mesesMaximo > 12 && simulacao.mesesMaximo <= 24 && (
                            <p>⚠️ Prazo razoável, mas considere aumentar o pagamento se possível.</p>
                          )}
                          {simulacao.mesesMaximo > 24 && (
                            <p>🚨 Prazo muito longo. Tente aumentar o valor do pagamento mensal.</p>
                          )}
                          <p>💡 Priorize o pagamento do cartão BB (maior dívida e juros).</p>
                          <p>💡 Evite novos gastos nos cartões durante o período de quitação.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SimuladorQuitacao
