import { useState } from 'react'
import { groupHikes } from '../data/mockData'
import { HikesContext } from './HikesContext'
import { useAuth } from './AuthContext'

// Holds the group hikes in React state so every page sees the same, up-to-date list.
// Changes last until the browser is refreshed (there is no backend yet).
export function HikesProvider({ children }) {
  const [hikes, setHikes] = useState(groupHikes)
  // Hikes each user has joined, by user id: { 'user-1': ['hike-3'], ... }
  const [joinedByUser, setJoinedByUser] = useState({})
  const { currentUser } = useAuth()

  // Hikes the logged-in user has joined (empty when nobody is logged in)
  const joinedIds = (currentUser && joinedByUser[currentUser.id]) || []

  // Only the person who organized a hike may edit it
  function canEdit(hike) {
    return Boolean(currentUser && hike && hike.organizerId === currentUser.id)
  }

  function changeSpotsTaken(id, change) {
    setHikes((current) =>
      current.map((hike) => (hike.id === id ? { ...hike, spotsTaken: hike.spotsTaken + change } : hike)),
    )
  }

  function setJoinedIds(ids) {
    setJoinedByUser((current) => ({ ...current, [currentUser.id]: ids }))
  }

  function joinHike(id) {
    const hike = hikes.find((item) => item.id === id)
    if (!currentUser || !hike || joinedIds.includes(id) || hike.spotsTaken >= hike.spotsTotal) return
    changeSpotsTaken(id, 1)
    setJoinedIds([...joinedIds, id])
  }

  function leaveHike(id) {
    if (!currentUser || !joinedIds.includes(id)) return
    changeSpotsTaken(id, -1)
    setJoinedIds(joinedIds.filter((joinedId) => joinedId !== id))
  }

  // For the Organize/Edit Hike form. addHike returns the new hike's id.
  // The logged-in user is saved as the hike's organizer.
  function addHike(newHike) {
    if (!currentUser) return null
    const id = `hike-${Date.now()}`
    setHikes((current) => [...current, { ...newHike, id, organizerId: currentUser.id, spotsTaken: 0 }])
    return id
  }

  function updateHike(id, changes) {
    if (!canEdit(hikes.find((hike) => hike.id === id))) return
    // The organizer and spots taken can't be changed through the form
    // eslint-disable-next-line no-unused-vars
    const { organizerId, spotsTaken, ...allowed } = changes
    setHikes((current) => current.map((hike) => (hike.id === id ? { ...hike, ...allowed } : hike)))
  }

  return (
    <HikesContext.Provider value={{ hikes, joinedIds, joinHike, leaveHike, addHike, updateHike, canEdit }}>
      {children}
    </HikesContext.Provider>
  )
}
