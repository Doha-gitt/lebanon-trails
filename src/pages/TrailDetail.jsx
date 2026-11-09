import { Link, useParams } from 'react-router-dom'
import { groupHikes, pastHikes, trails } from '../data/mockData'

export default function TrailDetail() {
  const { trailId } = useParams()
  const trail = trails.find((item) => item.id === trailId)

  if (!trail) return <h1 className="text-3xl font-bold">Trail not found</h1>

  const upcoming = groupHikes.filter((hike) => hike.trailId === trail.id)
  const archive = pastHikes.filter((hike) => hike.trailId === trail.id)

  return (
    <>
      <h1 className="text-3xl font-bold">{trail.name}</h1>
      <p className="mt-2">
        {trail.region} · {trail.difficulty} · {trail.distanceKm} km
      </p>
      <p className="mt-2">{trail.description}</p>

      <h2 className="mt-6 text-xl font-semibold">Upcoming group hikes</h2>
      {upcoming.length === 0 ? (
        <p className="mt-2">No upcoming group hikes.</p>
      ) : (
        <ul className="mt-2 list-disc pl-5">
          {upcoming.map((hike) => (
            <li key={hike.id}>
              <Link to={`/group-hikes/${hike.id}`} className="underline">
                {hike.date}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 text-xl font-semibold">Past hikes</h2>
      {archive.length === 0 ? (
        <p className="mt-2">No past hikes yet.</p>
      ) : (
        <ul className="mt-2 list-disc pl-5">
          {archive.map((hike) => (
            <li key={hike.id}>
              {hike.date} ({hike.photos.length} photos)
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
