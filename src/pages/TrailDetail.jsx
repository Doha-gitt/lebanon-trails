import { Link, useParams } from 'react-router-dom'
import { groupHikes, trails } from '../data/mockData'
import PhotoGallery from '../components/PhotoGallery'

// '2026-12-05' -> '5 December 2026'
function formatDate(date) {
  return new Date(`${date}T00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-sm opacity-75">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  )
}

export default function TrailDetail() {
  const { trailId } = useParams()
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

  const upcoming = groupHikes.filter((hike) => hike.trailId === trail.id)

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
            {upcoming.map((hike) => (
              <li key={hike.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{formatDate(hike.date)}</p>
                  <p className="text-sm">
                    {hike.spotsTotal - hike.spotsTaken} of {hike.spotsTotal} spots left
                  </p>
                </div>
                <Link
                  to={`/group-hikes/${hike.id}`}
                  className="rounded bg-brand px-4 py-2 font-semibold text-paper hover:opacity-90"
                >
                  View hike
                </Link>
              </li>
            ))}
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
