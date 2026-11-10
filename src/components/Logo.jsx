// Site logo: two mountain peaks with a dotted trail climbing them.
// The mountain uses the current text colour; the trail is drawn in the
// navbar colour so it looks cut out of the mountain.
export default function Logo({ className = 'h-8 w-[3.2rem]', trailClassName = 'stroke-olive' }) {
  return (
    <svg viewBox="0 7.5 32 20" className={className} aria-hidden="true" focusable="false">
      <path d="M1 27 11.5 8.5 17 18.2 21 12 31 27Z" fill="currentColor" />
      <path
        d="M7.5 27c4.2-3 1.6-5.6 6.4-7.6s4.6-3.7 7.1-7.4"
        fill="none"
        className={trailClassName}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeDasharray="0.1 3.3"
      />
    </svg>
  )
}
