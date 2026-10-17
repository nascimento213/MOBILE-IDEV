import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, RefreshControl, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState, useEffect, useCallback } from 'react'
import API_URL, { resolverFoto } from '@/constants/api'

type Notificacao = {
  id: string
  icone: string
  titulo: string
  descricao: string
  dataCriacao: string
  lida: boolean
  tipo: string
  referenciaId?: number
}

const ICONES_TIPO: Record<string, string> = {
  PROPOSTA: '💼',
  MENSAGEM: '💬',
  AVALIACAO: '⭐',
  PAGAMENTO: '💰',
  GERAL: '🔔',
}

const ICONE_PADRAO = 'https://ui-avatars.com/api/?background=3b82f6&color=fff&size=128&name='

function formatarTempo(dataISO: string): string {
  const agora = new Date()
  const data = new Date(dataISO)
  const diffMs = agora.getTime() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Agora'
  if (diffMin < 60) return `${diffMin} min atrás`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h atrás`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Ontem'
  return `${diffD} dias atrás`
}

export default function NotificacoesScreen() {
  const router = useRouter()
  const scheme = useColorScheme()
  const dark = scheme === 'dark'

  const { id, nome, foto, tipo, bio, email, localizacao } = useLocalSearchParams<{
    id: string
    nome: string
    foto: string
    tipo: string
    bio: string
    email: string
    localizacao: string
  }>()

  const avatarUrl = resolverFoto(foto, nome || 'U')

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)

  const buscarNotificacoes = useCallback(async (silencioso = false) => {
    if (!id) { setCarregando(false); return }
    if (!silencioso) setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/notificacao/usuario/${id}`)
      if (res.ok) {
        const dados = await res.json()
        setNotificacoes(dados)
      }
    } catch (e) {
      console.warn('Erro ao buscar notificações:', e)
    } finally {
      setCarregando(false)
      setAtualizando(false)
    }
  }, [id])

  useEffect(() => { buscarNotificacoes() }, [buscarNotificacoes])

  // Atualiza silenciosamente a cada 10 segundos
  useEffect(() => {
    const intervalo = setInterval(() => buscarNotificacoes(true), 10000)
    return () => clearInterval(intervalo)
  }, [buscarNotificacoes])

  // Atualiza silenciosamente ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      buscarNotificacoes(true)
    }, [buscarNotificacoes])
  )

  const onRefresh = () => {
    setAtualizando(true)
    buscarNotificacoes()
  }

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      await fetch(`${API_URL}/api/v1/notificacao/${notificacaoId}/lida`, { method: 'PUT' })
      setNotificacoes(prev =>
        prev.map(n => n.id === notificacaoId ? { ...n, lida: true } : n)
      )
    } catch (e) {
      console.warn('Erro ao marcar como lida:', e)
    }
  }

  const aoTocarNotificacao = (item: Notificacao) => {
    marcarComoLida(item.id)
    if (item.tipo === 'MENSAGEM' && item.referenciaId) {
      router.push({ pathname: '/mensagens', params: { id, nome, foto, tipo, bio, email, localizacao, mensagemId: String(item.referenciaId) } })
    }
  }

  const marcarTodasComoLidas = async () => {
    if (!id) return
    try {
      await fetch(`${API_URL}/api/v1/notificacao/usuario/${id}/todas-lidas`, { method: 'PUT' })
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
    } catch (e) {
      console.warn('Erro ao marcar todas como lidas:', e)
    }
  }

  const c = dark ? cores.dark : cores.light

  const renderItem = ({ item }: { item: Notificacao }) => (
    <TouchableOpacity
      onPress={() => aoTocarNotificacao(item)}
      activeOpacity={0.75}
    >
      <View style={[styles.card, { backgroundColor: c.card }, !item.lida && styles.cardNaoLido]}>
        <View style={[styles.cardIcone, { backgroundColor: c.iconeBackground }]}>
          <Text style={styles.iconeEmoji}>{item.icone || ICONES_TIPO[item.tipo] || '🔔'}</Text>
        </View>
        <View style={styles.cardConteudo}>
          <View style={styles.cardTopo}>
            <Text style={[styles.cardTitulo, { color: c.textoPrimario }]}>{item.titulo}</Text>
            <Text style={styles.cardTempo}>{formatarTempo(item.dataCriacao)}</Text>
          </View>
          <Text style={[styles.cardDescricao, { color: c.textoSecundario }]}>{item.descricao}</Text>
        </View>
        {!item.lida && <View style={styles.bolinha} />}
      </View>
    </TouchableOpacity>
  )

  const temNaoLidas = notificacoes.some(n => !n.lida)

  return (
    <View style={[styles.container, { backgroundColor: c.fundo }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={c.fundo} />

      <View style={[styles.header, { backgroundColor: c.fundo }]}>
        <Text style={[styles.headerTitulo, { color: c.textoPrimario }]}>Notificações</Text>
        <View style={styles.headerDireita}>
          {temNaoLidas && (
            <TouchableOpacity onPress={marcarTodasComoLidas} style={styles.btnLerTodas}>
              <Text style={styles.btnLerTodasTexto}>Ler todas</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push({
            pathname: '/perfil',
            params: { id, nome, foto, tipo, bio, email, localizacao }
          })}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {carregando ? (
        <View style={styles.vazio}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={onRefresh} tintColor="#3b82f6" />}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioIcone}>🔔</Text>
              <Text style={[styles.vazioTexto, { color: c.textoSecundario }]}>Nenhuma notificação por aqui</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const cores = {
  light: {
    fundo: '#f0f2f5',
    card: '#ffffff',
    iconeBackground: '#f0f2f5',
    textoPrimario: '#111827',
    textoSecundario: '#6b7280',
  },
  dark: {
    fundo: '#0d0d0d',
    card: '#1a1a1a',
    iconeBackground: '#262626',
    textoPrimario: '#f9fafb',
    textoSecundario: '#9ca3af',
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitulo: {
    fontSize: 28,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.5,
  },
  headerDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnLerTodas: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#3b82f620',
  },
  btnLerTodasTexto: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardNaoLido: {
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  cardIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconeEmoji: {
    fontSize: 22,
  },
  cardConteudo: {
    flex: 1,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitulo: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    flex: 1,
    marginRight: 8,
  },
  cardTempo: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  cardDescricao: {
    fontSize: 13,
    lineHeight: 18,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 10,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 80,
    gap: 12,
  },
  vazioIcone: {
    fontSize: 48,
  },
  vazioTexto: {
    fontSize: 15,
    fontWeight: '500',
  },
})
