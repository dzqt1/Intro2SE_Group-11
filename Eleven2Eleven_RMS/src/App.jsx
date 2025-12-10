import { useState } from 'react'
import DemoPage from './pages/DemoPage'
import UserManagement from './pages/UserManagement'
import Side_Navbar from '@/components/custom/Side_Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Order'
import Login from './pages/Login'
import Kitchen from "./pages/Kitchen"
import { OrderProvider } from './contexts/OrderContext';
import { TableProvider } from './contexts/TableContext'; 
import TableInfo from './pages/TableInfo'; 
import TableReservation from './pages/TableReservation'; 

function App() {
  return (
    <>
    <div className="flex flex-row h-screen">
      <Side_Navbar />
      <OrderProvider>
        {/* Bọc TableProvider ở đây để cả 2 trang đều nhận được dữ liệu */}
        <TableProvider> 
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/kitchen" element={<Kitchen />} />
              
              {/* Route cho trang điền form */}
              <Route path="/reservation" element={<TableReservation />} />
              
              {/* Route cho trang xem danh sách */}
              <Route path="/table-info" element={<TableInfo />} />
            </Routes>
        </TableProvider>
      </OrderProvider>
    </div>
    </>
  )
}
export default App
