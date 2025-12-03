import { useState } from 'react'
import DemoPage from './pages/DemoPage'
import Test from './pages/tobedev'
import Side_Navbar from '@/components/custom/Side_Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <div className="flex flex-row h-screen">
      <Side_Navbar />
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Test />} />
      </Routes>
    </div>
    </>
  )
}

export default App
