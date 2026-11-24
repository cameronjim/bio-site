const ELLIPSE_PATH =
  'M8 22 C 6 8, 40 3, 62 5 C 86 7, 97 14, 94 26 C 91 38, 56 42, 32 39 C 12 36, 3 30, 6 18'

interface CircledTagProps {
  label: string
}

// A word circled in pen — the sketch theme's take on a badge.
function CircledTag({ label }: CircledTagProps) {
  return (
    <li className="relative px-3 py-1 font-hand text-sm">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible text-base-content/60"
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d={ELLIPSE_PATH} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative">{label}</span>
    </li>
  )
}

export default CircledTag
