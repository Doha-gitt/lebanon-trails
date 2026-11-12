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
      <section className="py-10">
        <h1 className="text-3xl font-bold">Group hike not found</h1>
        <p className="mt-2">This hike doesn't exist or may have been cancelled.</p>
        <Link to="/trails" className="mt-4 inline-block underline underline-offset-4">
          Browse trails to find another hike
        </Link>
      </section>
    )
  }

  return (
    <article className="pb-12">
      <Link to={`/trails/${trail.id}`} className="text-sm underline underline-offset-4">
        Back to {trail.name}
      </Link>

      {saved && (
        <p role="status" className="mt-4 rounded border border-olive/40 bg-olive/10 px-4 py-3 font-semibold">
          {saved === 'created' ? 'Your hike is published. Share this page so people can join.' : 'Your changes are saved.'}
        </p>
      )}

      <header className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-10">
        <img
          src={trail.cover.src}
          alt={trail.cover.alt}
          className="aspect-[4/3] w-full rounded-lg object-cover md:order-2"
        />
        <div>
          <p className="text-lg font-semibold">{formatDate(hike.date, { weekday: true })}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight lg:text-5xl">{hike.title}</h1>
          <p className="mt-3 text-lg">
            A group hike on the{' '}
            <Link to={`/trails/${trail.id}`} className="underline underline-offset-4">
              {trail.name}
            </Link>{' '}
            trail, led by {hike.guide}.
          </p>
        </div>
      </header>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
        <div>
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-semibold">
              About this hike
            </h2>
            <p className="mt-2 max-w-prose">{hike.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-ink/15 py-5 sm:grid-cols-3 dark:border-stone/20">
              <Fact label="Starts at" value={hike.startTime} />
              <Fact label="Duration" value={formatDuration(hike.durationHours)} />
              <Fact label="Guide" value={hike.guide} />
              <Fact label="Meeting point" value={hike.meetingPoint} />
              <Fact label="Difficulty" value={trail.difficulty} />
              <Fact label="Distance" value={`${trail.distanceKm} km`} />
            </dl>
          </section>

          <section aria-labelledby="bring-heading" className="mt-10">
            <h2 id="bring-heading" className="text-2xl font-semibold">
              What to bring
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {hike.whatToBring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Only the hike's organizer sees the edit link */}
          {canEdit(hike) && (
            <p className="mt-10 text-sm">
              You organized this hike.{' '}
              <Link to={`/group-hikes/${hike.id}/edit`} className="underline underline-offset-4">
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
