import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { resolverFoto } from '@/constants/api'
import { useColorScheme } from '@/hooks/use-color-scheme'

const ICONE_PADRAO = 'https://ui-avatars.com/api/?background=3b82f6&color=fff&size=256&name='

export default function PerfilScreen() {
  const router = useRouter()
  const scheme = useColorScheme()
  const dark = scheme === 'dark'
  const c = dark ? cores.dark : cores.light

  const { nome, foto, bio, email, localizacao, tipo } = useLocalSearchParams<{
    nome: string
    foto: string
    bio: string
    email: string
    localizacao: string
    tipo: string
  }>()

  const avatarUrl = resolverFoto(foto, nome || 'U')
  const tipoLabel = tipo === 'PROFISSIONAL' ? 'Profissional' : 'Empresa'

  return (
    <View style={[styles.container, { backgroundColor: c.fundo }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={c.fundo} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.fundo }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarTexto}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitulo, { color: c.textoPrimario }]}>Perfil</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={[styles.nome, { color: c.textoPrimario }]}>{nome || 'Usuário'}</Text>
          <View style={styles.tipoBadge}>
            <Text style={styles.tipoTexto}>{tipoLabel}</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={[styles.secao, { backgroundColor: c.card }]}>
          {email ? (
            <View style={[styles.infoItem, { borderBottomColor: c.divisor }]}>
              <Text style={[styles.infoLabel, { color: c.textoSecundario }]}>Email</Text>
              <Text style={[styles.infoValor, { color: c.textoPrimario }]}>{email}</Text>
            </View>
          ) : null}

          {localizacao ? (
            <View style={[styles.infoItem, { borderBottomColor: c.divisor }]}>
              <Text style={[styles.infoLabel, { color: c.textoSecundario }]}>Localização</Text>
              <Text style={[styles.infoValor, { color: c.textoPrimario }]}>{localizacao}</Text>
            </View>
          ) : null}

          <View style={[styles.infoItem, { borderBottomColor: 'transparent' }]}>
            <Text style={[styles.infoLabel, { color: c.textoSecundario }]}>Bio</Text>
            <Text style={[styles.infoValor, { color: c.textoPrimario }]}>
              {bio || 'Nenhuma bio cadastrada.'}
            </Text>
          </View>
        </View>

        {/* Aviso edição */}
        <View style={[styles.avisoBox, { backgroundColor: dark ? '#1a2a3a' : '#eff6ff', borderColor: dark ? '#1e3a5f' : '#bfdbfe' }]}>
          <Text style={styles.avisoIcone}>🖥️</Text>
          <Text style={styles.avisoTexto}>
            Para editar seu perfil, acesse o site IDEV pelo computador.
          </Text>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={styles.btnSair}
          onPress={() => router.replace('/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const cores = {
  light: {
    fundo: '#f0f2f5',
    card: '#ffffff',
    textoPrimario: '#111827',
    textoSecundario: '#9ca3af',
    divisor: '#f3f4f6',
  },
  dark: {
    fundo: '#0d0d0d',
    card: '#1a1a1a',
    textoPrimario: '#f9fafb',
    textoSecundario: '#6b7280',
    divisor: '#262626',
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
    paddingBottom: 16,
  },
  btnVoltar: {
    width: 60,
  },
  btnVoltarTexto: {
    fontSize: 17,
    color: '#3b82f6',
    fontFamily: 'Poppins_600SemiBold',
  },
  headerTitulo: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  scroll: {
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#3b82f6',
    borderWidth: 3,
    borderColor: '#3b82f6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nome: {
    fontSize: 22,
    fontFamily: 'Poppins_800ExtraBold',
    marginBottom: 8,
  },
  tipoBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tipoTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secao: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoValor: {
    fontSize: 15,
    lineHeight: 22,
  },
  avisoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  avisoIcone: {
    fontSize: 20,
  },
  avisoTexto: {
    flex: 1,
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '500',
    lineHeight: 18,
  },
  btnSair: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#ef44441a',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSairTexto: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
})
