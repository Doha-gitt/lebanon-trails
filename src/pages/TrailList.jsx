import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { trails } from '../data/mockData'
import TrailCard from '../components/TrailCard'
import Contour from '../components/Contour'

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

export default function TrailList() {
  // The region lives in the address bar (/trails?region=Chouf) so the Home page
  // can link straight to it and a filtered list can be shared or bookmarked.
  const [searchParams, setSearchParams] = useSearchParams()
  const regionParam = searchParams.get('region')
  const region = regions.includes(regionParam) ? regionParam : 'All'

  function setRegion(value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'All') next.delete('region')
    else next.set('region', value)
    setSearchParams(next, { replace: true })
  }

  // Filter values chosen by the visitor
  const [search, setSearch] = useState('')
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
  const listOpen =
    showSuggestions && query !== '' && !trails.some((trail) => trail.name.toLowerCase() === query)

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
      {/* This page is an index, not a brochure: it opens with the list's own
          scope rather than another large photograph. */}
      <section className="relative pb-8 pt-12">
        <Contour className="absolute inset-x-0 top-6 h-16 w-full text-brand/40 dark:text-limestone/60" />
        <div className="relative">
          <h1 className="display-lg">All trails</h1>
          <p className="prose-measure mt-3 text-lg opacity-80">
            Every walk in the collection, from {regions.length} regions. Narrow it down by where you
            are, how hard you want it, and how far you want to go.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section aria-label="Filter trails" className="surface p-5 md:p-6">
        <label htmlFor="search" className="text-sm font-semibold">
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
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${suggestions[activeIndex].id}` : undefined
            }
            className="field"
          />

          {/* Suggestion list: appears under the box while typing */}
          {listOpen && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="surface absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden shadow-xl"
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
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                      index === activeIndex ? 'bg-ink/8 dark:bg-stone/10' : ''
                    }`}
                  >
                    <img
                      src={trail.cover.src}
                      alt=""
                      className="h-9 w-9 rounded-[2px] object-cover"
                    />
                    <div>
                      <p className="font-display font-semibold">{trail.name}</p>
                      <p className="tabular label-map">
                        {trail.region}, {trail.difficulty.toLowerCase()}, {trail.distanceKm} km
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li
                  className="px-3 py-3 text-sm"
                  role="option"
                  aria-selected="false"
                  aria-disabled="true"
                >
                  No trail or region matches “{search.trim()}”
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="region" className="text-sm font-semibold">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="field mt-2"
            >
              <option value="All">All regions</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="length" className="text-sm font-semibold">
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="field mt-2"
            >
              {lengths.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="text-sm font-semibold">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="field mt-2"
            >
              <option value="name">Name (A–Z)</option>
              <option value="shortest">Shortest first</option>
              <option value="longest">Longest first</option>
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold" id="difficulty-label">
          Difficulty
        </p>
        <div
          className="mt-2 flex w-fit gap-1 rounded-full border border-ink/12 p-1 dark:border-stone/15"
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
                  ? 'rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-paper sm:px-5 dark:bg-ember'
                  : 'rounded-full px-4 py-1.5 text-sm font-semibold opacity-75 transition hover:opacity-100 sm:px-5'
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="pt-10">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/12 pb-4 dark:border-stone/12">
          <h2 className="tabular text-[0.9375rem] font-semibold">
            {results.length} {results.length === 1 ? 'trail' : 'trails'}
            {region !== 'All' && ` in ${region}`}
          </h2>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-semibold underline decoration-1 underline-offset-4 hover:text-brand dark:hover:text-ember"
            >
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        ) : (
          // Shown when no trail matches the filters
          <div className="surface px-6 py-14 text-center">
            <h3 className="display-md">Nothing matches those filters</h3>
            <p className="prose-measure mx-auto mt-2 opacity-80">
              Try a wider region or a different length.
            </p>
            <button onClick={resetFilters} className="btn btn-primary mt-6">
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}
