import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinConsultation, useCreateRoom } from 'store/useConsultationStore'
import { CreateConsultation, Consultation } from 'ts/consultationType' // 필요한 타입 임포트

const CreateRoomPage: React.FC = () => {
  // 지연을 위한 함수
  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const [category, setCategory] = useState<string>('미술')
  const [title, setTitle] = useState<string>('')
  const [isPrivated, setIsPrivated] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')

  const navigate = useNavigate()

  // zustand에서 필요한 상태와 함수를 가져오기
  const { createRoom } = useCreateRoom()
  const { joinRoom } = joinConsultation((state) => ({
    joinRoom: state.joinRoom,
  }))

  const handleSubmit = async () => {
    const roomData: CreateConsultation = {
      category,
      title,
      isPrivated,
      password: isPrivated === 1 ? password : null,
      startTime,
      endTime,
    }

    try {
      // 방 생성
      const createdRoom: Consultation = await createRoom(roomData)
      console.log('Room created:', createdRoom)

      if (createdRoom) {
        // 생성된 방에 바로 참여
        const joinData = {
          id: createdRoom.id,
          isPrivated: createdRoom.isPrivated,
          password: createdRoom.isPrivated ? password : null,
          startTime: createdRoom.startTime,
          sessionId: createdRoom.sessionId,
        }

        await delay(500)
        await joinRoom(joinData)
        console.log('Room joined:', joinData)

        // 참여 후 다른 페이지로 이동
        navigate('/consult')
      }
    } catch (error) {
      console.error('Failed to create or join room:', error)
    }
  }

  return (
    <div>
      <h1>Create Room</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div>
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Private Room</label>
          <select
            value={isPrivated}
            onChange={(e) => setIsPrivated(Number(e.target.value))}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>
        {isPrivated === 1 && (
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isPrivated === 1}
            />
          </div>
        )}
        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  )
}

export default CreateRoomPage
