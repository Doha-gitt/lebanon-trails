import { useEffect, useRef } from 'react'

// Full-screen photo viewer built on the native <dialog> element, which handles
// focus and the Escape key for us. `index` is the open photo, or null when closed.
export default function PhotoViewer({ photos, index, onChange, onClose }) {
  const dialogRef = useRef(null)
  const isOpen = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  // Wraps around: Next on the last photo goes back to the first.
  const show = (next) => onChange((next + photos.length) % photos.length)

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') show(index + 1)
    if (event.key === 'ArrowLeft') show(index - 1)
  }

  // A click on the dark area around the photo lands on the dialog itself.
  function handleClick(event) {
    if (event.target === event.currentTarget) onClose()
  }

  const photo = isOpen ? photos[index] : null
  const hasSeveral = photos.length > 1
  const buttonClass =
    'rounded border border-paper/60 px-4 py-2 font-semibold hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="fixed inset-0 m-auto h-fit w-[min(94vw,1100px)] max-w-none bg-transparent p-0 text-paper backdrop:bg-black/85"
    >
      {photo && (
        <>
          <figure className="flex flex-col items-center gap-3">
            <img src={photo.src} alt={photo.alt} className="max-h-[75vh] max-w-full rounded object-contain" />
            <figcaption className="text-center">{photo.alt}</figcaption>
          </figure>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {hasSeveral && (
              <button type="button" onClick={() => show(index - 1)} className={buttonClass}>
                Previous
              </button>
            )}
            <p aria-live="polite" className="min-w-16 text-center">
              {index + 1} of {photos.length}
            </p>
            {hasSeveral && (
              <button type="button" onClick={() => show(index + 1)} className={buttonClass}>
                Next
              </button>
            )}
            <button type="button" onClick={onClose} className={buttonClass}>
              Close
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}
