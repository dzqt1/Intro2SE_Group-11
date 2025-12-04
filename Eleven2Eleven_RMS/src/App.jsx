import { useState } from 'react'
import DemoPage from './pages/DemoPage'
import UserManagement from './pages/UserManagement'
import Side_Navbar from '@/components/custom/Side_Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Order'
function App() {
  return (
    <>
    <div className="flex flex-row h-screen">
      <Side_Navbar />
      <Routes>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/user_management" element={<UserManagement />} />
      </Routes>
    </div>
    </>
  )
}

export default App
