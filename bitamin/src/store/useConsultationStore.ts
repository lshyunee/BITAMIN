import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  CreateConsultation,
} from 'ts/consultationType'
import {
  fetchConsultations,
  joinRoom,
  joinRandomRoom,
  createRoom,
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
  password: string | null
}

interface JoinConsultationState {
  consultation: Consultation | null
  joinRoom: (joinData: JoinData) => Promise<void>
  resetConsultation: () => void
}

export const joinConsultation = create<JoinConsultationState>()(
  persist(
    (set) => ({
      consultation: null,

      joinRoom: async (joinData: JoinData) => {
        try {
          const data = await joinRoom(joinData)
          set({ consultation: data.consultation })
        } catch (error) {
          console.error('Failed to join room:', error)
        }
      },

      resetConsultation: () => {
        set({ consultation: null })
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
  createRoom: (roomData: CreateConsultation) => Promise<void>
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
