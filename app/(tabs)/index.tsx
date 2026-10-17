import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function HomeScreen() {
  const dark = useColorScheme() === 'dark'

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#0d0d0d' : '#f0f2f5' }]}>
      <Text style={[styles.titulo, { color: dark ? '#f9fafb' : '#111827' }]}>IDEV</Text>
      <Text style={[styles.subtitulo, { color: dark ? '#6b7280' : '#9ca3af' }]}>
        Plataforma de conexão entre profissionais e empresas
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 48,
    fontFamily: 'Nunito_800ExtraBold',
    letterSpacing: 6,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
})
