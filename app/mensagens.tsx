import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useState, useEffect, useCallback } from 'react'
import API_URL from '@/constants/api'

type Mensagem = {
  id: number
  remetenteId: number
  destinatarioId: number
  assunto: string
  mensagem: string
  dataEnvio: string
  lida: boolean
}

type Usuario = {
  id: number
  nome: string
}

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

export default function MensagensScreen() {
  const router = useRouter()
  const scheme = useColorScheme()
  const dark = scheme === 'dark'
  const c = dark ? cores.dark : cores.light

  const { id, nome, foto, tipo, bio, email, localizacao, mensagemId } = useLocalSearchParams<{
    id: string
    nome: string
    foto: string
    tipo: string
    bio: string
    email: string
    localizacao: string
    mensagemId?: string
  }>()

  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [usuarios, setUsuarios] = useState<Record<number, string>>({})
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)

  const buscar = useCallback(async (silencioso = false) => {
    if (!id) { setCarregando(false); return }
    if (!silencioso) setCarregando(true)
    try {
      const urlMsgs = mensagemId
        ? `${API_URL}/api/v1/mensagem/${mensagemId}`
        : `${API_URL}/api/v1/mensagem/recebidas/${id}`

      const [resMsgs, resUsers] = await Promise.all([
        fetch(urlMsgs),
        fetch(`${API_URL}/api/v1/usuario`),
      ])
      if (resMsgs.ok) {
        const dados = await resMsgs.json()
        const lista: Mensagem[] = mensagemId ? [dados] : dados
        setMensagens(lista.sort((a, b) => new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime()))
      }
      if (resUsers.ok) {
        const users: Usuario[] = await resUsers.json()
        const mapa: Record<number, string> = {}
        users.forEach(u => { mapa[u.id] = u.nome })
        setUsuarios(mapa)
      }
    } catch (e) {
      console.warn('Erro ao buscar mensagens:', e)
    } finally {
      setCarregando(false)
      setAtualizando(false)
    }
  }, [id, mensagemId])

  useEffect(() => { buscar() }, [buscar])

  const tituloHeader = mensagemId && mensagens.length > 0 && usuarios[mensagens[0].remetenteId]
    ? usuarios[mensagens[0].remetenteId]
    : 'Mensagens'

  const marcarLida = async (msgId: number) => {
    try {
      await fetch(`${API_URL}/api/v1/mensagem/${msgId}/lida`, { method: 'PATCH' })
      setMensagens(prev => prev.map(m => m.id === msgId ? { ...m, lida: true } : m))
    } catch {}
  }

const renderItem = ({ item }: { item: Mensagem }) => {
    return (
      <TouchableOpacity onPress={() => marcarLida(item.id)} activeOpacity={1}>
        <View style={[styles.card, { backgroundColor: c.card }, !item.lida && styles.cardNaoLido]}>
          <Text style={styles.tempo}>{formatarTempo(item.dataEnvio)}</Text>
          <View style={styles.balao}>
            <Text style={styles.balaoTexto}>{item.mensagem}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: c.fundo }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={c.fundo} />

      <View style={[styles.header, { backgroundColor: c.fundo }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarTexto}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitulo, { color: c.textoPrimario }]}>{tituloHeader}</Text>
        <View style={{ width: 60 }} />
      </View>

      {carregando ? (
        <View style={styles.vazio}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={mensagens}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => { setAtualizando(true); buscar(true) }} tintColor="#3b82f6" />}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioIcone}>💬</Text>
              <Text style={[styles.vazioTexto, { color: c.textoSecundario }]}>Nenhuma mensagem recebida</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const cores = {
  light: { fundo: '#f0f2f5', card: '#ffffff', textoPrimario: '#111827', textoSecundario: '#6b7280' },
  dark: { fundo: '#0d0d0d', card: '#1a1a1a', textoPrimario: '#f9fafb', textoSecundario: '#9ca3af' },
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  btnVoltar: { width: 60 },
  btnVoltarTexto: { fontSize: 17, color: '#3b82f6', fontFamily: 'Poppins_600SemiBold' },
  headerTitulo: { fontSize: 18, fontFamily: 'Poppins_700Bold' },
  lista: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  card: {
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardNaoLido: { borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  balao: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 16,
    marginBottom: 10,
  },
  balaoTexto: { fontSize: 15, lineHeight: 22, color: '#ffffff', fontFamily: 'Poppins_400Regular' },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 8 },
  remetente: { fontSize: 13, fontFamily: 'Poppins_600SemiBold' },
  tempo: { fontSize: 11, color: '#9ca3af', marginBottom: 8, textAlign: 'right' },
  bolinha: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#3b82f6', marginLeft: 8 },
  vazio: { alignItems: 'center', marginTop: 80, gap: 12 },
  vazioIcone: { fontSize: 48 },
  vazioTexto: { fontSize: 15, fontWeight: '500' },
})
