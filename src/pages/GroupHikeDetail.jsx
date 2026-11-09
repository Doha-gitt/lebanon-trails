import { Link, useParams } from 'react-router-dom'
import { groupHikes, trails } from '../data/mockData'

export default function GroupHikeDetail() {
  const { hikeId } = useParams()
  const hike = groupHikes.find((item) => item.id === hikeId)

  if (!hike) return <h1 className="text-3xl font-bold">Group hike not found</h1>

  const trail = trails.find((item) => item.id === hike.trailId)

  return (
    <>
      <h1 className="text-3xl font-bold">{trail.name} group hike</h1>
      <p className="mt-2">
        {hike.date} · Led by {hike.guide}
      </p>
      <p className="mt-2">
        {hike.spotsTotal - hike.spotsTaken} of {hike.spotsTotal} spots left
      </p>
      <Link to={`/trails/${trail.id}`} className="mt-4 inline-block underline">
        View trail
      </Link>
    </>
  )
}
