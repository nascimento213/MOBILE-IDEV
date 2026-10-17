import { Platform } from 'react-native'

const API_URL = Platform.select({
  web: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
})!

const SITE_URL = Platform.select({
  web: 'http://localhost:5173',
  android: 'http://10.0.2.2:5173',
  ios: 'http://localhost:5173',
  default: 'http://localhost:5173',
})!

export function resolverFoto(foto: string | undefined | null, nome: string): string {
  if (!foto) return `https://ui-avatars.com/api/?background=3b82f6&color=fff&size=256&name=${encodeURIComponent(nome || 'U')}`
  if (foto.startsWith('http')) return foto
  if (foto.startsWith('/uploads')) return `${API_URL}${foto}`
  if (foto.startsWith('/assets')) return `${API_URL}${foto}`
  return `https://ui-avatars.com/api/?background=3b82f6&color=fff&size=256&name=${encodeURIComponent(nome || 'U')}`
}

export default API_URL
