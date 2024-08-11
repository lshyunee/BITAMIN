import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinRoom } from 'api/consultationAPI'
import { fetchConsultationList } from 'store/useConsultationStore'

const ConsultationList: React.FC = () => {
  useEffect(() => {
    fetchConsultationList
  }, [])

  return (
    <div>
      <h1>Consultation List</h1>
      <ul>
        {consultations.map((consultation) => (
          <li key={consultation.id}>
            <p>
              <strong>Category:</strong> {consultation.category}
            </p>
            <p>
              <strong>Title:</strong> {consultation.title}
            </p>
            <p>
              <strong>Start Time:</strong> {consultation.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {consultation.endTime}
            </p>
            <p>
              <strong>Current Participants:</strong>{' '}
              {consultation.currentParticipants}
            </p>
            <p>
              <strong>Session ID:</strong> {consultation.sessionId}
            </p>
            {consultation.isPrivated ? (
              <div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={passwords[consultation.id] || ''}
                  onChange={(e) =>
                    handlePasswordChange(consultation.id, e.target.value)
                  }
                />
                <button onClick={() => handleJoinRoom(consultation)}>
                  Join Room
                </button>
              </div>
            ) : (
              <button onClick={() => handleJoinRoom(consultation)}>
                Join Room
              </button>
            )}
            <br />
          </li>
        ))}
      </ul>
      <button onClick={() => {}}></button>
      <div>
        <h2>Fetch Random Participants</h2>
        <button onClick={() => handleJoinRandomParticipants('전체')}>
          전체
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('음악')}>
          음악
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('미술')}>
          미술
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('영화')}>
          영화
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('독서')}>
          독서
        </button>
        <br />
        <button onClick={() => handleJoinRandomParticipants('대화')}>
          대화
        </button>
        <br />
        <br />
      </div>
    </div>
  )
}

export default ConsultationList
