import axiosInstance from 'api/axiosInstance'
import { RoomSearch, Consultation, ConsultationList } from 'ts/consultation'

type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
>

export const fetchConsultations = async (RoomSearch: RoomSearch) => {
  try {
    const response = await axiosInstance.get('/consultations', {
      params: { RoomSearch },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

export const joinRoom = async (joinData: JoinData) => {
  const response = await axiosInstance.post(
    '/consultations/participants',
    joinData
  )
  console.log('Join Room Response:', response.data)
  return response.data
}
