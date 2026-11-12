import { Link } from 'react-router-dom'
import Difficulty from './Difficulty'

// One trail, used on the home page and the trail list.
// The photograph stays a photograph: nothing is printed on top of it, so a
// pale sky never swallows the trail name. Text sits on a solid panel below.
export default function TrailCard({ trail, showDescription = true }) {
  const { id, name, region, difficulty, distanceKm, description, cover } = trail
  const photo = cover ?? trail.photos[0]

  return (
    <Link
      to={`/trails/${id}`}
      className="group surface flex flex-col overflow-hidden transition-colors hover:border-brand/45 dark:hover:border-stone/40"
    >
      <div className="photo aspect-[4/3] shrink-0 rounded-none">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="display-md text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {name}
        </h3>
        <p className="label-map mt-0.5">{region}</p>

        {showDescription && (
          <p className="mt-2.5 text-sm leading-relaxed opacity-85">{description}</p>
        )}

        <div className="tabular mt-auto flex items-center justify-between gap-3 pt-4 text-sm font-medium">
          <Difficulty level={difficulty} />
          <span>{distanceKm} km</span>
        </div>
      </div>
    </Link>
  )
}
