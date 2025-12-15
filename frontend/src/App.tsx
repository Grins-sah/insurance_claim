import React from 'react'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import CustomerPage from './pages/CustomerPage'
import AuthorityPage from './pages/AuthorityPage'



const App = () => {
  return (
    <div>
      <Routes>

        <Route path='/' element ={<LandingPage/>}></Route>
        <Route path='/:par' element ={<AuthPage/>}></Route>
        <Route path='/customer' element ={<CustomerPage/>}></Route>
        <Route path='/authority' element ={<AuthorityPage/>}></Route>
        
      </Routes>
      
      
    </div>
  )
}

export default App