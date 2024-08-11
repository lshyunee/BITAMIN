import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  CreateConsultation,
  JoinConsultation,
  ChatLog,
  Message,
} from 'ts/consultationType'
import {
  fetchConsultations,
  joinRoom,
  joinRandomRoom,
  createRoom,
  sendChatGPTMessage,
} from 'api/consultationAPI'

// Consultation List 상태 관리
interface ConsultationState {
  ConsultationList: ConsultationList | null
  fetchConsultations: (roomSearch: RoomSearch) => Promise<void>
}

export const fetchConsultationList = create<ConsultationState>()(
  persist(
    (set) => ({
      ConsultationList: null,

      fetchConsultations: async (roomSearch: RoomSearch) => {
        try {
          const data = await fetchConsultations(roomSearch)
          set({ ConsultationList: data.consultationList })
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
        }
      },
    }),
    {
      name: 'consultationList-storage',
    }
  )
)

// 방 참여 상태 관리
type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
> & {
  password: string
}

interface JoinConsultationState {
  joinconsultation: JoinConsultation | null
  joinRoom: (joinData: JoinData) => Promise<void>
  resetConsultation: () => void
}

export const joinConsultation = create<JoinConsultationState>()(
  persist(
    (set) => ({
      joinconsultation: null,

      joinRoom: async (joinData: JoinData) => {
        try {
          // 방에 참여하고 결과 데이터를 consultation으로 받음
          const consultation = await joinRoom(joinData)

          // 받은 consultation 데이터를 zustand 스토어에 저장
          set({ joinconsultation: consultation })

          // consultation 데이터를 반환하여 로컬에서도 사용 가능하게 함
          return consultation
        } catch (error) {
          console.error('Failed to join room:', error)
          throw error // 에러 발생 시 상위 호출 스택으로 에러를 전달
        }
      },

      resetConsultation: () => {
        set({ joinconsultation: null })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

// 방 생성 상태 관리
interface CreateRoomState {
  createdRoom: Consultation | null
  createRoom: (
    roomData: CreateConsultation
  ) => Promise<Consultation | undefined>
  resetCreatedRoom: () => void
}

export const useCreateRoom = create<CreateRoomState>()(
  persist(
    (set) => ({
      createdRoom: null,

      createRoom: async (roomData: CreateConsultation) => {
        try {
          const createdRoom = await createRoom(roomData)
          set({ createdRoom })
          return createdRoom
        } catch (error) {
          console.error('Failed to create room:', error)
          return undefined // 또는 다른 적절한 기본값을 반환할 수 있습니다.
        }
      },

      resetCreatedRoom: () => {
        set({ createdRoom: null })
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)

// 랜덤 방 참여 상태 관리
interface joinRandomRoomState {
  type: string | null
  consultation: Consultation | null
  joinRandomRoom: (type: string) => Promise<void>
}

export const useJoinRandomRoom = create<joinRandomRoomState>()(
  persist(
    (set) => ({
      type: null,
      consultation: null,
      joinRandomRoom: async (type: string) => {
        try {
          const data = await joinRandomRoom(type)
          set({ consultation: data.consultation })
        } catch (error) {
          console.error('Failed to join room:', error)
        }
      },
    }),
    { name: 'consultation-storage' }
  )
)

// GPT 메시지 상태 관리
interface ChatState {
  chatLog: ChatLog
  sendMessage: (
    user: string,
    content: string,
    category: string
  ) => Promise<void>
  resetChatLog: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatLog: {},

      sendMessage: async (user: string, content: string, category: string) => {
        try {
          const currentChatLog = get().chatLog

          // 유저의 메시지 배열을 가져오고 없으면 빈 배열을 할당
          const userMessages = currentChatLog[user]?.messages || []

          // 유저 메시지 추가
          const userMessage = {
            role: 'user' as const,
            content,
          }

          // API 요청
          const response = await sendChatGPTMessage(
            user,
            content,
            category,
            userMessages
          )

          // 응답 메시지 추가
          const assistantMessage = {
            role: 'assistant' as const,
            content: response.gptResponses[user].content,
          }

          // 상태 업데이트
          set((state) => ({
            chatLog: {
              ...state.chatLog,
              [user]: {
                userId: user,
                messages: [...userMessages, userMessage, assistantMessage],
              },
            },
          }))
        } catch (error) {
          console.error('Failed to send message to ChatGPT:', error)
          throw error
        }
      },

      resetChatLog: () => {
        set({ chatLog: {} })
      },
    }),
    {
      name: 'chat-log-storage',
    }
  )
)
