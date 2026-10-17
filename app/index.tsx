import { View, Image, TouchableOpacity, StyleSheet, StatusBar, Text } from 'react-native'
import { useRouter } from 'expo-router'

export default function SplashScreen() {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/login')}
      activeOpacity={1}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.hint}>Toque para continuar</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    letterSpacing: 1.5,
  },
})
