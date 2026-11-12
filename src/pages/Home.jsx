import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trails } from '../data/mockData'
import { useHikes } from '../context/HikesContext'
import { spotsLeftText } from '../utils/format'
import TrailCard from '../components/TrailCard'
import Contour from '../components/Contour'

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

// Trails shown in the big photo at the top of the page.
const slideIds = ['qornet-es-sawda', 'chouwen', 'jezzine', 'barouk', 'yahshoush']
const slides = trails.filter((trail) => slideIds.includes(trail.id))

const tips = [
  'Start early to avoid the midday heat',
  'Bring at least 2 litres of water',
  'Wear shoes with good grip',
  'Tell someone where you are going',
  'Leave no trace: take your trash back with you',
]

// Section heading. The explanatory line is optional and only used where it
// actually tells the reader something they could not guess.
function SectionTitle({ title, text, children }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="display-lg">{title}</h2>
        {text && <p className="prose-measure mt-2 opacity-80">{text}</p>}
      </div>
      {children}
    </div>
  )
}

// One upcoming group hike. The bar shows how full it is.
function HikeCard({ id, title, date, startTime, guide, spotsTotal, spotsTaken }) {
  const day = new Date(`${date}T00:00`)
  const spotsLeft = spotsTotal - spotsTaken
  const percentFull = Math.round((spotsTaken / spotsTotal) * 100)
  const full = spotsLeft <= 0

  return (
    <article className="surface flex flex-col p-5">
      <div className="flex items-baseline justify-between gap-4">
        <time dateTime={date} className="tabular text-sm font-semibold">
          {day.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
        </time>
        <span className="tabular label-map">{startTime}</span>
      </div>

      <h3 className="display-md mt-3 text-xl">{title}</h3>
      <p className="label-map mt-1">Led by {guide}</p>

      <div className="mt-auto pt-6">
        <div
          className="h-1 overflow-hidden rounded-full bg-ink/15 dark:bg-stone/15"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-brand dark:bg-ember"
            style={{ width: `${percentFull}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className={`tabular text-sm ${full ? 'opacity-60' : 'font-semibold'}`}>
            {full ? 'Full' : spotsLeftText(spotsLeft)}
          </span>
          <Link
            to={`/group-hikes/${id}`}
            className="text-sm font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
          >
            View hike
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Home() {
  // Which photo of the top slider is showing (0 = first)
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

  return (
    <>
      {/* HERO: one large photograph, with the title set in a solid panel that
          sits on it like the title cartouche on an old survey map. Nothing is
          printed directly over the picture. */}
      <section className="bleed">
        <div className="relative h-[40vh] min-h-[260px] sm:h-[54vh] sm:max-h-[560px]">
          <img
            key={current.id}
            src={current.cover.src}
            alt={current.cover.alt}
            // Favour the land over the sky: most of these photographs put the
            // ridgeline in the lower half of the frame.
            className="h-full w-full object-cover object-[center_62%]"
          />

          {/* Which trail this photograph is from, plus the slide picker.
              Top right, where a map keeps its legend, clear of the panel below. */}
          <div className="absolute right-4 top-4 flex items-center gap-4 rounded-full bg-earth/80 px-4 py-2 text-paper backdrop-blur-sm sm:right-6">
            <Link
              to={`/trails/${current.id}`}
              className="text-[0.8125rem] hover:underline hover:underline-offset-4"
            >
              {current.name}, {current.region}
            </Link>
            <span className="flex items-center gap-1.5">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSlide(index)}
                  aria-label={`Show ${item.name}`}
                  aria-current={index === slide}
                  className={
                    index === slide
                      ? 'h-1.5 w-5 rounded-full bg-paper transition-all'
                      : 'h-1.5 w-1.5 rounded-full bg-paper/45 transition-all hover:bg-paper/80'
                  }
                />
              ))}
            </span>
          </div>
        </div>

        {/* The title panel spans the full column so the photograph ends on one
            clean horizontal line, the way a map's title block meets its edge. */}
        <div className="relative z-10 -mt-12 bg-stone sm:-mt-20 dark:bg-earth">
          <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-11">
            <h1 className="display-xl max-w-4xl">Walk the mountain that made Lebanon</h1>
            <p className="prose-measure mt-5 text-lg opacity-85">
              Cedar ridges, river gorges and Roman stone, from the coast to Qornet es Sawda.
              Find a trail that fits your legs, then walk it with other people.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/trails" className="btn btn-primary">
                Browse trails
              </Link>
              <Link to="/group-hikes/new" className="btn btn-outline">
                Organize a hike
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is in the collection, read as a map legend across the contours. */}
      <section className="relative pb-20 pt-20">
        <Contour className="absolute inset-x-0 top-0 h-24 w-full text-brand/50 dark:text-limestone/75" />
        <dl className="tabular relative flex flex-wrap gap-x-12 gap-y-2 pt-16 text-[0.9375rem]">
          <div className="flex items-baseline gap-2">
            <dt className="font-semibold">{trails.length}</dt>
            <dd className="opacity-75">trails</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="font-semibold">{regions.length}</dt>
            <dd className="opacity-75">regions</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="font-semibold">{hikes.length}</dt>
            <dd className="opacity-75">group hikes to join</dd>
          </div>
        </dl>
      </section>

      {/* PICK YOUR LEVEL */}
      <section className="pb-16">
        <SectionTitle title="Pick your level">
          <div
            className="surface flex w-fit gap-1 rounded-full p-1"
            role="group"
            aria-label="Choose a difficulty"
          >
            {levels.map((item) => (
              <button
                key={item}
                onClick={() => setLevel(item)}
                aria-pressed={level === item}
                className={
                  level === item
                    ? 'rounded-full bg-brand px-5 py-2 text-sm font-semibold text-paper dark:bg-ember'
                    : 'rounded-full px-5 py-2 text-sm font-semibold opacity-75 transition hover:opacity-100'
                }
              >
                {item}
              </button>
            ))}
          </div>
        </SectionTitle>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levelTrails.slice(0, 3).map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>

        {levelTrails.length > 3 && (
          <Link
            to="/trails"
            className="mt-6 inline-block text-sm font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
          >
            See all {levelTrails.length} {level.toLowerCase()} trails
          </Link>
        )}
      </section>

      {/* EXPLORE BY REGION: photo mosaic. Names sit in solid label chips, the
          way a map prints a place name, so they stay readable on any photo. */}
      <section className="pb-16">
        <SectionTitle
          title="Explore by region"
          text="Lebanon changes completely in forty kilometres. Start with the landscape you want."
        />
        <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 md:grid-cols-4">
          {regionTiles.map((tile, index) => (
            <Link
              key={tile.name}
              to={`/trails?region=${encodeURIComponent(tile.name)}`}
              className={`photo group relative ${
                index === 0
                  ? 'col-span-2 row-span-2'
                  : index === regionTiles.length - 1
                    ? 'col-span-2 md:col-span-4'
                    : ''
              }`}
            >
              <img
                src={tile.cover.src}
                alt={tile.cover.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute bottom-0 left-0 flex items-baseline gap-2 bg-stone px-3 py-1.5 dark:bg-earth">
                <span className={`font-display font-semibold ${index === 0 ? 'text-xl' : 'text-base'}`}>
                  {tile.name}
                </span>
                <span className="tabular text-xs opacity-70">
                  {tile.count} {tile.count === 1 ? 'trail' : 'trails'}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING GROUP HIKES */}
      <section className="pb-16">
        <SectionTitle title="Upcoming group hikes" text="Walk with people who know the route." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

      {/* BEFORE YOU GO */}
      <section className="bg-olive p-8 text-paper md:p-12 dark:bg-olive-deep">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="display-lg text-paper dark:text-paper">Before you go</h2>
            <p className="prose-measure mt-2 opacity-90">
              Five things worth checking, whatever the trail.
            </p>
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            aria-expanded={showTips}
            className="btn shrink-0 bg-paper text-ink hover:bg-stone"
          >
            {showTips ? 'Hide the checklist' : 'Show the checklist'}
          </button>
        </div>
        {showTips && (
          <ul className="mt-8 grid gap-x-10 gap-y-2.5 border-t border-paper/25 pt-7 sm:grid-cols-2">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-paper/60" />
                {tip}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
