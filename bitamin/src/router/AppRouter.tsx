import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from 'stories/pages/main/MainPage'
import LoginPage from 'stories/pages/account/LoginPage'
import SignUpPage from 'stories/pages/account/SignUpPage'
import SurveyPage from 'stories/pages/account/SurveyPage'
import ConsultationListPage from 'stories/pages/counsultation/ConsultationListPage'
import ConsultationPage from 'stories/pages/counsultation/ConsultationPage'
// import CounsultPage from 'stories/pages/counsultation/CounsultPage'
// import Counsult from 'stories/pages/counsultation/Counsult.js'
import ConsultationSharingPage from 'stories/pages/counsultation/ConsultationSharingPage'
import HealthUpListPage from 'stories/pages/healthup/HealthUpListPage'
import HealthUpPage from 'stories/pages/healthup/HealthUpPage'
import MessageListPage from 'stories/pages/message/MessageListPage'
import ParticipantListPage from 'stories/pages/message/ParticipantListPage'
import ReplyPage from 'stories/pages/message/ReplyPage'
import AdiminPage from 'stories/pages/admin/AdiminPage'
import LandingPage from 'stories/pages/main/LandingPage'
import ExLogin from 'stories/pages/account/ExLogin'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/loginex" element={<ExLogin />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/counsultationlist" element={<ConsultationListPage />} />
        <Route path="/counsultation" element={<ConsultationPage />} />
        {/* <Route path="/counsult" element={<Counsult />} /> */}
        <Route
          path="/counsultationsharing"
          element={<ConsultationSharingPage />}
        />
        <Route path="/healthuplist" element={<HealthUpListPage />} />
        <Route path="/healthup" element={<HealthUpPage />} />
        <Route path="/messagelist" element={<MessageListPage />} />
        <Route path="/participantlist" element={<ParticipantListPage />} />
        <Route path="/reply" element={<ReplyPage />} />
        <Route path="/admin" element={<AdiminPage />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
