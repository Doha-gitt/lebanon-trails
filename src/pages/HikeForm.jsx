import { useParams } from 'react-router-dom'

// One form for both routes: /group-hikes/new and /group-hikes/:hikeId/edit
export default function HikeForm() {
  const { hikeId } = useParams()

  return <h1 className="text-3xl font-bold">{hikeId ? 'Edit hike' : 'Organize a hike'}</h1>
}
