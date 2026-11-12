// Contour lines, like the ones on a survey map. Lebanon's trails are defined by
// how steeply the land climbs, so the map's own linework is the site's structure
// rather than decoration. Stretches to any width; draws in the current text colour.
// Five nested lines around one summit, the way contours tighten as ground
// steepens — not five parallel rules.
const lines = Array.from({ length: 5 }, (_, i) => {
  const y = 94 - i * 9
  const lift = 30 + i * 16
  return {
    d:
      `M0 ${y} C 260 ${y - lift * 0.18} 430 ${y - lift * 0.9} 650 ${y - lift}` +
      ` C 870 ${y - lift * 1.08} 1000 ${y - lift * 0.42} 1200 ${y - lift * 0.14}`,
    opacity: 0.68 - i * 0.1,
  }
})

export default function Contour({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1200 96"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {lines.map((line) => (
        <path
          key={line.d}
          d={line.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          opacity={line.opacity}
        />
      ))}
    </svg>
  )
}
