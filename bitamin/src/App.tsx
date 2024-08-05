import React from 'react'
// import { useLocation } from 'react-router-dom'
import AppRouter from 'router/AppRouter'
import HeaderBeforeLogin from 'stories/organisms/common/HeaderBeforeLogin'
import HeaderAfterLogin from 'stories/organisms/common/HeaderAfterLogin'
import Footer from 'stories/organisms/common/Footer'

const App: React.FC = () => {
  // const location = useLocation()
  // const excludeFooterPaths = ['/no-footer'] // Footer를 제외할 경로들

  return (
    <React.Fragment>
      {/* <HeaderBeforeLogin /> */}
      {/* <HeaderAfterLogin /> */}
      <AppRouter />
      {/* {!excludeFooterPaths.includes(location.pathname) && <Footer />} */}
      <Footer />
    </React.Fragment>
  )
}

export default App
