import { useState } from 'react'
import UserManagement from './pages/UserManagement'
import Side_Navbar from '@/components/custom/Side_Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Order'
import Login from './pages/Login'
import MenuManagement from './pages/MenuManagement'
import Kitchen from "./pages/Kitchen"
import { OrderProvider } from './contexts/OrderContext';
import IngredientManagement from './pages/IngredientManagement'
// Đã xóa import TableProvider ở đây vì không dùng nữa
import TableReservation from './pages/TableReservation'
import TableInfo from './pages/TableInfo'
import { AuthProvider } from './contexts/AuthContext'
import RequireAuth from './components/auth/RequireAuth'

// Import trang Thanh toán & Dashboard mới
import PaymentDashboard from './pages/PaymentDashboard'

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        {/* Đã xóa thẻ <TableProvider> bọc ngoài */}
        
        <div className="flex flex-row h-screen">
          <Side_Navbar />
          <div className="flex-1 overflow-y-scroll">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
              <Route path="/users" element={<RequireAuth><UserManagement /></RequireAuth>} />
              <Route path="/menu" element={<RequireAuth><MenuManagement /></RequireAuth>} />
              <Route path="/ingredients" element={<RequireAuth><IngredientManagement /></RequireAuth>} />
              <Route path="/kitchen" element={<RequireAuth><Kitchen /></RequireAuth>} />
              
              {/* Route cho trang điền form */}
              <Route path="/reservation" element={<RequireAuth><TableReservation /></RequireAuth>} />

              {/* Route cho trang xem danh sách */}
              <Route path="/table-info" element={<RequireAuth><TableInfo /></RequireAuth>} />

              {/* Route mới cho chức năng Thanh toán và Báo cáo doanh thu */}
              <Route path="/payment" element={<RequireAuth><PaymentDashboard /></RequireAuth>} />
              
            </Routes>
          </div>
        </div>

      </OrderProvider>
    </AuthProvider>
  )
}

export default App