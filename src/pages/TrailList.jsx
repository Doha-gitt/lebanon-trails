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
    <Link to={`/trails/${id}`} className="group relative block h-96 overflow-hidden rounded-lg">
      <img
        src={cover.src}
        alt={cover.alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <span className="absolute left-4 top-4 rounded bg-paper px-2 py-0.5 text-sm font-semibold text-ink">
        {difficulty}
      </span>
      <span className="absolute right-4 top-4 rounded bg-brand px-2 py-0.5 text-sm font-semibold text-paper">
        {distanceKm} km
      </span>
      <div className="absolute bottom-0 p-5 text-paper">
        <h3 className="text-2xl font-bold text-paper">{name}</h3>
        <p className="text-sm opacity-90">{region}</p>
        <p className="mt-2 text-sm opacity-90">{description}</p>
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
      <section className="relative h-72 overflow-hidden rounded-lg md:h-80">
        <img src={bannerTrail.cover.src} alt={bannerTrail.cover.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-14">
          <h1 className="text-4xl font-extrabold text-paper md:text-6xl">All trails</h1>
          <p className="mt-3 max-w-lg text-lg text-paper">
            {trails.length} trails across {regions.length} regions. Filter by region, difficulty and length.
          </p>
        </div>
      </section>

      {/* FILTERS: card overlapping the bottom of the banner */}
      <section
        aria-label="Filter trails"
        className="relative z-10 mx-2 -mt-10 rounded-lg border border-ink/10 bg-paper p-5 md:mx-8 md:p-6 dark:border-stone/20 dark:bg-olive"
      >
        {/* Search box */}
        <label htmlFor="search" className="font-semibold">
          Search trails
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
            className="w-full rounded border border-olive/40 bg-stone px-4 py-3 text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand dark:bg-earth dark:text-stone dark:focus:outline-stone"
          />

          {/* Suggestion list: appears under the box while typing */}
          {listOpen && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg bg-paper shadow-lg ring-1 ring-olive/20 dark:bg-earth"
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
                    <img src={trail.cover.src} alt="" className="h-10 w-10 rounded object-cover" />
                    <div>
                      <p className="font-bold">{trail.name}</p>
                      <p className="text-sm opacity-75">
                        {trail.region}, {trail.difficulty.toLowerCase()}, {trail.distanceKm} km
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
            <label htmlFor="region" className="font-semibold">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-2 w-full rounded border border-olive/40 bg-stone px-3 py-2 text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand dark:bg-earth dark:text-stone dark:focus:outline-stone"
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
            <label htmlFor="length" className="font-semibold">
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-2 w-full rounded border border-olive/40 bg-stone px-3 py-2 text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand dark:bg-earth dark:text-stone dark:focus:outline-stone"
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
            <label htmlFor="sort" className="font-semibold">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-2 w-full rounded border border-olive/40 bg-stone px-3 py-2 text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand dark:bg-earth dark:text-stone dark:focus:outline-stone"
            >
              <option value="name">Name (A–Z)</option>
              <option value="shortest">Shortest first</option>
              <option value="longest">Longest first</option>
            </select>
          </div>
        </div>

        {/* Difficulty tabs (same style as "Pick your level" on the Home page) */}
        <p className="mt-5 font-semibold" id="difficulty-label">
          Difficulty
        </p>
        <div
          className="mt-2 flex w-fit gap-1 rounded-full bg-stone p-1 dark:bg-earth"
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
                  ? 'rounded-full bg-brand px-3 py-2 text-sm font-bold text-paper sm:px-5 sm:text-base'
                  : 'rounded-full px-3 py-2 text-sm font-bold hover:bg-paper sm:px-5 sm:text-base dark:hover:bg-olive'
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
          <h2 className="text-3xl font-extrabold md:text-4xl">
            {results.length} {results.length === 1 ? 'trail' : 'trails'} found
          </h2>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="w-fit rounded border-2 border-brand px-6 py-2 font-bold text-brand hover:bg-brand hover:text-paper dark:border-stone dark:text-stone dark:hover:bg-stone dark:hover:text-earth"
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
          <div className="rounded-lg bg-olive p-10 text-center text-paper">
            <h3 className="text-2xl font-extrabold text-paper">No trails match your filters</h3>
            <p className="mt-2 opacity-90">Try another name, region, difficulty or length.</p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded bg-paper px-8 py-3 font-bold text-ink hover:opacity-90"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}