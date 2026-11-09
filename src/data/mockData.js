// Shared mock data for all pages. Everything here is placeholder content:
// replace distances, dates, names and descriptions with real information.

export const trails = [
  {
    id: 'qadisha-valley',
    name: 'Qadisha Valley',
    region: 'North Lebanon',
    difficulty: 'Hard',
    distanceKm: 12,
    description: 'Placeholder description for the Qadisha Valley trail.',
  },
  {
    id: 'chouf-cedars',
    name: 'Chouf Cedars',
    region: 'Mount Lebanon',
    difficulty: 'Moderate',
    distanceKm: 8,
    description: 'Placeholder description for the Chouf Cedars trail.',
  },
  {
    id: 'jabal-moussa',
    name: 'Jabal Moussa',
    region: 'Keserwan',
    difficulty: 'Easy',
    distanceKm: 5,
    description: 'Placeholder description for the Jabal Moussa trail.',
  },
]

export const groupHikes = [
  {
    id: 'hike-1',
    trailId: 'chouf-cedars',
    date: '2026-12-05',
    guide: 'Guide name',
    spotsTotal: 20,
    spotsTaken: 12,
  },
  {
    id: 'hike-2',
    trailId: 'jabal-moussa',
    date: '2026-12-19',
    guide: 'Guide name',
    spotsTotal: 15,
    spotsTaken: 4,
  },
]

// Photo archive for Trail Detail. Add image paths to `photos` once you have them,
// e.g. put files in public/images/ and use '/images/qadisha-1.jpg'.
export const pastHikes = [
  { id: 'past-1', trailId: 'qadisha-valley', date: '2026-05-10', photos: [] },
  { id: 'past-2', trailId: 'qadisha-valley', date: '2026-09-20', photos: [] },
  { id: 'past-3', trailId: 'chouf-cedars', date: '2026-06-14', photos: [] },
]
