import { Link, useParams } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import PhotoGallery from '../components/PhotoGallery'
import Difficulty from '../components/Difficulty'
import { formatDate, spotsLeftText } from '../utils/format'

export default function TrailDetail() {
  const { trailId } = useParams()
  const { hikes } = useHikes()
  const trail = trails.find((item) => item.id === trailId)

  if (!trail) {
    return (
      <section className="py-20">
        <h1 className="display-lg">Trail not found</h1>
        <p className="prose-measure mt-3 opacity-80">
          This trail doesn’t exist, or it may have been removed.
        </p>
        <Link to="/trails" className="btn btn-primary mt-7">
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
    <article className="pt-8">
      <Link
        to="/trails"
        className="label-map hover:text-brand hover:underline hover:underline-offset-4 dark:hover:text-ember"
      >
        ← All trails
      </Link>

      {/* Photo beside the name on wider screens, so it is never stretched past its real size. */}
      <header className="mt-5 grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12">
        <div className="photo aspect-[4/3] w-full md:order-2">
          <img
            src={trail.cover.src}
            alt={trail.cover.alt}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="label-map">{trail.region}</p>
          <h1 className="display-xl mt-1.5">{trail.name}</h1>
          <p className="prose-measure mt-4 text-lg opacity-85">{trail.description}</p>

          <dl className="tabular mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink/15 pt-5 dark:border-stone/20">
            <div>
              <dt className="label-map">Difficulty</dt>
              <dd className="mt-1 font-semibold">
                <Difficulty level={trail.difficulty} />
              </dd>
            </div>
            <div>
              <dt className="label-map">Distance</dt>
              <dd className="mt-1 font-semibold">{trail.distanceKm} km</dd>
            </div>
            <div>
              <dt className="label-map">Photographs</dt>
              <dd className="mt-1 font-semibold">{trail.photos.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section aria-labelledby="hikes-heading" className="mt-16">
        <h2 id="hikes-heading" className="display-md">
          Upcoming group hikes
        </h2>

        {upcoming.length === 0 ? (
          <p className="prose-measure mt-3 opacity-80">
            Nobody has planned a walk here yet.{' '}
            <Link
              to={`/group-hikes/new?trail=${trail.id}`}
              className="font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
            >
              Organize the first one
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/12 border-y border-ink/12 dark:divide-stone/12 dark:border-stone/12">
            {upcoming.map((hike) => {
              const spotsLeft = hike.spotsTotal - hike.spotsTaken
              return (
                <li
                  key={hike.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-display text-lg font-semibold">{hike.title}</p>
                    <p className="tabular label-map mt-1 flex flex-wrap gap-x-5 gap-y-1">
                      <span>{formatDate(hike.date)}</span>
                      <span>Starts {hike.startTime}</span>
                      <span>{spotsLeft > 0 ? spotsLeftText(spotsLeft) : 'Full'}</span>
                    </p>
                  </div>
                  <Link to={`/group-hikes/${hike.id}`} className="btn btn-primary py-2.5 text-sm">
                    View hike
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="photos-heading" className="mt-16">
        <h2 id="photos-heading" className="display-md">
          Photographs from the trail
        </h2>
        <div className="mt-5">
          <PhotoGallery photos={trail.photos} />
        </div>
      </section>
    </article>
  )
}
