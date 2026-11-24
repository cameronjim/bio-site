// Hand-drawn boxes in a 0–100 box, stretched to any element with
// preserveAspectRatio="none" (non-scaling strokes keep the line weight even).
// Each side is its own stroke that overshoots the corner, the way a pen box is
// actually drawn; the closed path underneath is the paper fill.
const BOX_STROKES = [
  'M-0.6 2.8 C 30 1.2, 70 3.2, 100.6 1.6 M98.4 -3 C 99.4 30, 97.6 70, 98.8 103 M100.7 98 C 70 99.6, 30 97.4, -0.5 98.9 M1.9 102.5 C 0.8 70, 2.6 30, 1.1 -2.5',
  'M-0.5 1.4 C 34 2.9, 68 0.8, 100.5 2.7 M97.6 -2 C 98.9 36, 97.4 72, 98.2 102.4 M100.6 98.6 C 64 97.4, 28 99.4, -0.7 97.6 M2.6 103 C 1.6 64, 0.4 30, 1.7 -3',
]

const BOX_FILL =
  'M2 3 C 26 1.6, 64 2.6, 98 1.8 C 98.8 28, 97.9 66, 98.6 97.6 C 68 98.8, 30 97.8, 1.6 98.4 C 1 70, 2.2 34, 2 3 Z'

interface SketchBorderProps {
  variant?: 0 | 1
  filled?: boolean
  // Fill utility for the paper; defaults to the card tone.
  fillClass?: string
  className?: string
}

function SketchBorder({
  variant = 0,
  filled = false,
  fillClass = 'fill-base-100',
  className = '',
}: SketchBorderProps) {
  const other = variant === 0 ? 1 : 0
  return (
    <>
      {/* game mode swaps the pen box for a pixel frame (see .pixel-box in index.css) */}
      <span
        className={`pixel-only pixel-box ${filled ? 'bg-base-100' : ''} ${className}`}
        aria-hidden="true"
      />
      <svg
        className={`sketch-only pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        {filled && <path d={BOX_FILL} className={fillClass} stroke="none" />}
        <path d={BOX_STROKES[variant]} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        <path
          d={BOX_STROKES[other]}
          strokeWidth="1"
          opacity="0.45"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  )
}

export default SketchBorder
