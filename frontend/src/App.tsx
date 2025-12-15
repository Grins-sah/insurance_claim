import React from 'react'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'



const App = () => {
  return (
    <div>
      <Routes>

        <Route path='/' element ={<LandingPage/>}></Route>
        <Route path='/:par' element ={<AuthPage/>}></Route>
      </Routes>
      
      
    </div>
  )
}

export default App