import { useState } from 'react'
import { users as mockUsers } from '../data/mockData'
import { AuthContext } from './AuthContext'

const sameEmail = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Keeps the user accounts and the logged-in user in React state.
// Like the hikes, everything resets when the browser is refreshed.
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(mockUsers)
  const [currentUser, setCurrentUser] = useState(null)

  // Returns true when the email and password match an account.
  function login(email, password) {
    const user = users.find((item) => sameEmail(item.email, email) && item.password === password)
    if (!user) return false
    setCurrentUser(user)
    return true
  }

  function logout() {
    setCurrentUser(null)
  }

  // Returns false when an account with this email already exists.
  function register({ name, email, password }) {
    if (users.some((item) => sameEmail(item.email, email))) return false
    setUsers((current) => [...current, { id: `user-${Date.now()}`, name: name.trim(), email: email.trim(), password }])
    return true
  }

  return <AuthContext.Provider value={{ currentUser, login, logout, register }}>{children}</AuthContext.Provider>
}
