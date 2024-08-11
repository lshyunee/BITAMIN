// src/store/useUserStore.ts
import { create } from 'zustand'
import { fetchUserInfo } from 'api/userAPI'
import { User } from 'types/userTypes'

interface UserState {
  user: User | null
  fetchUser: () => Promise<void>
  setUserImage: (image: File) => void
  updateProfileUrl: (url: string) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null, // 기본적으로 유저 정보는 null로 초기화

  // 유저 정보를 가져오는 함수
  fetchUser: async () => {
    try {
      const userData = await fetchUserInfo()
      set({ user: userData }) // 가져온 유저 정보를 상태에 저장
    } catch (error) {
      console.error('Failed to fetch user information:', error)
    }
  },

  // 유저 이미지 업데이트 함수
  setUserImage: (image: File) => {
    set((state) => ({
      user: { ...state.user, image },
    }))
  },

  // 프로필 URL 업데이트 함수
  updateProfileUrl: (url: string) => {
    set((state) => ({
      user: { ...state.user, profileUrl: url },
    }))
  },
}))

export default useUserStore
