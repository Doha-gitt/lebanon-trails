import { Link } from 'react-router-dom'
import { trails } from '../data/mockData'

// To do: filter by region, difficulty and length (distanceKm).
export default function TrailList() {
  return (
    <>
      <h1 className="text-3xl font-bold">Trail List</h1>
      <ul className="mt-4 list-disc pl-5">
        {trails.map((trail) => (
          <li key={trail.id}>
            <Link to={`/trails/${trail.id}`} className="underline">
              {trail.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
