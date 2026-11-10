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
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {visible.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="block aspect-square w-full overflow-hidden rounded hover:opacity-85 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand dark:focus-visible:outline-stone"
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
          className="mt-4 rounded border border-brand px-4 py-2 font-semibold text-brand hover:bg-brand hover:text-paper dark:border-stone dark:text-stone dark:hover:bg-stone dark:hover:text-earth"
        >
          {showAll ? 'Show fewer photos' : `Show all ${photos.length} photos`}
        </button>
      )}

      <PhotoViewer photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
