import React from 'react'
import Button from 'stories/atoms/Button'

const Header: React.FC = () => {
  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <h1>My App</h1>
      <Button
        label="Sign In"
        type="DEFAULT"
        onClick={() => alert('Sign In clicked')}
      />
    </header>
  )
}

export default Header
