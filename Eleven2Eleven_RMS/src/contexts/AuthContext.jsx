import React, { createContext, useContext, useState, useEffect } from 'react'
import { getRoles, getUserByUsername } from '@/data_access/api'
import { hashPassword } from '@/lib/utils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [rolesMap, setRolesMap] = useState({})
  const [persist, setPersist] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('authUser')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch (e) { /* ignore */ }
      setPersist(true)
    }
    ;(async () => {
      try {
        const rs = await getRoles()
        if (Array.isArray(rs)) {
          const map = {}
          rs.forEach(r => { map[String(r.id)] = r.name || String(r.id) })
          setRolesMap(map)
        }
      } catch (err) {
        console.error('Failed to load roles in auth', err)
      }
    })()
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    if (user && persist) localStorage.setItem('authUser', JSON.stringify(user))
    else if (!user) localStorage.removeItem('authUser')
  }, [user, persist, initialized])

  async function login(username, password, remember = false) {
    const u = await getUserByUsername(username)
    if (!u) throw new Error('User not found')
    // require hashed_password to exist and compare
    if (!u.hashed_password) throw new Error('No password set for user')
    const hashed = await hashPassword(password)
    if (hashed !== u.hashed_password) throw new Error('Invalid credentials')
    // determine role name
    const roleName = u.role && rolesMap[String(u.role)] ? rolesMap[String(u.role)] : (u.role || '')
    const authUser = { id: u.id, username: u.name, full_name: u.full_name, role: u.role, roleName }
    setPersist(!!remember)
    setUser(authUser)
    // if remember requested, persist immediately
    if (remember) localStorage.setItem('authUser', JSON.stringify(authUser))
    return authUser
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, rolesMap }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
