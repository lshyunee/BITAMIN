import React, { useState } from 'react'
import { createMessage } from 'api/messageAPI'
import { useNavigate } from 'react-router-dom'

const MessageCreatePage: React.FC = () => {
  const [receiverId, setReceiverId] = useState(1)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [counselingDate, setCounselingDate] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const messageData = {
        receiverId,
        category,
        title,
        content,
        counselingDate,
      }
      await createMessage(messageData)
      alert('Message created successfully!')
      navigate('/messagelist') // Redirect to the message list page
    } catch (error) {
      alert('Failed to create message')
      console.error('Error creating message:', error)
    }
  }

  return (
    <div>
      <h1>Create Message</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Receiver ID</label>
          <input
            type="number"
            value={receiverId}
            onChange={(e) => setReceiverId(Number(e.target.value))}
            required
          />
        </div>
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
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Counseling Date</label>
          <input
            type="datetime-local"
            value={counselingDate}
            onChange={(e) => setCounselingDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Message</button>
      </form>
    </div>
  )
}

export default MessageCreatePage
