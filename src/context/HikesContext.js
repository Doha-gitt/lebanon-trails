import { createContext, useContext } from 'react'

export const HikesContext = createContext(null)

// In any component:
// const { hikes, joinedIds, joinHike, leaveHike, addHike, updateHike } = useHikes()
export function useHikes() {
  return useContext(HikesContext)
}
