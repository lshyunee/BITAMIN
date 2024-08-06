import React, { useEffect, useState } from 'react'
import { fetchParticipants } from 'api/participantsAPI'
import useParticipantStore from 'store/useParticipantStore'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

const ParticipantsList: React.FC = () => {
  const participants = useParticipantStore((state) => state.participants)
  const setParticipants = useParticipantStore((state) => state.setParticipants)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const participantsData: Participant[] = await fetchParticipants()
        setParticipants(participantsData)
      } catch (err) {
        setError('Failed to fetch participants')
      } finally {
        setLoading(false)
      }
    }

    loadParticipants()
  }, [setParticipants])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Participants List</h1>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id}>
            <p>
              <strong>Nickname:</strong> {participant.memberNickname}
            </p>
            <p>
              <strong>Consultation Date:</strong>{' '}
              {new Date(participant.consultationDate).toLocaleString()}
            </p>
            <p>
              <strong>Consultation ID:</strong> {participant.consultationId}
            </p>
            <p>
              <strong>Member ID:</strong> {participant.memberId}
            </p>
            <br />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ParticipantsList
