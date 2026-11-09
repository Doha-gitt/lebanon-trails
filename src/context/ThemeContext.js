import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

// In any component: const { isDark, toggleTheme } = useTheme()
export function useTheme() {
  return useContext(ThemeContext)
}
