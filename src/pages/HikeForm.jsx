import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import { useAuth } from '../context/AuthContext'
import { FormError, FormField, inputClass } from '../components/FormField'

// Helper to get today's date in YYYY-MM-DD format for HTML min attribute
const getTodayDate = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Turns a saved hike into form values (numbers and lists become text).
function hikeToForm(hike) {
  return {
    ...hike,
    durationHours: String(hike.durationHours),
    spotsTotal: String(hike.spotsTotal),
    whatToBring: hike.whatToBring.join('\n'),
  }
}

// Organize a new hike (/group-hikes/new) or edit one (/group-hikes/:hikeId/edit).
// The key gives each hike its own fresh form, so moving from "Edit" to
// "Organize a Hike" doesn't keep the old hike's values.
export default function HikeForm() {
  const { hikeId } = useParams()
  return <HikeFormContent key={hikeId ?? 'new'} hikeId={hikeId} />
}

function HikeFormContent({ hikeId }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { hikes, addHike, updateHike } = useHikes()
  const { currentUser } = useAuth()

  const isEditing = Boolean(hikeId)
  const existingHike = isEditing ? hikes.find((hike) => hike.id === hikeId) : null

  // Pre-populate form if editing an existing hike. A new hike can start with a
  // trail chosen (link from a trail page: ?trail=barouk) and the user as guide.
  const [formData, setFormData] = useState(() =>
    existingHike
      ? hikeToForm(existingHike)
      : {
          trailId: searchParams.get('trail') ?? '',
          title: '',
          date: '',
          startTime: '09:00',
          meetingPoint: '',
          durationHours: '',
          guide: currentUser?.name ?? '',
          spotsTotal: '',
          description: '',
          whatToBring: '',
        },
  )
  const [error, setError] = useState('')

  if (isEditing && !existingHike) {
    return (
      <section className="py-10">
        <h1 className="text-3xl font-bold">Hike not found</h1>
        <p className="mt-2">This hike doesn't exist, so it can't be edited.</p>
        <Link to="/trails" className="mt-4 inline-block underline underline-offset-4">
          Browse trails
        </Link>
      </section>
    )
  }

  const selectedTrail = trails.find((trail) => trail.id === formData.trailId)

  const handleChange = (e) => {
    if (error) setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const { trailId, title, date, startTime, meetingPoint, durationHours, guide, spotsTotal, description } = formData

    // Validation checks
    if (
      !trailId ||
      !title.trim() ||
      !date ||
      !startTime ||
      !meetingPoint.trim() ||
      !durationHours ||
      !guide.trim() ||
      !spotsTotal ||
      !description.trim()
    ) {
      setError('Please fill in all required fields.')
      return
    }

    if (Number(durationHours) <= 0) {
      setError('Duration must be more than 0 hours.')
      return
    }

    if (!Number.isInteger(Number(spotsTotal)) || Number(spotsTotal) <= 0) {
      setError('Number of spots must be a whole number, at least 1.')
      return
    }

    if (isEditing && Number(spotsTotal) < existingHike.spotsTaken) {
      setError(`${existingHike.spotsTaken} people have already joined, so there must be at least ${existingHike.spotsTaken} spots.`)
      return
    }

    // Past date validation check
    if (date < getTodayDate()) {
      setError('Hike date cannot be in the past.')
      return
    }

    // Same fields as the hikes in src/data/mockData.js
    const hike = {
      trailId,
      title: title.trim(),
      date,
      startTime,
      meetingPoint: meetingPoint.trim(),
      durationHours: Number(durationHours),
      guide: guide.trim(),
      spotsTotal: Number(spotsTotal),
      description: description.trim(),
      whatToBring: formData.whatToBring
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    // Save to the shared hikes, then show the hike's page with a confirmation
    if (isEditing) {
      updateHike(hikeId, hike)
      navigate(`/group-hikes/${hikeId}`, { state: { saved: 'updated' } })
    } else {
      const newId = addHike(hike)
      navigate(`/group-hikes/${newId}`, { state: { saved: 'created' } })
    }
  }

  const cancelTo = isEditing ? `/group-hikes/${hikeId}` : selectedTrail ? `/trails/${selectedTrail.id}` : '/trails'

  return (
    <div className="mx-auto my-10 max-w-2xl">
      <h1 className="text-3xl font-bold md:text-4xl">{isEditing ? 'Edit group hike' : 'Organize a group hike'}</h1>
      <p className="mt-2 mb-8 opacity-80">
        {isEditing ? 'Change the details below and save.' : 'Choose a trail and fill in the details. All fields except "What to bring" are required.'}
      </p>

      <FormError message={error} />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField
          id="hike-trail"
          label="Trail"
          hint={selectedTrail && `${selectedTrail.region}, ${selectedTrail.difficulty.toLowerCase()}, ${selectedTrail.distanceKm} km`}
        >
          <select id="hike-trail" name="trailId" value={formData.trailId} onChange={handleChange} className={inputClass}>
            <option value="">Choose a trail</option>
            {trails.map((trail) => (
              <option key={trail.id} value={trail.id}>
                {trail.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="hike-title" label="Hike title">
          <input
            id="hike-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Sunrise walk to the waterfall"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField id="hike-date" label="Date">
            {/* min attribute locks out past dates on calendar UI */}
            <input
              id="hike-date"
              type="date"
              name="date"
              min={getTodayDate()}
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
          <FormField id="hike-time" label="Start time">
            <input id="hike-time" type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField id="hike-duration" label="Duration (hours)">
            <input
              id="hike-duration"
              type="number"
              name="durationHours"
              min="0.5"
              step="0.5"
              value={formData.durationHours}
              onChange={handleChange}
              className={inputClass}
              placeholder="4"
            />
          </FormField>
        </div>

        <FormField id="hike-meeting" label="Meeting point">
          <input
            id="hike-meeting"
            type="text"
            name="meetingPoint"
            value={formData.meetingPoint}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Village square parking"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="hike-guide" label="Guide">
            <input id="hike-guide" type="text" name="guide" value={formData.guide} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField
            id="hike-spots"
            label="Number of spots"
            hint={isEditing && existingHike.spotsTaken > 0 ? `${existingHike.spotsTaken} already joined` : undefined}
          >
            <input
              id="hike-spots"
              type="number"
              name="spotsTotal"
              min="1"
              value={formData.spotsTotal}
              onChange={handleChange}
              className={inputClass}
              placeholder="20"
            />
          </FormField>
        </div>

        <FormField id="hike-description" label="Description">
          <textarea
            id="hike-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className={inputClass}
            placeholder="What the hike is like: terrain, pace, highlights"
          />
        </FormField>

        <FormField id="hike-bring" label="What to bring (optional)" hint="One item per line">
          <textarea
            id="hike-bring"
            name="whatToBring"
            rows="4"
            value={formData.whatToBring}
            onChange={handleChange}
            className={inputClass}
            placeholder={'2 litres of water\nShoes with good grip'}
          />
        </FormField>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button type="submit" className="rounded bg-brand px-6 py-3 font-semibold text-paper hover:opacity-90">
            {isEditing ? 'Save changes' : 'Publish hike'}
          </button>
          <Link to={cancelTo} className="underline underline-offset-4">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
