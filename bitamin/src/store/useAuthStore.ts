import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: string | null
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setRole: (role: string) => void
  clearAuth: () => void
}

function base64Decode(str: string): string {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  } catch (e) {
    console.error('Base64 decoding failed', e)
    return ''
  }
}

function parseJwt(token: string): any {
  try {
    const base64Payload = token.split('.')[1]
    const payload = base64Decode(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    console.error('JWT parsing failed', e)
    return null
  }
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      setAccessToken: (token) => {
        let role = null
        if (token) {
          const decodedToken = parseJwt(token)
          role = decodedToken ? decodedToken.role : null
        }
        set({ accessToken: token, role })
      },
      setRefreshToken: (token) => set({ refreshToken: token }),
      setRole: (role) => set({ role }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, role: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 사용할 스토리지 (기본값은 localStorage)
    }
  )
)

export default useAuthStore
