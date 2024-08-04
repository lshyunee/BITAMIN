// src/axios/axiosInstance.ts
import axios from 'axios'
import useAuthStore from 'store/useAuthStore'

let accessToken: string | null = null

const axiosInstance = axios.create({
  baseURL: 'https://i11b105.p.ssafy.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HTTP-only 쿠키를 전송하기 위해 설정
})

const EXCLUDED_PATHS = ['/auth/login', '/members/register']

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    if (
      config.url &&
      !EXCLUDED_PATHS.some((path) => config.url!.includes(path))
    ) {
      const token = accessToken || useAuthStore.getState().accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      originalRequest.url &&
      !EXCLUDED_PATHS.some((path) => originalRequest.url.includes(path))
    ) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const response = await axiosInstance.post('/refresh-token')
          const newAccessToken = response.data.accessToken
          accessToken = newAccessToken
          useAuthStore.getState().setAccessToken(newAccessToken)
          axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export const setAccessToken = (token: string) => {
  accessToken = token
}

export default axiosInstance
