import { Link, useLocation, useParams } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import Fact from '../components/Fact'
import JoinPanel from '../components/JoinPanel'
import { formatDate, formatDuration } from '../utils/format'

export default function GroupHikeDetail() {
  const { hikeId } = useParams()
  const { hikes, joinedIds, joinHike, leaveHike, canEdit } = useHikes()
  // Set by the Organize/Edit form after saving: 'created' or 'updated'
  const saved = useLocation().state?.saved
  const hike = hikes.find((item) => item.id === hikeId)
  const trail = hike && trails.find((item) => item.id === hike.trailId)

  if (!hike || !trail) {
    return (
      <section className="py-20">
        <h1 className="display-lg">Group hike not found</h1>
        <p className="prose-measure mt-3 opacity-80">
          This hike doesn’t exist, or it may have been cancelled.
        </p>
        <Link to="/trails" className="btn btn-primary mt-7">
          Browse trails
        </Link>
      </section>
    )
  }

  return (
    <article className="pt-8">
      <Link
        to={`/trails/${trail.id}`}
        className="label-map hover:text-brand hover:underline hover:underline-offset-4 dark:hover:text-ember"
      >
        ← Back to {trail.name}
      </Link>

      {saved && (
        <p role="status" className="mt-4 border-l-2 border-olive bg-olive/10 px-4 py-3 text-sm font-semibold dark:border-limestone">
          {saved === 'created' ? 'Your hike is published. Share this page so people can join.' : 'Your changes are saved.'}
        </p>
      )}

      <header className="mt-5 grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12">
        <div className="photo aspect-[4/3] w-full md:order-2">
          <img src={trail.cover.src} alt={trail.cover.alt} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="tabular label-map">{formatDate(hike.date, { weekday: true })}</p>
          <h1 className="display-lg mt-1.5">{hike.title}</h1>
          <p className="prose-measure mt-4 text-lg opacity-85">
            A group hike on the{' '}
            <Link
              to={`/trails/${trail.id}`}
              className="font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
            >
              {trail.name}
            </Link>{' '}
            trail, led by {hike.guide}.
          </p>
        </div>
      </header>

      <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_19rem] md:items-start">
        <div>
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="display-md">
              About this hike
            </h2>
            <p className="prose-measure mt-3 opacity-85">{hike.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/15 pt-5 sm:grid-cols-3 dark:border-stone/20">
              <Fact label="Starts at" value={hike.startTime} />
              <Fact label="Duration" value={formatDuration(hike.durationHours)} />
              <Fact label="Guide" value={hike.guide} />
              <Fact label="Meeting point" value={hike.meetingPoint} />
              <Fact label="Difficulty" value={trail.difficulty} />
              <Fact label="Distance" value={`${trail.distanceKm} km`} />
            </dl>
          </section>

          <section aria-labelledby="bring-heading" className="mt-10">
            <h2 id="bring-heading" className="display-md">
              What to bring
            </h2>
            <ul className="mt-4 space-y-2">
              {hike.whatToBring.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-current opacity-40" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Only the hike's organizer sees the edit link */}
          {canEdit(hike) && (
            <p className="label-map mt-10">
              You organized this hike.{' '}
              <Link
                to={`/group-hikes/${hike.id}/edit`}
                className="font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
              >
                Edit hike details
              </Link>
            </p>
          )}
        </div>

        <JoinPanel
          hike={hike}
          isJoined={joinedIds.includes(hike.id)}
          onJoin={() => joinHike(hike.id)}
          onLeave={() => leaveHike(hike.id)}
        />
      </div>
    </article>
  )
}
