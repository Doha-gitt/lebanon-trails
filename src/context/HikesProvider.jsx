import { useState } from 'react'
import { groupHikes } from '../data/mockData'
import { HikesContext } from './HikesContext'
import { useAuth } from './AuthContext'

// Holds the group hikes in React state so every page sees the same, up-to-date list.
// Changes last until the browser is refreshed (there is no backend yet).
export function HikesProvider({ children }) {
  const [hikes, setHikes] = useState(groupHikes)
  const [joinedIds, setJoinedIds] = useState([]) // hikes the current visitor has joined
  const { currentUser } = useAuth()

  function changeSpotsTaken(id, change) {
    setHikes((current) =>
      current.map((hike) => (hike.id === id ? { ...hike, spotsTaken: hike.spotsTaken + change } : hike)),
    )
  }

  function joinHike(id) {
    const hike = hikes.find((item) => item.id === id)
    if (!currentUser || !hike || joinedIds.includes(id) || hike.spotsTaken >= hike.spotsTotal) return
    changeSpotsTaken(id, 1)
    setJoinedIds((current) => [...current, id])
  }

  function leaveHike(id) {
    if (!joinedIds.includes(id)) return
    changeSpotsTaken(id, -1)
    setJoinedIds((current) => current.filter((joinedId) => joinedId !== id))
  }

  // For the Organize/Edit Hike form. addHike returns the new hike's id.
  function addHike(newHike) {
    if (!currentUser) return null
    const id = `hike-${Date.now()}`
    setHikes((current) => [...current, { ...newHike, id, spotsTaken: 0 }])
    return id
  }

  function updateHike(id, changes) {
    if (!currentUser) return
    setHikes((current) => current.map((hike) => (hike.id === id ? { ...hike, ...changes } : hike)))
  }

  return (
    <HikesContext.Provider value={{ hikes, joinedIds, joinHike, leaveHike, addHike, updateHike }}>
      {children}
    </HikesContext.Provider>
  )
}
