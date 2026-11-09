import { Link } from 'react-router-dom'
import { groupHikes, trails } from '../data/mockData'

export default function GroupHikes() {
  return (
    <>
      <h1 className="text-3xl font-bold">Group Hikes</h1>
      <ul className="mt-4 list-disc pl-5">
        {groupHikes.map((hike) => (
          <li key={hike.id}>
            <Link to={`/group-hikes/${hike.id}`} className="underline">
              {trails.find((trail) => trail.id === hike.trailId)?.name} on {hike.date}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
