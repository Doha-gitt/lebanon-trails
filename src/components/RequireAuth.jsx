import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps pages that need an account (organizing or editing a hike).
// Visitors who aren't logged in are sent to the Login page, which brings
// them back here after they log in.
export default function RequireAuth({ children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}
