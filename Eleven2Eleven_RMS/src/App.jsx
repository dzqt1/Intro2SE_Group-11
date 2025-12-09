import { useState } from 'react'
import DemoPage from './pages/DemoPage'
import UserManagement from './pages/UserManagement'
import Side_Navbar from '@/components/custom/Side_Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Order'
import Login from './pages/Login'
import MenuManagement from './pages/MenuManagement'
import Kitchen from "./pages/Kitchen"
import { OrderProvider } from './contexts/OrderContext';
function App() {
  return (
    <>
    <div className="flex flex-row h-screen">
      <Side_Navbar />
      <OrderProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/menu" element={<MenuManagement />} />
        </Routes>
      </OrderProvider>
    </div>
    </>
  )
}

export default App
