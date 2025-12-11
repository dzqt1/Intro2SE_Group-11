import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function isAllowed(roleName, pathname) {
  if (!roleName) return false
  const rn = roleName.toLowerCase()
  // Admin: full access
  if (rn === 'admin') return true
  // Manager: everything except user management
  if (rn === 'manager') {
    if (pathname === '/users') return false
    return true
  }
  // Kitchen staff: only order statement (orders) and ingredient management
  if (rn.includes('kitchen')) {
    return ['/orders', '/ingredients', '/kitchen'].includes(pathname)
  }
  // Staff / Waiter: only orders, reservation, table info
  if (rn === 'staff' || rn === 'waiter') {
    return ['/orders', '/reservation', '/table-info'].includes(pathname)
  }
  // default deny
  return false
}

export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  const roleName = user.roleName || user.role || ''
  if (!isAllowed(roleName, location.pathname)) {
    return <div className="p-8">You are not authorized to view this page.</div>
  }
  return children
}
