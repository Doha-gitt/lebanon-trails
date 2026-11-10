import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import { spotsLeftText } from '../utils/format'

const levels = ['Easy', 'Moderate', 'Hard']

// List of different regions (keeps each region only the first time it appears).
const regions = trails
  .map((trail) => trail.region)
  .filter((region, index, all) => all.indexOf(region) === index)

// One tile per region: its first trail's photo and how many trails it has.
const regionTiles = regions.map((region) => {
  const regionTrails = trails.filter((trail) => trail.region === region)
  return { name: region, count: regionTrails.length, cover: regionTrails[0].cover }
})

// Trails shown in the big slider at the top of the page.
const slideIds = ['qornet-es-sawda', 'chouwen', 'jezzine', 'barouk', 'yahshoush']
const slides = trails.filter((trail) => slideIds.includes(trail.id))

const tips = [
  'Start early to avoid the midday heat',
  'Bring at least 2 litres of water',
  'Wear shoes with good grip',
  'Tell someone where you are going',
  'Leave no trace: take your trash back with you',
]

// Title + short sentence, used at the top of every section.
function SectionTitle({ title, text }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold md:text-4xl">{title}</h2>
      {text && <p className="mt-2 max-w-2xl opacity-80">{text}</p>}
    </div>
  )
}

// One card for one trail. It receives the trail's info as props.
function TrailCard({ id, name, region, difficulty, distanceKm, cover }) {
  return (
    <Link to={`/trails/${id}`} className="group relative block h-80 overflow-hidden rounded-lg">
      <img
        src={cover.src}
        alt={cover.alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <span className="absolute left-4 top-4 rounded bg-paper px-2 py-0.5 text-sm font-semibold text-ink">
        {difficulty}
      </span>
      <div className="absolute bottom-0 p-5 text-paper">
        <h3 className="text-2xl font-bold text-paper">{name}</h3>
        <p className="mt-1 text-sm">
          {region}, {distanceKm} km
        </p>
      </div>
    </Link>
  )
}

// One upcoming group hike, shown like an event ticket. It receives the hike's info as props.
function HikeCard({ id, title, date, startTime, guide, spotsTotal, spotsTaken }) {
  const day = new Date(`${date}T00:00`)
  const spotsLeft = spotsTotal - spotsTaken
  const percentFull = Math.round((spotsTaken / spotsTotal) * 100)

  return (
    <article className="flex overflow-hidden rounded-lg bg-paper dark:bg-olive">
      {/* Date block */}
      <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-brand text-paper">
        <span className="text-3xl font-extrabold">{day.getDate()}</span>
        <span className="text-sm">{day.toLocaleDateString('en-GB', { month: 'short' })}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm opacity-80">
          Starts {startTime}, led by {guide}
        </p>
        {/* Bar that fills up as people join */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone dark:bg-earth" aria-hidden="true">
          <div className="h-full rounded-full bg-brand dark:bg-stone" style={{ width: `${percentFull}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{spotsLeft > 0 ? spotsLeftText(spotsLeft) : 'Full'}</span>
          <Link to={`/group-hikes/${id}`} className="text-sm font-bold underline underline-offset-4">
            View hike
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  // Which slide of the top slider is showing (0 = first)
  const [slide, setSlide] = useState(0)
  // Which difficulty the visitor picked in "Pick your level"
  const [level, setLevel] = useState('Easy')
  // false = tips are hidden at the start
  const [showTips, setShowTips] = useState(false)
  const { hikes } = useHikes()

  const current = slides[slide]
  const levelTrails = trails.filter((trail) => trail.difficulty === level)
  // The three soonest hikes (dates are 'YYYY-MM-DD', so text order is date order)
  const upcoming = [...hikes].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)

  // Go to the next / previous slide, looping around at the ends.
  function nextSlide() {
    setSlide((s) => (s + 1) % slides.length)
  }
  function prevSlide() {
    setSlide((s) => (s - 1 + slides.length) % slides.length)
  }

  return (
    <>
      {/* HERO: big photo slider */}
      <section className="relative h-[40rem] overflow-hidden rounded-lg md:h-[38rem]">
        <img key={current.id} src={current.cover.src} alt={current.cover.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-start p-6 pt-12 md:justify-center md:p-14">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-paper md:text-7xl">
            Discover Lebanon on foot
          </h1>
          <p className="mt-4 max-w-lg text-lg text-paper">
            {trails.length} trails across {regions.length} regions. Pick one, join a group, and go.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/trails" className="rounded bg-brand px-8 py-3 text-center font-bold text-paper hover:opacity-90">
              Browse trails
            </Link>
            <Link
              to="/group-hikes/new"
              className="rounded border-2 border-paper px-8 py-3 text-center font-bold text-paper hover:bg-paper hover:text-ink"
            >
              Organize a hike
            </Link>
          </div>
        </div>

        {/* Slider controls: which trail is showing + arrows + dots */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-6 pb-16 md:px-14">
          <Link to={`/trails/${current.id}`} className="text-paper">
            <span className="block text-sm opacity-80">Photo from</span>
            <span className="block text-lg font-bold underline underline-offset-4">
              {current.name}, {current.region}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden gap-2 sm:flex">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSlide(index)}
                  aria-label={`Show ${item.name}`}
                  aria-current={index === slide}
                  className={index === slide ? 'h-3 w-8 rounded-full bg-paper' : 'h-3 w-3 rounded-full bg-paper/50'}
                />
              ))}
            </div>
            <button
              onClick={prevSlide}
              aria-label="Previous trail"
              className="h-11 w-11 rounded-full bg-paper/20 text-xl text-paper hover:bg-paper hover:text-ink"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next trail"
              className="h-11 w-11 rounded-full bg-paper/20 text-xl text-paper hover:bg-paper hover:text-ink"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* STATS: card overlapping the bottom of the hero */}
      <section className="relative z-10 mx-4 -mt-10 grid grid-cols-3 divide-x divide-olive/30 rounded-lg bg-paper py-6 text-center md:mx-16 dark:bg-olive">
        <div>
          <p className="text-3xl font-extrabold text-brand md:text-4xl dark:text-stone">{trails.length}</p>
          <p className="text-sm">trails</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-brand md:text-4xl dark:text-stone">{regions.length}</p>
          <p className="text-sm">regions</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-brand md:text-4xl dark:text-stone">{hikes.length}</p>
          <p className="text-sm">group hikes</p>
        </div>
      </section>

      {/* PICK YOUR LEVEL: tabs that change the trail cards */}
      <section className="py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle title="Pick your level" text="Choose a difficulty and see trails that match." />
          <div className="mb-8 flex w-fit gap-1 rounded-full bg-paper p-1 dark:bg-olive" role="group" aria-label="Choose a difficulty">
            {levels.map((item) => (
              <button
                key={item}
                onClick={() => setLevel(item)}
                aria-pressed={level === item}
                className={
                  level === item
                    ? 'rounded-full bg-brand px-5 py-2 font-bold text-paper'
                    : 'rounded-full px-5 py-2 font-bold hover:bg-stone dark:hover:bg-earth'
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {levelTrails.slice(0, 3).map((trail) => (
            <TrailCard
              key={trail.id}
              id={trail.id}
              name={trail.name}
              region={trail.region}
              difficulty={trail.difficulty}
              distanceKm={trail.distanceKm}
              cover={trail.cover}
            />
          ))}
        </div>
        {levelTrails.length > 3 && (
          <Link to="/trails" className="mt-6 inline-block font-semibold underline underline-offset-4">
            See all {levelTrails.length} {level.toLowerCase()} trails
          </Link>
        )}
      </section>

      {/* EXPLORE BY REGION: photo grid, first tile is big */}
      <section className="pb-16">
        <SectionTitle title="Explore by region" text="From the Bekaa plains to the Bsharri summits." />
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-4 md:grid-cols-4">
          {regionTiles.map((tile, index) => (
            <Link
              key={tile.name}
              to="/trails"
              className={`group relative overflow-hidden rounded-lg ${
                index === 0 ? 'col-span-2 row-span-2' : index === regionTiles.length - 1 ? 'col-span-2 md:col-span-4' : ''
              }`}
            >
              <img
                src={tile.cover.src}
                alt={tile.cover.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <p className={`font-bold text-paper ${index === 0 ? 'text-3xl' : 'text-lg'}`}>{tile.name}</p>
                <p className="text-sm text-paper">
                  {tile.count} {tile.count === 1 ? 'trail' : 'trails'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING GROUP HIKES: event cards */}
      <section className="pb-16">
        <SectionTitle title="Upcoming group hikes" text="Join a guided group. Spots fill up fast." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {upcoming.map((hike) => (
            <HikeCard
              key={hike.id}
              id={hike.id}
              title={hike.title}
              date={hike.date}
              startTime={hike.startTime}
              guide={hike.guide}
              spotsTotal={hike.spotsTotal}
              spotsTaken={hike.spotsTaken}
            />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION + TIPS (show/hide) */}
      <section className="mb-12 rounded-lg bg-olive p-8 text-paper md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-paper md:text-4xl">Ready for your first hike?</h2>
            <p className="mt-2 opacity-90">Read the essentials before you head out.</p>
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            aria-expanded={showTips}
            className="rounded bg-paper px-8 py-3 font-bold text-ink hover:opacity-90"
          >
            {showTips ? 'Hide tips' : 'Show hiking tips'}
          </button>
        </div>
        {showTips && (
          <ul className="mt-8 grid list-disc gap-x-10 gap-y-2 pl-5 sm:grid-cols-2">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
