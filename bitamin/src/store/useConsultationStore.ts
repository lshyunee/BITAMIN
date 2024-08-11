import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { RoomSearch, Consultation, ConsultationList } from 'ts/consultation'
import { fetchConsultations, joinRoom } from 'api/consultationAPI'
import ConsultationList from '@/stories/organisms/ConsultationList'
import ConsultationList from '@/stories/organisms/ConsultationList'

interface ConsultationState {
  ConsultationList: ConsultationList[]
  fetchConsultations: (roomSearch: RoomSearch) => Promise<void>
}

export const fetchConsultationList = create<ConsultationState>()(
  persist(
    (set) => ({
      ConsultationList: [], // 기본적으로 빈 리스트로 초기화

      fetchConsultations: async (roomSearch: RoomSearch) => {
        try {
          const data = await fetchConsultations(roomSearch)
          set({
            ConsultationList: data.consultationList,
          })
        } catch (error) {
          console.error('Failed to fetch consultations:', error)
        }
      },
    }),
    {
      name: 'consultationList-storage', // 스토리지 이름 설정
    }
  )
)

type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
>

interface JoinConsultationState {
  consultation: Consultation | null
  joinRoom: (joinData: JoinData) => Promise<void>
}

export const joinConsultation = create<JoinConsultationState>()(
  persist(
    (set) => ({
      consultation: null,

      joinRoom: async (joinData: JoinData) => {
        try {
          const data = await joinRoom(joinData)
          set({
            consultation: data.consultation,
          })
        } catch (error) {
          console.error('Failed to join room:', error)
        }
      },
    }),
    {
      name: 'consultation-storage',
    }
  )
)
