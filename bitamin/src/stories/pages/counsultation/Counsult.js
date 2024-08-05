// import { OpenVidu } from 'openvidu-browser'
// import axios from 'axios'
// import React, { Component } from 'react'
// import './App.css'
// import UserVideoComponent from './UserVideoComponent'

// // const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'https://demos.openvidu.io/';
// var APPLICATION_SERVER_URL = 'https://i11b105.p.ssafy.io:4443/#/'

// class Counsult extends Component {
//   constructor(props) {
//     super(props)

//     // 상태의 컴포넌트에 이 속성이 있어야 값이 변경될 때마다 HTML이 다시 렌더링됩니다.
//     this.state = {
//       mySessionId: 'SessionA',
//       myUserName: 'Participant' + Math.floor(Math.random() * 100),
//       session: undefined,
//       mainStreamManager: undefined, // 페이지의 메인 비디오. 'publisher' 또는 'subscribers' 중 하나가 될 것입니다.
//       publisher: undefined,
//       subscribers: [],
//     }

//     this.joinSession = this.joinSession.bind(this)
//     this.leaveSession = this.leaveSession.bind(this)
//     this.switchCamera = this.switchCamera.bind(this)
//     this.handleChangeSessionId = this.handleChangeSessionId.bind(this)
//     this.handleChangeUserName = this.handleChangeUserName.bind(this)
//     this.handleMainVideoStream = this.handleMainVideoStream.bind(this)
//     this.onbeforeunload = this.onbeforeunload.bind(this)
//   }

//   componentDidMount() {
//     window.addEventListener('beforeunload', this.onbeforeunload)
//   }

//   componentWillUnmount() {
//     window.removeEventListener('beforeunload', this.onbeforeunload)
//   }

//   onbeforeunload(event) {
//     this.leaveSession()
//   }

//   handleChangeSessionId(e) {
//     this.setState({
//       mySessionId: e.target.value,
//     })
//   }

//   handleChangeUserName(e) {
//     this.setState({
//       myUserName: e.target.value,
//     })
//   }

//   handleMainVideoStream(stream) {
//     if (this.state.mainStreamManager !== stream) {
//       this.setState({
//         mainStreamManager: stream,
//       })
//     }
//   }

//   deleteSubscriber(streamManager) {
//     let subscribers = this.state.subscribers
//     let index = subscribers.indexOf(streamManager, 0)
//     if (index > -1) {
//       subscribers.splice(index, 1)
//       this.setState({
//         subscribers: subscribers,
//       })
//     }
//   }

//   joinSession() {
//     // --- 1) OpenVidu 객체 가져오기 ---
//     this.OV = new OpenVidu()

//     // --- 2) 세션 초기화 ---
//     this.setState(
//       {
//         session: this.OV.initSession(),
//       },
//       () => {
//         var mySession = this.state.session

//         // --- 3) 세션에서 이벤트가 발생할 때의 동작 지정 ---

//         // 새로운 스트림이 수신될 때마다...
//         mySession.on('streamCreated', (event) => {
//           // 스트림을 구독하여 수신합니다. 두 번째 매개변수는 undefined이므로 OpenVidu는 자체적으로 HTML 비디오를 생성하지 않습니다.
//           var subscriber = mySession.subscribe(event.stream, undefined)
//           var subscribers = this.state.subscribers
//           subscribers.push(subscriber)

//           // 새로운 구독자로 상태 업데이트
//           this.setState({
//             subscribers: subscribers,
//           })
//         })

//         // 스트림이 파괴될 때마다...
//         mySession.on('streamDestroyed', (event) => {
//           // 'subscribers' 배열에서 스트림 제거
//           this.deleteSubscriber(event.stream.streamManager)
//         })

//         // 비동기 예외 발생 시...
//         mySession.on('exception', (exception) => {
//           console.warn(exception)
//         })

//         // ICE 연결 실패 시...
//         mySession.on('iceConnectionFailed', (event) => {
//           console.log('ICE 연결 실패:', event)
//         })

//         // --- 4) 유효한 사용자 토큰으로 세션에 연결 ---

//         // OpenVidu 배포에서 토큰 가져오기
//         this.getToken().then((token) => {
//           // 첫 번째 매개변수는 OpenVidu 배포에서 가져온 토큰입니다. 두 번째 매개변수는 'streamCreated' 이벤트에서 모든 사용자가 검색할 수 있으며 사용자의 별명으로 DOM에 추가됩니다.
//           mySession
//             .connect(token, { clientData: this.state.myUserName })
//             .then(async () => {
//               // --- 5) 자신의 카메라 스트림 가져오기 ---

//               // 타겟 엘리먼트가 정의되지 않은 퍼블리셔를 초기화하고 원하는 속성으로 초기화합니다.
//               let publisher = await this.OV.initPublisherAsync(undefined, {
//                 audioSource: undefined, // 오디오 소스. 기본 마이크가 정의되지 않은 경우
//                 videoSource: undefined, // 비디오 소스. 기본 웹캠이 정의되지 않은 경우
//                 publishAudio: true, // 오디오가 음소거되지 않은 상태로 게시할지 여부
//                 publishVideo: true, // 비디오가 활성화된 상태로 게시할지 여부
//                 resolution: '640x480', // 비디오 해상도
//                 frameRate: 30, // 비디오 프레임 속도
//                 insertMode: 'APPEND', // 비디오가 타겟 엘리먼트 'video-container'에 삽입되는 방식
//                 mirror: false, // 로컬 비디오를 미러링할지 여부
//               })

//               // --- 6) 자신의 스트림 게시 ---
//               mySession.publish(publisher)

//               // 사용 중인 현재 비디오 장치 가져오기
//               var devices = await this.OV.getDevices()
//               var videoDevices = devices.filter(
//                 (device) => device.kind === 'videoinput'
//               )
//               var currentVideoDeviceId = publisher.stream
//                 .getMediaStream()
//                 .getVideoTracks()[0]
//                 .getSettings().deviceId
//               var currentVideoDevice = videoDevices.find(
//                 (device) => device.deviceId === currentVideoDeviceId
//               )

//               // 메인 비디오를 웹캠으로 설정하고 퍼블리셔 저장
//               this.setState({
//                 currentVideoDevice: currentVideoDevice,
//                 mainStreamManager: publisher,
//                 publisher: publisher,
//               })
//             })
//             .catch((error) => {
//               console.log(
//                 '세션에 연결하는 동안 오류가 발생했습니다:',
//                 error.code,
//                 error.message
//               )
//             })
//         })
//       }
//     )
//   }

//   leaveSession() {
//     // --- 7) Session 객체의 'disconnect' 메서드를 호출하여 세션 떠나기 ---

//     const mySession = this.state.session

//     if (mySession) {
//       mySession.disconnect()
//     }

//     // 모든 속성 비우기...
//     this.OV = null
//     this.setState({
//       session: undefined,
//       subscribers: [],
//       mySessionId: 'SessionA',
//       myUserName: 'Participant' + Math.floor(Math.random() * 100),
//       mainStreamManager: undefined,
//       publisher: undefined,
//     })
//   }

//   async switchCamera() {
//     try {
//       const devices = await this.OV.getDevices()
//       var videoDevices = devices.filter(
//         (device) => device.kind === 'videoinput'
//       )

//       if (videoDevices && videoDevices.length > 1) {
//         var newVideoDevice = videoDevices.filter(
//           (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
//         )

//         if (newVideoDevice.length > 0) {
//           // 특정 비디오 소스로 새로운 퍼블리셔 생성
//           // 모바일 장치에서는 기본 및 첫 번째 카메라가 전면 카메라입니다.
//           var newPublisher = this.OV.initPublisher(undefined, {
//             videoSource: newVideoDevice[0].deviceId,
//             publishAudio: true,
//             publishVideo: true,
//             mirror: true,
//           })

//           //newPublisher.once("accessAllowed", () => {
//           await this.state.session.unpublish(this.state.mainStreamManager)

//           await this.state.session.publish(newPublisher)
//           this.setState({
//             currentVideoDevice: newVideoDevice[0],
//             mainStreamManager: newPublisher,
//             publisher: newPublisher,
//           })
//         }
//       }
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   render() {
//     const mySessionId = this.state.mySessionId
//     const myUserName = this.state.myUserName

//     return (
//       <div className="container">
//         {this.state.session === undefined ? (
//           <div id="join">
//             <div id="img-div">
//               <img
//                 src="resources/images/openvidu_grey_bg_transp_cropped.png"
//                 alt="OpenVidu logo"
//               />
//             </div>
//             <div id="join-dialog" className="jumbotron vertical-center">
//               <h1> 화상 세션에 참가하기 </h1>
//               <form className="form-group" onSubmit={this.joinSession}>
//                 <p>
//                   <label>참가자: </label>
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="userName"
//                     value={myUserName}
//                     onChange={this.handleChangeUserName}
//                     required
//                   />
//                 </p>
//                 <p>
//                   <label> 세션: </label>
//                   <input
//                     className="form-control"
//                     type="text"
//                     id="sessionId"
//                     value={mySessionId}
//                     onChange={this.handleChangeSessionId}
//                     required
//                   />
//                 </p>
//                 <p className="text-center">
//                   <input
//                     className="btn btn-lg btn-success"
//                     name="commit"
//                     type="submit"
//                     value="JOIN"
//                   />
//                 </p>
//               </form>
//             </div>
//           </div>
//         ) : null}

//         {this.state.session !== undefined ? (
//           <div id="session">
//             <div id="session-header">
//               <h1 id="session-title">{mySessionId}</h1>
//               <input
//                 className="btn btn-large btn-danger"
//                 type="button"
//                 id="buttonLeaveSession"
//                 onClick={this.leaveSession}
//                 value="Leave session"
//               />
//               <input
//                 className="btn btn-large btn-success"
//                 type="button"
//                 id="buttonSwitchCamera"
//                 onClick={this.switchCamera}
//                 value="Switch Camera"
//               />
//             </div>

//             {this.state.mainStreamManager !== undefined ? (
//               <div id="main-video" className="col-md-6">
//                 <UserVideoComponent
//                   streamManager={this.state.mainStreamManager}
//                 />
//               </div>
//             ) : null}
//             <div id="video-container" className="col-md-6">
//               {this.state.publisher !== undefined ? (
//                 <div
//                   className="stream-container col-md-6 col-xs-6"
//                   onClick={() =>
//                     this.handleMainVideoStream(this.state.publisher)
//                   }
//                 >
//                   <UserVideoComponent streamManager={this.state.publisher} />
//                 </div>
//               ) : null}
//               {this.state.subscribers.map((sub, i) => (
//                 <div
//                   key={sub.id}
//                   className="stream-container col-md-6 col-xs-6"
//                   onClick={() => this.handleMainVideoStream(sub)}
//                 >
//                   <span>{sub.id}</span>
//                   <UserVideoComponent streamManager={sub} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     )
//   }

//   /**
//    * --------------------------------------------
//    * 애플리케이션 서버에서 토큰 가져오기
//    * --------------------------------------------
//    * 아래 메서드는 세션과 토큰 생성을 애플리케이션 서버에 요청합니다.
//    * 이를 통해 OpenVidu 배포를 안전하게 유지합니다.
//    *
//    * 이 샘플 코드에서는 사용자 제어가 전혀 없습니다. 누구든지 애플리케이션 서버 엔드포인트에 접근할 수 있습니다!
//    * 실제 운영 환경에서는 사용자 인증을 통해 엔드포인트 접근을 허용해야 합니다.
//    *
//    * OpenVidu를 애플리케이션 서버에 통합하는 방법에 대해 자세히 알아보려면
//    * https://docs.openvidu.io/en/stable/application-server를 방문하세요.
//    */
//   async getToken() {
//     const sessionId = await this.createSession(this.state.mySessionId)
//     return await this.createToken(sessionId)
//   }

//   async createSession(sessionId) {
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + 'api/sessions',
//       { customSessionId: sessionId },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     )
//     return response.data // 세션 ID
//   }

//   async createToken(sessionId) {
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
//       {},
//       {
//         headers: { 'Content-Type': 'application/json' },
//       }
//     )
//     return response.data // 토큰
//   }
// }

// export default Counsult
