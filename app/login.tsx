import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import API_URL from '@/constants/api'

type TipoUsuario = 'PROFISSIONAL' | 'EMPRESA'

export default function LoginScreen() {
  const router = useRouter()
  const [tipo, setTipo] = useState<TipoUsuario>('PROFISSIONAL')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusSenha, setFocusSenha] = useState(false)

  const handleLogin = async () => {
    setErro('')

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha o email e a senha.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), senha }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro('Email ou senha incorretos.')
        return
      }

      const tipoRetornado: string = (data.tipo || '').toUpperCase()

      if (tipoRetornado !== tipo) {
        const nomeEsperado = tipo === 'PROFISSIONAL' ? 'Profissional' : 'Empresa'
        setErro(`Esta conta não é do tipo ${nomeEsperado}. Selecione o tipo correto.`)
        return
      }

      router.replace({
        pathname: '/notificacoes',
        params: {
          id: data.id || '',
          nome: data.nome || '',
          foto: data.fotoPerfil || '',
          tipo: tipoRetornado,
          bio: data.bio || '',
          email: data.email || '',
          localizacao: data.localizacao || '',
        },
      })
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.title}>IDEV</Text>
        <Text style={styles.subtitle}>Acesse sua conta</Text>

        {/* Seletor Profissional / Empresa */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeBtn, tipo === 'PROFISSIONAL' && styles.typeBtnActive]}
            onPress={() => { setTipo('PROFISSIONAL'); setErro(''); setEmail(''); setSenha('') }}
            activeOpacity={0.8}
          >
            <Text style={[styles.typeBtnText, tipo === 'PROFISSIONAL' && styles.typeBtnTextActive]}>
              Profissional
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, tipo === 'EMPRESA' && styles.typeBtnActive]}
            onPress={() => { setTipo('EMPRESA'); setErro(''); setEmail(''); setSenha('') }}
            activeOpacity={0.8}
          >
            <Text style={[styles.typeBtnText, tipo === 'EMPRESA' && styles.typeBtnTextActive]}>
              Empresa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, focusEmail && styles.inputFocused, erro ? styles.inputErro : null]}
            value={email}
            onChangeText={(v) => { setEmail(v); setErro('') }}
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
            placeholder="seu@email.com"
            placeholderTextColor="#4b5563"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            cursorColor="#3b82f6"
            selectionColor="#3b82f6"
            underlineColorAndroid="transparent"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, focusSenha && styles.inputFocused, erro ? styles.inputErro : null]}
            value={senha}
            onChangeText={(v) => { setSenha(v); setErro('') }}
            onFocus={() => setFocusSenha(true)}
            onBlur={() => setFocusSenha(false)}
            placeholder="••••••••"
            placeholderTextColor="#4b5563"
            secureTextEntry
            cursorColor="#3b82f6"
            selectionColor="#3b82f6"
            underlineColorAndroid="transparent"
          />

          {/* Mensagem de erro */}
          {erro ? (
            <View style={styles.erroBox}>
              <Text style={styles.erroTexto}>⚠ {erro}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.btnLogin, loading && styles.btnLoading]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnLoginText}>Entrar</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 60,
  },
  title: {
    fontSize: 52,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 4,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#4b5563',
  },
  typeBtnText: {
    color: '#9ca3af',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  typeBtnTextActive: {
    color: '#ffffff',
  },
  form: {
    gap: 2,
  },
  label: {
    color: '#d1d5db',
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#3b82f6',
  },
  inputErro: {
    borderColor: '#ef4444',
  },
  erroBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  erroTexto: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
  },
  btnLogin: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  btnLoading: {
    opacity: 0.65,
  },
  btnLoginText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
})
