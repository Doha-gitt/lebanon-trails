import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { spotsLeftText } from '../utils/format'

// Shows how full a hike is and lets a logged-in visitor join or leave it.
export default function JoinPanel({ hike, isJoined, onJoin, onLeave }) {
  const { currentUser } = useAuth()
  const { pathname } = useLocation()
  const spotsLeft = hike.spotsTotal - hike.spotsTaken
  const isFull = spotsLeft <= 0
  const percentTaken = Math.round((hike.spotsTaken / hike.spotsTotal) * 100)

  return (
    <aside
      aria-labelledby="spots-heading"
      className="surface order-first p-5 md:sticky md:top-24 md:order-none"
    >
      <h2 id="spots-heading" className="display-md text-xl">
        {isFull ? 'This hike is full' : spotsLeftText(spotsLeft)}
      </h2>
      <p className="tabular label-map mt-1">
        {hike.spotsTaken} of {hike.spotsTotal} spots taken
      </p>
      <div
        aria-hidden="true"
        className="mt-3 h-1 overflow-hidden rounded-full bg-ink/15 dark:bg-stone/20"
      >
        <div className="h-full rounded-full bg-olive dark:bg-limestone" style={{ width: `${percentTaken}%` }} />
      </div>

      <div aria-live="polite" className="mt-5">
        {isJoined ? (
          <>
            <p className="font-semibold">You’re going.</p>
            <p className="label-map mt-1">
              Meet at {hike.meetingPoint} at {hike.startTime}.
            </p>
            <button type="button" onClick={onLeave} className="btn btn-outline mt-4 w-full">
              Leave hike
            </button>
          </>
        ) : isFull ? (
          <p className="label-map">All spots are taken. Check the trail page for other dates.</p>
        ) : !currentUser ? (
          <Link
            to="/login"
            state={{ from: pathname }}
            className="btn btn-primary w-full"
          >
            Log in to join
          </Link>
        ) : (
          <button type="button" onClick={onJoin} className="btn btn-primary w-full">
            Join this hike
          </button>
        )}
      </div>
    </aside>
  )
}
