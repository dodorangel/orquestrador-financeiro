import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { 
  AlertTriangle, CheckCircle, Clock, TrendingDown, TrendingUp, 
  CreditCard, Target, Brain, Lightbulb, X
} from 'lucide-react'

const AlertasInteligentes = ({ dadosFinanceiros, saldosAtuais }) => {
  const [alertas, setAlertas] = useState([])
  const [alertasLidos, setAlertasLidos] = useState(new Set())

  useEffect(() => {
    const gerarAlertas = () => {
      const novosAlertas = []
      
      // Alerta 1: Cartão com utilização alta
      const utilizacaoCartaoBB = (Math.abs(saldosAtuais.banco_brasil.cartao_visa) / saldosAtuais.banco_brasil.limite_cartao) * 100
      if (utilizacaoCartaoBB > 30) {
        novosAlertas.push({
          id: 'cartao_bb_alto',
          tipo: 'critico',
          titulo: 'Cartão BB com Utilização Alta',
          descricao: `Seu cartão está com ${utilizacaoCartaoBB.toFixed(1)}% de utilização. Recomendamos manter abaixo de 30%.`,
          acao: 'Pagar parte da fatura ou reduzir gastos',
          icon: CreditCard,
          categoria: 'credito',
          timestamp: new Date()
        })
      }

      // Alerta 2: Saldo líquido negativo
      const saldoLiquido = (saldosAtuais.banco_brasil.conta_corrente + saldosAtuais.caixa_economica.conta_corrente) - 
                          (Math.abs(saldosAtuais.banco_brasil.cartao_visa) + Math.abs(saldosAtuais.caixa_economica.cartao_elo))
      if (saldoLiquido < 0) {
        novosAlertas.push({
          id: 'saldo_negativo',
          tipo: 'critico',
          titulo: 'Saldo Líquido Negativo',
          descricao: `Suas dívidas (R$ ${Math.abs(saldoLiquido).toLocaleString('pt-BR', {minimumFractionDigits: 2})}) excedem seus saldos disponíveis.`,
          acao: 'Priorizar pagamento de dívidas',
          icon: AlertTriangle,
          categoria: 'liquidez',
          timestamp: new Date()
        })
      }

      // Alerta 3: Gastos com tecnologia muito altos
      if (dadosFinanceiros.gastos_por_categoria?.Tecnologia > 2000) {
        novosAlertas.push({
          id: 'gastos_tecnologia',
          tipo: 'atencao',
          titulo: 'Gastos Elevados com Tecnologia',
          descricao: `Você gastou R$ ${dadosFinanceiros.gastos_por_categoria.Tecnologia.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em tecnologia este mês.`,
          acao: 'Revisar compras de apps, softwares e equipamentos',
          icon: TrendingUp,
          categoria: 'gastos',
          timestamp: new Date()
        })
      }

      // Alerta 4: Comprometimento alto da renda
      if (dadosFinanceiros.comprometimento > 90) {
        novosAlertas.push({
          id: 'comprometimento_alto',
          tipo: 'atencao',
          titulo: 'Comprometimento de Renda Elevado',
          descricao: `${dadosFinanceiros.comprometimento.toFixed(1)}% da sua renda está comprometida com gastos.`,
          acao: 'Revisar orçamento e reduzir gastos variáveis',
          icon: Target,
          categoria: 'orcamento',
          timestamp: new Date()
        })
      }

      // Alerta 5: Faturas vencidas
      const hoje = new Date()
      const vencimentoBB = new Date('2025-10-22')
      const vencimentoCaixa = new Date('2025-10-11')
      
      if (hoje > vencimentoBB) {
        novosAlertas.push({
          id: 'fatura_bb_vencida',
          tipo: 'urgente',
          titulo: 'Fatura BB Vencida',
          descricao: `Fatura do cartão BB venceu em 22/10. Valor: R$ ${Math.abs(saldosAtuais.banco_brasil.cartao_visa).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          acao: 'Pagar imediatamente para evitar juros',
          icon: Clock,
          categoria: 'vencimento',
          timestamp: new Date()
        })
      }

      if (hoje > vencimentoCaixa) {
        novosAlertas.push({
          id: 'fatura_caixa_vencida',
          tipo: 'urgente',
          titulo: 'Fatura Caixa Vencida',
          descricao: `Fatura do cartão Caixa venceu em 11/10. Valor: R$ ${Math.abs(saldosAtuais.caixa_economica.cartao_elo).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
          acao: 'Pagar para regularizar situação',
          icon: Clock,
          categoria: 'vencimento',
          timestamp: new Date()
        })
      }

      // Alerta 6: Recomendação positiva (se houver progresso)
      if (utilizacaoCartaoBB < 35 && utilizacaoCartaoBB > 30) {
        novosAlertas.push({
          id: 'progresso_cartao',
          tipo: 'positivo',
          titulo: 'Progresso no Controle do Cartão',
          descricao: 'Você está próximo da meta de 30% de utilização do cartão BB.',
          acao: 'Continue reduzindo os gastos para atingir a meta',
          icon: CheckCircle,
          categoria: 'progresso',
          timestamp: new Date()
        })
      }

      return novosAlertas
    }

    setAlertas(gerarAlertas())
  }, [dadosFinanceiros, saldosAtuais])

  const marcarComoLido = (alertaId) => {
    setAlertasLidos(prev => new Set([...prev, alertaId]))
  }

  const removerAlerta = (alertaId) => {
    setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId))
  }

  const getVariantByTipo = (tipo) => {
    switch(tipo) {
      case 'critico':
      case 'urgente':
        return 'destructive'
      case 'atencao':
        return 'default'
      case 'positivo':
        return 'default'
      default:
        return 'default'
    }
  }

  const getColorByTipo = (tipo) => {
    switch(tipo) {
      case 'critico':
      case 'urgente':
        return 'text-red-600'
      case 'atencao':
        return 'text-orange-600'
      case 'positivo':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const alertasNaoLidos = alertas.filter(alerta => !alertasLidos.has(alerta.id))
  const alertasOrdenados = alertas.sort((a, b) => {
    const prioridade = { urgente: 4, critico: 3, atencao: 2, positivo: 1 }
    return prioridade[b.tipo] - prioridade[a.tipo]
  })

  return (
    <div className="space-y-4">
      {/* Resumo de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Central de Alertas Inteligentes</span>
            {alertasNaoLidos.length > 0 && (
              <Badge variant="destructive">{alertasNaoLidos.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Sistema inteligente de monitoramento financeiro adaptado para TDAH
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alertas.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-green-600">Tudo sob controle!</p>
              <p className="text-muted-foreground">Nenhum alerta crítico no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alertasOrdenados.map((alerta) => {
                const isLido = alertasLidos.has(alerta.id)
                const IconComponent = alerta.icon
                
                return (
                  <Alert 
                    key={alerta.id} 
                    variant={getVariantByTipo(alerta.tipo)}
                    className={`${isLido ? 'opacity-60' : ''} transition-opacity`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <AlertTitle className="flex items-center space-x-2">
                            <span>{alerta.titulo}</span>
                            <Badge variant="outline" className="text-xs">
                              {alerta.tipo}
                            </Badge>
                          </AlertTitle>
                          <AlertDescription className="mt-2">
                            <p className="mb-2">{alerta.descricao}</p>
                            <div className="flex items-center space-x-2">
                              <Lightbulb className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-600">
                                Ação recomendada: {alerta.acao}
                              </span>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!isLido && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => marcarComoLido(alerta.id)}
                            className="text-xs"
                          >
                            Marcar como lido
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerAlerta(alerta.id)}
                          className="p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Alert>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas dos Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Críticos</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertas.filter(a => a.tipo === 'critico' || a.tipo === 'urgente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Atenção</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alertas.filter(a => a.tipo === 'atencao').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Positivos</p>
                <p className="text-2xl font-bold text-green-600">
                  {alertas.filter(a => a.tipo === 'positivo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Não Lidos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {alertasNaoLidos.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AlertasInteligentes
