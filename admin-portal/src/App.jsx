import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/HomePage'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/login" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}

export default App
