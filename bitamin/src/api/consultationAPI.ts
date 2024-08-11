import axiosInstance from 'api/axiosInstance'
import {
  RoomSearch,
  Consultation,
  ConsultationList,
  RoomData,
} from 'ts/consultation'

type JoinData = Pick<
  Consultation,
  'id' | 'isPrivated' | 'password' | 'startTime' | 'sessionId'
>

export const fetchConsultations = async (RoomSearch: RoomSearch) => {
  try {
    const response = await axiosInstance.get('/consultations', {
      params: {
        page: RoomSearch.page,
        size: RoomSearch.size,
        type: RoomSearch.type,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching consultations:', error)
    throw error
  }
}

export const createRoom = async (roomData: RoomData) => {
  const response = await axiosInstance.post('/consultations', roomData)
  // console.log('Create Room Response:', response.data)
  return response.data
}

export const joinRoom = async (joinData: JoinData) => {
  const response = await axiosInstance.post(
    '/consultations/participants',
    joinData
  )
  console.log('Join Room Response:', response.data)
  return response.data
}

export const joinRandomRoom = async (type: string) => {
  try {
    const response = await axiosInstance.post(
      '/consultations/random-participants',
      { type }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching random participants:', error)
    throw error
  }
}
