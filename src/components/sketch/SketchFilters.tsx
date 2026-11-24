// One shared displacement filter, referenced by .ink-rough in index.css.
// Render once per page.
function SketchFilters() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <filter id="sketch-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="2.6" />
      </filter>
    </svg>
  )
}

export default SketchFilters
