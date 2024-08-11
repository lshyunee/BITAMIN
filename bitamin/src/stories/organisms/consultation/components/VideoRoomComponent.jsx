import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { OpenVidu } from 'openvidu-browser'
import ChatComponent from './chat/ChatComponent'
import DialogExtensionComponent from './dialog-extension/DialogExtension'
import StreamComponent from './stream/StreamComponent'
import './VideoRoomComponent.css'

import OpenViduLayout from '../layout/openvidu-layout'
import UserModel from '../models/user-model'
import ToolbarComponent from './toolbar/ToolbarComponent'

let localUser = new UserModel()

const VideoRoomComponent = (props) => {
  const [mySessionId, setMySessionId] = useState(
    props.sessionName ? props.sessionName : 'SessionA'
  )
  const [myUserName, setMyUserName] = useState(
    props.user ? props.user : 'OpenVidu_User' + Math.floor(Math.random() * 100)
  )
  const [session, setSession] = useState(null)
  const [localUserState, setLocalUserState] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [chatDisplay, setChatDisplay] = useState('none')
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined)
  const [showExtensionDialog, setShowExtensionDialog] = useState(false)
  const [messageReceived, setMessageReceived] = useState(false)

  const layout = new OpenViduLayout()
  let remotes = []
  let localUserAccessAllowed = false

  const joinSession = useCallback(async () => {
    const OV = new OpenVidu()
    const session = OV.initSession()
    setSession(session)

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined)
      subscriber.on('streamPlaying', () => {
        checkSomeoneShareScreen()
        subscriber.videos[0].video.parentElement.classList.remove(
          'custom-class'
        )
      })
      const newUser = new UserModel()
      newUser.setStreamManager(subscriber)
      newUser.setConnectionId(event.stream.connection.connectionId)
      newUser.setType('remote')
      const nickname = event.stream.connection.data.split('%')[0]
      newUser.setNickname(JSON.parse(nickname).clientData)
      remotes.push(newUser)
      if (localUserAccessAllowed) {
        updateSubscribers()
      }
    })

    session.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream)
      setTimeout(() => {
        checkSomeoneShareScreen()
      }, 20)
      event.preventDefault()
      updateLayout()
    })

    session.on('signal:userChanged', (event) => {
      let updatedSubscribers = [...subscribers]
      updatedSubscribers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data)
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive)
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive)
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname)
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive)
          }
        }
      })
      setSubscribers(updatedSubscribers)
      checkSomeoneShareScreen()
    })

    try {
      const token = props.token ? props.token : await getToken()
      await session.connect(token, { clientData: myUserName })
      connectWebCam()
    } catch (error) {
      console.error('There was an error connecting to the session:', error)
      if (props.error) {
        props.error({
          error: error.error,
          message: error.message,
          code: error.code,
          status: error.status,
        })
      }
    }
  }, [props.token, props.error, myUserName, session])

  const getToken = async () => {
    const sessionId = await createSession(mySessionId)
    return await createToken(sessionId)
  }

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.data
  }

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.data
  }

  const connectWebCam = useCallback(async () => {
    await session.getUserMedia({
      audioSource: undefined,
      videoSource: undefined,
    })
    const devices = await session.getDevices()
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    )

    const publisher = session.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    })

    if (session.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        session.publish(publisher).then(() => {
          updateSubscribers()
          localUserAccessAllowed = true
          if (props.joinSession) {
            props.joinSession()
          }
        })
      })
    }

    localUser.setNickname(myUserName)
    localUser.setConnectionId(session.connection.connectionId)
    localUser.setScreenShareActive(false)
    localUser.setStreamManager(publisher)
    setLocalUserState(localUser)
    setCurrentVideoDevice(videoDevices[0])

    publisher.on('streamPlaying', () => {
      updateLayout()
      publisher.videos[0].video.parentElement.classList.remove('custom-class')
    })
  }, [session, myUserName, props.joinSession])

  const updateSubscribers = () => {
    setSubscribers([...remotes])
  }

  const leaveSession = () => {
    const mySession = session
    if (mySession) {
      mySession.disconnect()
    }
    setSession(undefined)
    setSubscribers([])
    setMySessionId('SessionA')
    setMyUserName('OpenVidu_User' + Math.floor(Math.random() * 100))
    setLocalUserState(undefined)
  }

  const camStatusChanged = () => {
    localUser.setVideoActive(!localUser.isVideoActive())
    localUser.getStreamManager().publishVideo(localUser.isVideoActive())
    sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() })
    setLocalUserState(localUser)
  }

  const micStatusChanged = () => {
    localUser.setAudioActive(!localUser.isAudioActive())
    localUser.getStreamManager().publishAudio(localUser.isAudioActive())
    sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() })
    setLocalUserState(localUser)
  }

  const nicknameChanged = (nickname) => {
    localUser.setNickname(nickname)
    sendSignalUserChanged({ nickname: localUser.getNickname() })
    setLocalUserState(localUser)
  }

  const deleteSubscriber = (stream) => {
    const updatedSubscribers = subscribers.filter(
      (user) => user.getStreamManager().stream !== stream
    )
    setSubscribers(updatedSubscribers)
  }

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    }
    session.signal(signalOptions)
  }

  const toggleFullscreen = () => {
    const document = window.document
    const fs = document.getElementById('container')
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen()
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen()
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen()
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  const switchCamera = async () => {
    try {
      const devices = await session.getDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        )

        if (newVideoDevice.length > 0) {
          const newPublisher = session.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            mirror: true,
          })

          await session.unpublish(localUser.getStreamManager())
          await session.publish(newPublisher)
          localUser.setStreamManager(newPublisher)
          setLocalUserState(localUser)
          setCurrentVideoDevice(newVideoDevice[0])
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const screenShare = () => {
    const videoSource =
      navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen'
    const publisher = session.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
          setShowExtensionDialog(true)
        } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
          alert('Your browser does not support screen sharing')
        } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
          alert('You need to enable screen sharing extension')
        } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
          alert('You need to choose a window or application to share')
        }
      }
    )

    publisher.once('accessAllowed', () => {
      session.unpublish(localUser.getStreamManager())
      localUser.setStreamManager(publisher)
      session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true)
        setLocalUserState(localUser)
        sendSignalUserChanged({
          isScreenShareActive: localUser.isScreenShareActive(),
        })
      })
    })
    publisher.on('streamPlaying', () => {
      updateLayout()
      publisher.videos[0].video.parentElement.classList.remove('custom-class')
    })
  }

  const stopScreenShare = () => {
    session.unpublish(localUser.getStreamManager())
    connectWebCam()
  }

  const toggleChat = (property) => {
    let display = property || (chatDisplay === 'none' ? 'block' : 'none')
    setChatDisplay(display)
    setMessageReceived(display === 'none')
    updateLayout()
  }

  const checkSomeoneShareScreen = () => {
    const isScreenShared =
      subscribers.some((user) => user.isScreenShareActive()) ||
      localUser.isScreenShareActive()
    const openviduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: 'OV_big',
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    }
    layout.setLayoutOptions(openviduLayoutOptions)
    updateLayout()
  }

  const updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout()
    }, 20)
  }

  const checkSize = () => {
    if (
      document.getElementById('layout').offsetWidth <= 700 &&
      !layout.hasBeenUpdated
    ) {
      toggleChat('none')
      layout.hasBeenUpdated = true
    }
    if (
      document.getElementById('layout').offsetWidth > 700 &&
      layout.hasBeenUpdated
    ) {
      layout.hasBeenUpdated = false
    }
  }

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

    window.addEventListener('beforeunload', leaveSession)
    window.addEventListener('resize', updateLayout)
    window.addEventListener('resize', checkSize)

    joinSession()

    return () => {
      window.removeEventListener('beforeunload', leaveSession)
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('resize', checkSize)
      leaveSession()
    }
  }, [joinSession])

  return (
    <div className="container" id="container">
      <ToolbarComponent
        sessionId={mySessionId}
        user={localUserState}
        showNotification={messageReceived}
        camStatusChanged={camStatusChanged}
        micStatusChanged={micStatusChanged}
        screenShare={screenShare}
        stopScreenShare={stopScreenShare}
        toggleFullscreen={toggleFullscreen}
        switchCamera={switchCamera}
        leaveSession={leaveSession}
        toggleChat={toggleChat}
      />

      <DialogExtensionComponent
        showDialog={showExtensionDialog}
        cancelClicked={() => setShowExtensionDialog(false)}
      />

      <div id="layout" className="bounds">
        {localUserState && localUserState.getStreamManager() && (
          <div className="OT_root OT_publisher custom-class" id="localUser">
            <StreamComponent
              user={localUserState}
              handleNickname={nicknameChanged}
            />
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
              streamId={sub.getStreamManager().stream.streamId}
            />
          </div>
        ))}
        {localUserState && localUserState.getStreamManager() && (
          <div
            className="OT_root OT_publisher custom-class"
            style={{ display: chatDisplay }}
          >
            <ChatComponent
              user={localUserState}
              chatDisplay={chatDisplay}
              close={toggleChat}
              messageReceived={setMessageReceived}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoRoomComponent
