export interface RoomSearch {
  page: number | null
  size: number | null
  type: string | null
}

export interface Consultation {
  id: number
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
  currentParticipants: number
  sessionId: string
}

export interface RandomJoin {
  type: string
}

export interface CurrentConsultaion {
  id: number
  isPrivated: number
  password?: string | null
  startTime: string
  sessionId: string
}

export interface JoinConsultation {
  consultationId: number
  sessionId: string
  token: string
  id: number
  memberId: number
  nickname: string
  profileKey: string
  profileUrl: string
}

export interface CreateConsultation {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}

export interface ConsultationList {
  consultationList: Consultation[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface RoomData {
  category: string
  title: string
  isPrivated: number
  password?: string | null
  startTime: string
  endTime: string
}
