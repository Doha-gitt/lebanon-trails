import { Link } from 'react-router-dom'
import { trails } from '../data/mockData'

export default function Trails() {
  return (
    <>
      <h1 className="text-3xl font-bold">Trails</h1>
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
