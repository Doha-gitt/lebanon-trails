import { Link, useParams } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import Fact from '../components/Fact'
import PhotoGallery from '../components/PhotoGallery'
import { formatDate, spotsLeftText } from '../utils/format'

export default function TrailDetail() {
  const { trailId } = useParams()
  const { hikes } = useHikes()
  const trail = trails.find((item) => item.id === trailId)

  if (!trail) {
    return (
      <section className="py-10">
        <h1 className="text-3xl font-bold">Trail not found</h1>
        <p className="mt-2">This trail doesn't exist or may have been removed.</p>
        <Link to="/trails" className="mt-4 inline-block underline underline-offset-4">
          Browse all trails
        </Link>
      </section>
    )
  }

  // Dates are 'YYYY-MM-DD', so sorting them as text puts them in date order.
  const upcoming = hikes
    .filter((hike) => hike.trailId === trail.id)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <article className="pb-12">
      <Link to="/trails" className="text-sm underline underline-offset-4">
        All trails
      </Link>

      {/* Photo beside the name on wider screens, so it is never stretched past its real size. */}
      <header className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-10">
        <img
          src={trail.cover.src}
          alt={trail.cover.alt}
          className="aspect-[4/3] w-full rounded-lg object-cover md:order-2"
        />
        <div>
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">{trail.name}</h1>
          <p className="mt-3 max-w-prose text-lg">{trail.description}</p>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-ink/15 py-4 dark:border-stone/20">
            <Fact label="Region" value={trail.region} />
            <Fact label="Difficulty" value={trail.difficulty} />
            <Fact label="Distance" value={`${trail.distanceKm} km`} />
          </dl>
        </div>
      </header>

      <section aria-labelledby="hikes-heading" className="mt-12">
        <h2 id="hikes-heading" className="text-2xl font-semibold">
          Upcoming group hikes
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-2">
            No group hikes planned here yet.{' '}
            <Link to="/group-hikes/new" className="underline underline-offset-4">
              Organize one
            </Link>
          </p>
        ) : (
          <ul className="mt-3 max-w-2xl divide-y divide-ink/15 dark:divide-stone/20">
            {upcoming.map((hike) => {
              const spotsLeft = hike.spotsTotal - hike.spotsTaken
              return (
                <li key={hike.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{hike.title}</p>
                    <p className="text-sm">
                      {formatDate(hike.date)}, {spotsLeft > 0 ? spotsLeftText(spotsLeft) : 'full'}
                    </p>
                  </div>
                  <Link
                    to={`/group-hikes/${hike.id}`}
                    className="rounded bg-brand px-4 py-2 font-semibold text-paper hover:opacity-90"
                  >
                    View hike
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="photos-heading" className="mt-12">
        <h2 id="photos-heading" className="text-2xl font-semibold">
          Photos from past hikes
        </h2>
        <div className="mt-4">
          <PhotoGallery photos={trail.photos} />
        </div>
      </section>
    </article>
  )
}
