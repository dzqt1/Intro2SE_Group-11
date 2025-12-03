import { useState } from 'react'
import DemoPage from './pages/DemoPage'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<div className="p-4">Welcome to Eleven2Eleven RMS!</div>} />
      </Routes>
    </>
  )
}

export default App
