import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/HomePage'
import LoginPage from './pages/Login'
import AuthWrapper from './components/AuthWrapper'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin" element={<LoginPage/>} />
        <Route path="/home" element={
          <AuthWrapper>
            <Dashboard/>
          </AuthWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
