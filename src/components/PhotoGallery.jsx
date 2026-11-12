import { useState } from 'react'
import PhotoViewer from './PhotoViewer'

const PREVIEW_COUNT = 6

// Grid of photo thumbnails. Shows the first few until "Show all" is clicked,
// and opens the full-size viewer when a photo is clicked.
export default function PhotoGallery({ photos }) {
  const [showAll, setShowAll] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)

  const visible = showAll ? photos : photos.slice(0, PREVIEW_COUNT)
  const hasMore = photos.length > PREVIEW_COUNT

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="photo group block aspect-square w-full"
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          className="btn btn-outline mt-5 text-brand dark:text-stone"
        >
          {showAll ? 'Show fewer photos' : `Show all ${photos.length} photos`}
        </button>
      )}

      <PhotoViewer photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
