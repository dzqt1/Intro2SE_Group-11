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
    console.debug('[Auth] init: reading localStorage authUser')
    const raw = localStorage.getItem('authUser')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        console.debug('[Auth] init: found stored authUser', parsed)
        setUser(parsed)
      } catch (e) { console.warn('[Auth] init: failed to parse stored authUser', e) }
      setPersist(true)
    } else {
      console.debug('[Auth] init: no stored authUser')
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
    console.debug('[Auth] init: roles loaded, initialized=true')
  }, [])

  useEffect(() => {
    if (!initialized) {
      console.debug('[Auth] storageEffect: waiting for initialization')
      return
    }
    console.debug('[Auth] storageEffect:', { user, persist })
    if (user && persist) {
      localStorage.setItem('authUser', JSON.stringify(user))
      console.debug('[Auth] storageEffect: stored authUser')
    } else if (!user) {
      localStorage.removeItem('authUser')
      console.debug('[Auth] storageEffect: removed authUser')
    }
  }, [user, persist, initialized])

  async function login(username, password, remember = false) {
    console.debug('[Auth] login attempt for', username, { remember })
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
    if (remember) {
      localStorage.setItem('authUser', JSON.stringify(authUser))
      console.debug('[Auth] login: persisted authUser immediately')
    }
    return authUser
  }

  function logout() {
    console.debug('[Auth] logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, rolesMap, initialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
