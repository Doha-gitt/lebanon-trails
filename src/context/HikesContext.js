import { createContext, useContext } from 'react'

export const HikesContext = createContext(null)

// In any component:
// const { hikes, joinedIds, joinHike, leaveHike, addHike, updateHike, canEdit } = useHikes()
// canEdit(hike) is true only for the logged-in user who organized that hike.
export function useHikes() {
  return useContext(HikesContext)
}
