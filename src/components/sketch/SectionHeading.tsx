import { useInView } from '../../hooks/useInView'

interface SectionHeadingProps {
  note: string
  // 1 when the heading is the page's title (its own route), 2 inside a page.
  level?: 1 | 2
  children: React.ReactNode
}

// Handwritten margin note above a hand-lettered heading, with a pen squiggle
// that inks in when the heading scrolls into view.
function SectionHeading({ note, level = 2, children }: SectionHeadingProps) {
  const [ref, inView] = useInView<SVGSVGElement>(0.6)
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className="mb-12">
      <p className="font-scrawl text-2xl text-primary">{note}</p>
      <Heading className="relative inline-block font-hand text-4xl font-extrabold tracking-tight sm:text-5xl">
        {children}
        <svg
          ref={ref}
          className={`draw-on draw-scroll absolute -bottom-3 left-0 h-3 w-full text-primary ${inView ? 'in-view' : ''}`}
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path pathLength="1" d="M2 7 C 30 2, 50 11, 80 6 S 140 2, 198 6" />
        </svg>
      </Heading>
    </div>
  )
}

export default SectionHeading
