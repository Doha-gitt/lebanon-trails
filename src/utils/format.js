// '2026-12-05' -> '5 December 2026', or 'Saturday 5 December 2026' with { weekday: true }
export function formatDate(date, { weekday = false } = {}) {
  return new Date(`${date}T00:00`).toLocaleDateString('en-GB', {
    weekday: weekday ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// 1 -> '1 hour', 2.5 -> '2.5 hours'
export function formatDuration(hours) {
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}

// 12 -> '12 spots left', 1 -> '1 spot left'
export function spotsLeftText(left) {
  return `${left} ${left === 1 ? 'spot' : 'spots'} left`
}
