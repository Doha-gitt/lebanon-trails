// Difficulty as three steps you can read at a glance, the way a map legend
// grades a route. Filled steps = how hard the trail is.
const steps = { Easy: 1, Moderate: 2, Hard: 3 }

export default function Difficulty({ level, className = '' }) {
  const filled = steps[level] ?? 0

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex items-end gap-[3px]" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={
              step <= filled
                ? 'block w-[3px] bg-current'
                : 'block w-[3px] bg-current opacity-25'
            }
            style={{ height: `${4 + step * 3}px` }}
          />
        ))}
      </span>
      {level}
    </span>
  )
}
