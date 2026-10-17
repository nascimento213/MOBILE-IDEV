import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function ExploreScreen() {
  const dark = useColorScheme() === 'dark'

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#0d0d0d' : '#f0f2f5' }]}>
      <Text style={[styles.texto, { color: dark ? '#6b7280' : '#9ca3af' }]}>
        Em breve
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
})
