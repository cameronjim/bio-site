import { useInView } from '../../hooks/useInView'

type DrawMode = 'load' | 'scroll' | 'none'

export interface DoodleProps {
  className?: string
  // 'load' inks in on page load, 'scroll' when scrolled into view, 'none' is static.
  draw?: DrawMode
  rough?: boolean
}

interface DoodleFrameProps extends DoodleProps {
  viewBox: string
  children: React.ReactNode
}

// Shared SVG frame for every doodle: ink in currentColor, round pen caps, the
// optional wobble filter and the draw-on animation. Children must set
// pathLength="1" on stroked shapes for the draw-on to work.
function Doodle({
  viewBox,
  className = '',
  draw = 'scroll',
  rough = true,
  children,
}: DoodleFrameProps) {
  const [ref, inView] = useInView<SVGSVGElement>(0.3)
  const drawClass =
    draw === 'none'
      ? ''
      : `draw-on ${draw === 'scroll' ? 'draw-scroll' : ''} ${inView ? 'in-view' : ''}`
  return (
    <svg
      ref={ref}
      className={`${drawClass} ${rough ? 'ink-rough' : ''} ${className}`}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default Doodle
