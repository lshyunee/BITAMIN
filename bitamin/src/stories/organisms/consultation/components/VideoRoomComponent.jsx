import axios from 'axios'
import { OpenVidu } from 'openvidu-browser'
import React, { useState, useEffect } from 'react'
import ChatComponent from './chat/ChatComponent'
import DialogExtensionComponent from './dialog-extension/DialogExtension'
import StreamComponent from './stream/StreamComponent'
import './VideoRoomComponent.css'

import OpenViduLayout from '../layout/openvidu-layout'
import UserModel from '../models/user-model'
import ToolbarComponent from './toolbar/ToolbarComponent'

const localUser = new UserModel()

const VideoRoomComponent = (props) => {
  const [mySessionId, setMySessionId] = useState('')
  const [myUserName, setMyUserName] = useState('')
  const [session, setSession] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [chatDisplay, setChatDisplay] = useState('none')
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null)

  const layout = new OpenViduLayout()
  const remotes = []
  let localUserAccessAllowed = false

  useEffect(() => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: 'OV_big',
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }

    layout.initLayoutContainer(
      document.getElementById('layout'),
      openViduLayoutOptions
    )
    window.addEventListener('beforeunload', onbeforeunload)
    window.addEventListener('resize', updateLayout)
    window.addEventListener('resize', checkSize)
    joinSession()

    return () => {
      window.removeEventListener('beforeunload', onbeforeunload)
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('resize', checkSize)
      leaveSession()
    }
  }, [])

  const onbeforeunload = (event) => {
    leaveSession()
  }

  const joinSession = () => {
    const OV = new OpenVidu()
    const newSession = OV.initSession()
    setSession(newSession)

    subscribeToStreamCreated(newSession)
    connectToSession(newSession)
  }

  const connectToSession = async (newSession) => {
    try {
      const token = await getToken()
      newSession
        .connect(token, { clientData: myUserName })
        .then(() => {
          connectWebCam(newSession)
        })
        .catch((error) => {
          alert('There was an error connecting to the session:', error.message)
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message
          )
        })
    } catch (error) {
      alert('There was an error getting the token:', error.message)
      console.error(
        'There was an error getting the token:',
        error.code,
        error.message
      )
    }
  }

  const connectWebCam = async (newSession) => {
    try {
      await OV.getUserMedia({ audioSource: undefined, videoSource: undefined })
      const devices = await OV.getDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      const publisher = OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: videoDevices[0].deviceId,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      })

      if (newSession.capabilities.publish) {
        publisher.on('accessAllowed', () => {
          newSession.publish(publisher).then(() => {
            updateSubscribers()
            localUserAccessAllowed = true
          })
        })
      }

      localUser.setNickname(myUserName)
      localUser.setConnectionId(newSession.connection.connectionId)
      localUser.setScreenShareActive(false)
      localUser.setStreamManager(publisher)
      subscribeToUserChanged(newSession)
      subscribeToStreamDestroyed(newSession)
      sendSignalUserChanged(newSession, {
        isScreenShareActive: localUser.isScreenShareActive(),
      })

      setCurrentVideoDevice(videoDevices[0])
      setSession(newSession)
    } catch (e) {
      console.error(e)
    }
  }

  const updateSubscribers = () => {
    setSubscribers([...remotes])
  }

  const leaveSession = () => {
    if (session) {
      session.disconnect()
    }

    setSession(null)
    setSubscribers([])
    setMySessionId('SessionA')
    setMyUserName('OpenVidu_User' + Math.floor(Math.random() * 100))
  }

  const updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout()
    }, 20)
  }

  const sendSignalUserChanged = (session, data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    }
    session.signal(signalOptions)
  }

  return (
    <div className="container" id="container">
      <ToolbarComponent
        sessionId={mySessionId}
        user={localUser}
        showNotification={false}
        camStatusChanged={() => {}}
        micStatusChanged={() => {}}
        screenShare={() => {}}
        stopScreenShare={() => {}}
        toggleFullscreen={() => {}}
        switchCamera={() => {}}
        leaveSession={leaveSession}
        toggleChat={() => {}}
      />

      <DialogExtensionComponent showDialog={false} cancelClicked={() => {}} />

      <div id="layout" className="bounds">
        {localUser.getStreamManager() && (
          <div className="OT_root OT_publisher custom-class" id="localUser">
            <StreamComponent user={localUser} handleNickname={() => {}} />
          </div>
        )}
        {subscribers.map((sub, i) => (
          <div
            key={i}
            className="OT_root OT_publisher custom-class"
            id="remoteUsers"
          >
            <StreamComponent
              user={sub}
              streamId={sub.streamManager.stream.streamId}
            />
          </div>
        ))}
        {localUser.getStreamManager() && (
          <div
            className="OT_root OT_publisher custom-class"
            style={{ display: chatDisplay }}
          >
            <ChatComponent
              user={localUser}
              chatDisplay={chatDisplay}
              close={() => {}}
              messageReceived={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoRoomComponent
