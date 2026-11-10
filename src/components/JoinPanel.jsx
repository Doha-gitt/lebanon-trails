import { spotsLeftText } from '../utils/format'

// Shows how full a hike is and lets the visitor join or leave it.
export default function JoinPanel({ hike, isJoined, onJoin, onLeave }) {
  const spotsLeft = hike.spotsTotal - hike.spotsTaken
  const isFull = spotsLeft <= 0
  const percentTaken = Math.round((hike.spotsTaken / hike.spotsTotal) * 100)

  return (
    <aside
      aria-labelledby="spots-heading"
      className="order-first rounded-lg border border-ink/15 p-5 md:sticky md:top-6 md:order-none dark:border-stone/20"
    >
      <h2 id="spots-heading" className="text-xl font-semibold">
        {isFull ? 'This hike is full' : spotsLeftText(spotsLeft)}
      </h2>
      <p className="mt-1 text-sm">
        {hike.spotsTaken} of {hike.spotsTotal} spots taken
      </p>
      <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-ink/15 dark:bg-stone/20">
        <div className="h-full rounded-full bg-olive" style={{ width: `${percentTaken}%` }} />
      </div>

      <div aria-live="polite" className="mt-5">
        {isJoined ? (
          <>
            <p className="font-semibold">You're going.</p>
            <p className="mt-1 text-sm">
              Meet at {hike.meetingPoint} at {hike.startTime}.
            </p>
            <button
              type="button"
              onClick={onLeave}
              className="mt-4 w-full rounded border border-brand px-4 py-2 font-semibold text-brand hover:bg-brand hover:text-paper dark:border-stone dark:text-stone dark:hover:bg-stone dark:hover:text-earth"
            >
              Leave hike
            </button>
          </>
        ) : isFull ? (
          <p className="text-sm">All spots are taken. Check the trail page for other dates.</p>
        ) : (
          <button
            type="button"
            onClick={onJoin}
            className="w-full rounded bg-brand px-4 py-2 font-semibold text-paper hover:opacity-90"
          >
            Join this hike
          </button>
        )}
      </div>
    </aside>
  )
}
