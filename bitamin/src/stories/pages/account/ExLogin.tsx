// src/pages/Login.tsx
import { useState } from 'react'
import axiosInstance, { setAccessToken } from 'api/axiosInstance'
import useAuthStore from 'store/useAuthStore'
import { useCookies } from 'react-cookie'

const ExLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setCookie] = useCookies(['refreshToken']) // `cookies` 대신 `_`를 사용
  const setAuthAccessToken = useAuthStore((state) => state.setAccessToken)

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        '/auth/login', // URL 수정
        {
          email,
          password,
        }
      )
      const { accessToken, refreshToken } = response.data
      setAccessToken(accessToken) // axiosInstance에 accessToken 설정
      setAuthAccessToken(accessToken) // 상태 관리에 accessToken 설정
      setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict', // 또는 'lax' 또는 'none'으로 설정
      })
      alert('Login successful!')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      alert(`Login failed: ${errorMessage}`)
      console.error('Login error:', error)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default ExLogin
