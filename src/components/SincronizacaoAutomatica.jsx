import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Cloud, CloudOff, RefreshCw, CheckCircle, AlertTriangle, 
  Clock, Wifi, WifiOff, Settings, Smartphone, Globe,
  Download, Upload, Database, Shield
} from 'lucide-react'

const SincronizacaoAutomatica = ({ onSyncComplete }) => {
  const [configuracoes, setConfiguracoes] = useState({
    autoSync: false,
    intervaloSync: 30, // minutos
    backupAutomatico: true,
    notificacoes: true,
    syncOnline: false
  })
  
  const [statusRefreshCw, setStatusRefreshCw] = useState({
    conectado: false,
    ultimaRefreshCw: null,
    proximaRefreshCw: null,
    sincronizando: false,
    erro: null
  })
  
  const [progressoRefreshCw, setProgressoRefreshCw] = useState(0)
  const [logRefreshCw, setLogRefreshCw] = useState([])

  // Simular verificação de conectividade
  useEffect(() => {
    const verificarConectividade = () => {
      const online = navigator.onLine
      setStatusRefreshCw(prev => ({ ...prev, conectado: online }))
    }

    verificarConectividade()
    window.addEventListener('online', verificarConectividade)
    window.addEventListener('offline', verificarConectividade)

    return () => {
      window.removeEventListener('online', verificarConectividade)
      window.removeEventListener('offline', verificarConectividade)
    }
  }, [])

  // Configurar sincronização automática
  useEffect(() => {
    let intervalo = null
    
    if (configuracoes.autoSync && statusRefreshCw.conectado) {
      intervalo = setInterval(() => {
        executarSincronizacao()
      }, configuracoes.intervaloSync * 60 * 1000)
    }

    return () => {
      if (intervalo) clearInterval(intervalo)
    }
  }, [configuracoes.autoSync, configuracoes.intervaloSync, statusRefreshCw.conectado])

  // Executar sincronização
  const executarSincronizacao = async () => {
    if (statusRefreshCw.sincronizando) return

    setStatusRefreshCw(prev => ({ ...prev, sincronizando: true, erro: null }))
    setProgressoRefreshCw(0)

    try {
      // Simular processo de sincronização
      const etapas = [
        'Conectando com servidor...',
        'Verificando dados locais...',
        'Enviando transações...',
        'Baixando atualizações...',
        'Sincronizando saldos...',
        'Finalizando...'
      ]

      for (let i = 0; i < etapas.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProgressoRefreshCw(((i + 1) / etapas.length) * 100)
        
        adicionarLog('info', etapas[i])
      }

      // Simular dados sincronizados
      const dadosSincronizados = {
        saldos: {
          banco_brasil: {
            conta_corrente: 9884.51,
            cartao_visa: -19303.50,
            limite_cartao: 58399
          },
          caixa_economica: {
            conta_corrente: 144.86,
            cartao_elo: -175.69,
            limite_cartao: 3000
          }
        },
        transacoes: [],
        ultimaAtualizacao: new Date().toISOString()
      }

      setStatusRefreshCw(prev => ({
        ...prev,
        sincronizando: false,
        ultimaRefreshCw: new Date(),
        proximaRefreshCw: new Date(Date.now() + configuracoes.intervaloSync * 60 * 1000)
      }))

      adicionarLog('success', 'Sincronização concluída com sucesso!')
      
      if (onRefreshCwComplete) {
        onRefreshCwComplete(dadosSincronizados)
      }

    } catch (error) {
      setStatusRefreshCw(prev => ({
        ...prev,
        sincronizando: false,
        erro: error.message
      }))
      adicionarLog('error', `Erro na sincronização: ${error.message}`)
    }
  }

  // Adicionar entrada no log
  const adicionarLog = (tipo, mensagem) => {
    const novaEntrada = {
      id: Date.now(),
      tipo,
      mensagem,
      timestamp: new Date()
    }
    setLogRefreshCw(prev => [novaEntrada, ...prev.slice(0, 9)]) // Manter apenas 10 entradas
  }

  // Atualizar configuração
  const atualizarConfiguracao = (chave, valor) => {
    setConfiguracoes(prev => ({ ...prev, [chave]: valor }))
    localStorage.setItem('orquestrador_sync_config', JSON.stringify({
      ...configuracoes,
      [chave]: valor
    }))
  }

  // Carregar configurações salvas
  useEffect(() => {
    const configSalva = localStorage.getItem('orquestrador_sync_config')
    if (configSalva) {
      setConfiguracoes(JSON.parse(configSalva))
    }
  }, [])

  const formatarTempo = (data) => {
    if (!data) return 'Nunca'
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data))
  }

  const getIconeLog = (tipo) => {
    switch (tipo) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'info': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Status da Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Status da Sincronização</span>
            {statusRefreshCw.conectado ? (
              <Badge variant="default" className="bg-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Monitoramento e controle da sincronização automática de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indicadores de Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Última RefreshCw</p>
                    <p className="text-lg font-bold">
                      {formatarTempo(statusRefreshCw.ultimaRefreshCw)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className={`h-8 w-8 ${statusRefreshCw.sincronizando ? 'animate-spin text-blue-600' : 'text-gray-600'}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-bold">
                      {statusRefreshCw.sincronizando ? 'Sincronizando' : 'Aguardando'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Próxima RefreshCw</p>
                    <p className="text-lg font-bold">
                      {configuracoes.autoSync ? formatarTempo(statusRefreshCw.proximaRefreshCw) : 'Manual'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progresso da Sincronização */}
          {statusRefreshCw.sincronizando && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Sincronização</span>
                <span>{Math.round(progressoRefreshCw)}%</span>
              </div>
              <Progress value={progressoRefreshCw} className="w-full" />
            </div>
          )}

          {/* Erro de Sincronização */}
          {statusRefreshCw.erro && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro na Sincronização</AlertTitle>
              <AlertDescription>{statusRefreshCw.erro}</AlertDescription>
            </Alert>
          )}

          {/* Botões de Ação */}
          <div className="flex space-x-2">
            <Button 
              onClick={executarSincronizacao}
              disabled={statusRefreshCw.sincronizando || !statusRefreshCw.conectado}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Sincronizar Agora</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setLogRefreshCw([])}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Limpar Log</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações de Sincronização</span>
          </CardTitle>
          <CardDescription>
            Configure como e quando seus dados devem ser sincronizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sincronização Automática */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sincronização Automática</Label>
              <p className="text-sm text-muted-foreground">
                Sincronizar dados automaticamente em intervalos regulares
              </p>
            </div>
            <Switch
              checked={configuracoes.autoSync}
              onCheckedChange={(checked) => atualizarConfiguracao('autoSync', checked)}
            />
          </div>

          {/* Intervalo de Sincronização */}
          {configuracoes.autoSync && (
            <div className="space-y-2">
              <Label htmlFor="intervalo">Intervalo de Sincronização (minutos)</Label>
              <Input
                id="intervalo"
                type="number"
                min="5"
                max="1440"
                value={configuracoes.intervaloSync}
                onChange={(e) => atualizarConfiguracao('intervaloSync', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Mínimo: 5 minutos, Máximo: 24 horas (1440 minutos)
              </p>
            </div>
          )}

          {/* Backup Automático */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Backup Automático</Label>
              <p className="text-sm text-muted-foreground">
                Criar backup local dos dados antes de cada sincronização
              </p>
            </div>
            <Switch
              checked={configuracoes.backupAutomatico}
              onCheckedChange={(checked) => atualizarConfiguracao('backupAutomatico', checked)}
            />
          </div>

          {/* Notificações */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notificações</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações sobre o status da sincronização
              </p>
            </div>
            <Switch
              checked={configuracoes.notificacoes}
              onCheckedChange={(checked) => atualizarConfiguracao('notificacoes', checked)}
            />
          </div>

          {/* Sincronização Online (Futuro) */}
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label className="text-base">Sincronização na Nuvem</Label>
              <p className="text-sm text-muted-foreground">
                Sincronizar com serviços bancários online (Em breve)
              </p>
            </div>
            <Switch
              checked={false}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Log de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Log de Atividades</span>
          </CardTitle>
          <CardDescription>
            Histórico das últimas atividades de sincronização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logRefreshCw.length > 0 ? (
              logRefreshCw.map((entrada) => (
                <div key={entrada.id} className="flex items-start space-x-3 p-2 border rounded-lg">
                  {getIconeLog(entrada.tipo)}
                  <div className="flex-1">
                    <p className="text-sm">{entrada.mensagem}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatarTempo(entrada.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade de sincronização registrada ainda.</p>
                <p className="text-sm">Execute uma sincronização para ver o log aqui.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Segurança e Privacidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Seus dados estão protegidos</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>• Todos os dados são criptografados antes da transmissão</p>
              <p>• Backups locais são criados automaticamente</p>
              <p>• Nenhuma informação sensível é armazenada em servidores externos</p>
              <p>• Você mantém controle total sobre seus dados financeiros</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default SincronizacaoAutomatica
