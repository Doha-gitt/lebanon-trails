import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// In any component: const { currentUser, login, logout, register } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
