import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trails } from '../data/mockData'

const levels = ['All', 'Easy', 'Moderate', 'Hard']

// Length options: each one has a label and the km range it covers.
const lengths = [
  { value: 'all', label: 'Any length', min: 0, max: Infinity },
  { value: 'short', label: 'Short (under 5 km)', min: 0, max: 4.99 },
  { value: 'medium', label: 'Medium (5–8 km)', min: 5, max: 8 },
  { value: 'long', label: 'Long (over 8 km)', min: 8.01, max: Infinity },
]

// List of different regions, sorted A to Z (keeps each region only once).
const regions = trails
  .map((trail) => trail.region)
  .filter((region, index, all) => all.indexOf(region) === index)
  .sort()

// Banner photo at the top of the page.
const bannerTrail = trails.find((trail) => trail.id === 'yahshoush')

// One card for one trail (same design as the Home page). It receives the trail's info as props.
function TrailCard({ id, name, region, difficulty, distanceKm, description, cover }) {
  return (
    <Link
      to={`/trails/${id}`}
      className="group relative block h-96 overflow-hidden rounded-2xl shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <img
        src={cover.src}
        alt={cover.alt}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-xs font-bold text-ink">
        {difficulty}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-bold text-paper">
        {distanceKm} km
      </span>
      <div className="absolute bottom-0 p-5 text-paper">
        <p className="text-sm uppercase tracking-wider opacity-90">{region}</p>
        <h3 className="text-2xl font-bold text-paper">{name}</h3>
        <p className="mt-2 text-sm opacity-90">{description}</p>
        <p className="mt-3 text-sm font-bold">View trail →</p>
      </div>
    </Link>
  )
}

export default function TrailList() {
  // Filter values chosen by the visitor
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [level, setLevel] = useState('All')
  const [length, setLength] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  // Suggestion list under the search box: is it open, and which row is highlighted (-1 = none)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // The typed text, without extra spaces and in lowercase, so "  BAROUK " finds "Barouk".
  const query = search.trim().toLowerCase()

  // True when a word in the trail's name or region starts with the typed text.
  // Example: "s" finds "Sirjbeil" and "Jbaa South", but "h" does not find "Chouf".
  function matchesSearch(trail) {
    const text = `${trail.name} ${trail.region}`.toLowerCase()
    return text.startsWith(query) || text.includes(` ${query}`)
  }

  // Suggestions under the search box (names that START with the text come first). Max 6.
  const suggestions =
    query === ''
      ? []
      : trails
          .filter(matchesSearch)
          .sort((a, b) => {
            const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1
            const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1
            return aStarts - bStarts || a.name.localeCompare(b.name)
          })
          .slice(0, 6)

  // Open the list only while typing, and hide it if the text already equals a trail name exactly.
  const listOpen = showSuggestions && query !== '' && !trails.some((trail) => trail.name.toLowerCase() === query)

  // Put the clicked suggestion in the search box and close the list.
  function pickSuggestion(trail) {
    setSearch(trail.name)
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  // Keyboard support: arrows move through the list, Enter picks, Escape closes.
  function handleSearchKeyDown(e) {
    if (!listOpen || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      pickSuggestion(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  // The length option that is currently picked
  const lengthRange = lengths.find((item) => item.value === length)

  // Keep only the trails that match every filter.
  const filtered = trails
    .filter(matchesSearch)
    .filter((trail) => region === 'All' || trail.region === region)
    .filter((trail) => level === 'All' || trail.difficulty === level)
    .filter((trail) => trail.distanceKm >= lengthRange.min && trail.distanceKm <= lengthRange.max)

  // Sort a copy of the list (sort changes the array, so we copy it first with [...]).
  const results = [...filtered].sort((a, b) => {
    if (sortBy === 'shortest') return a.distanceKm - b.distanceKm
    if (sortBy === 'longest') return b.distanceKm - a.distanceKm
    return a.name.localeCompare(b.name)
  })

  // True when at least one filter is not on its default value
  const hasFilters = query !== '' || region !== 'All' || level !== 'All' || length !== 'all'

  function resetFilters() {
    setSearch('')
    setShowSuggestions(false)
    setActiveIndex(-1)
    setRegion('All')
    setLevel('All')
    setLength('all')
  }

  return (
    <>
      {/* BANNER */}
      <section className="relative h-72 overflow-hidden rounded-3xl shadow-2xl md:h-80">
        <img src={bannerTrail.cover.src} alt={bannerTrail.cover.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-14">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-paper opacity-90">Explore</p>
          <h1 className="mt-3 text-4xl font-extrabold text-paper md:text-6xl">All Trails</h1>
          <p className="mt-3 max-w-lg text-lg text-paper">
            {trails.length} trails across {regions.length} regions. Filter by region, difficulty and length.
          </p>
        </div>
      </section>

      {/* FILTERS: card overlapping the bottom of the banner */}
      <section
        aria-label="Filter trails"
        className="relative z-10 mx-2 -mt-10 rounded-2xl bg-paper p-5 shadow-xl md:mx-8 md:p-6 dark:bg-olive"
      >
        {/* Search box */}
        <label htmlFor="search" className="text-xs font-bold uppercase tracking-widest">
          Search
        </label>
        <div className="relative mt-2">
          <input
            id="search"
            type="search"
            value={search}
            maxLength={50}
            autoComplete="off"
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by trail or region, e.g. Barouk or Chouf"
            role="combobox"
            aria-expanded={listOpen}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${suggestions[activeIndex].id}` : undefined}
            className="w-full rounded-full border-2 border-olive/30 bg-stone px-5 py-3 text-ink outline-none focus:border-brand dark:bg-earth dark:text-stone"
          />

          {/* Suggestion list: appears under the box while typing */}
          {listOpen && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-paper shadow-2xl ring-1 ring-olive/20 dark:bg-earth"
            >
              {suggestions.length > 0 ? (
                suggestions.map((trail, index) => (
                  <li
                    key={trail.id}
                    id={`suggestion-${trail.id}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    // onMouseDown (not onClick) so the pick happens before the box loses focus
                    onMouseDown={(e) => {
                      e.preventDefault()
                      pickSuggestion(trail)
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2 ${
                      index === activeIndex ? 'bg-stone dark:bg-olive' : ''
                    }`}
                  >
                    <img src={trail.cover.src} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold">{trail.name}</p>
                      <p className="text-xs opacity-75">
                        {trail.region} · {trail.difficulty} · {trail.distanceKm} km
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm" role="option" aria-selected="false" aria-disabled="true">
                  No trail or region matches “{search.trim()}”
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Region dropdown */}
          <div>
            <label htmlFor="region" className="text-xs font-bold uppercase tracking-widest">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-2 w-full rounded-full border-2 border-olive/30 bg-stone px-4 py-2 text-ink focus:border-brand dark:bg-earth dark:text-stone"
            >
              <option value="All">All regions</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Length dropdown */}
          <div>
            <label htmlFor="length" className="text-xs font-bold uppercase tracking-widest">
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-2 w-full rounded-full border-2 border-olive/30 bg-stone px-4 py-2 text-ink focus:border-brand dark:bg-earth dark:text-stone"
            >
              {lengths.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div>
            <label htmlFor="sort" className="text-xs font-bold uppercase tracking-widest">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-2 w-full rounded-full border-2 border-olive/30 bg-stone px-4 py-2 text-ink focus:border-brand dark:bg-earth dark:text-stone"
            >
              <option value="name">Name (A–Z)</option>
              <option value="shortest">Shortest first</option>
              <option value="longest">Longest first</option>
            </select>
          </div>
        </div>

        {/* Difficulty tabs (same style as "Pick Your Level" on the Home page) */}
        <p className="mt-5 text-xs font-bold uppercase tracking-widest" id="difficulty-label">
          Difficulty
        </p>
        <div
          className="mt-2 flex w-fit gap-1 rounded-full bg-stone p-1 shadow-inner dark:bg-earth"
          role="group"
          aria-labelledby="difficulty-label"
        >
          {levels.map((item) => (
            <button
              key={item}
              onClick={() => setLevel(item)}
              aria-pressed={level === item}
              className={
                level === item
                  ? 'rounded-full bg-brand px-3 py-2 text-sm font-bold text-paper shadow sm:px-5 sm:text-base'
                  : 'rounded-full px-3 py-2 text-sm font-bold transition hover:bg-paper sm:px-5 sm:text-base dark:hover:bg-olive'
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-olive dark:text-stone">Results</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              {results.length} {results.length === 1 ? 'trail' : 'trails'} found
            </h2>
          </div>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="w-fit rounded-full border-2 border-brand px-6 py-2 font-bold text-brand transition hover:bg-brand hover:text-paper dark:border-stone dark:text-stone"
            >
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((trail) => (
              <TrailCard
                key={trail.id}
                id={trail.id}
                name={trail.name}
                region={trail.region}
                difficulty={trail.difficulty}
                distanceKm={trail.distanceKm}
                description={trail.description}
                cover={trail.cover}
              />
            ))}
          </div>
        ) : (
          // Shown when no trail matches the filters
          <div className="rounded-3xl bg-olive p-10 text-center text-paper shadow-xl">
            <h3 className="text-2xl font-extrabold text-paper">No trails match your filters</h3>
            <p className="mt-2 opacity-90">Try another name, region, difficulty or length.</p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-full bg-paper px-8 py-3 font-bold text-ink transition hover:scale-105"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}