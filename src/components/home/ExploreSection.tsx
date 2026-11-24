import { Link } from 'react-router-dom'
import SectionHeading from '../sketch/SectionHeading'
import SketchBorder from '../sketch/SketchBorder'
import type { DoodleProps } from '../sketch/Doodle'
import TerminalDoodle from '../doodles/TerminalDoodle'
import CubeDoodle from '../doodles/CubeDoodle'
import TennisBallDoodle from '../doodles/TennisBallDoodle'

interface PageCard {
  to: string
  title: string
  teaser: string
  Art: (props: DoodleProps) => React.ReactElement
}

const PAGES: PageCard[] = [
  {
    to: '/projects',
    title: 'Projects',
    teaser: 'A self-driving RC truck, a 3D game, an emulator, a CPU, and a few more.',
    Art: CubeDoodle,
  },
  {
    to: '/experience',
    title: 'Experience',
    teaser: 'My co-ops, the startup I co-founded, and the tools I use.',
    Art: TerminalDoodle,
  },
  {
    to: '/about',
    title: 'About',
    teaser: 'Two national titles, Valorant, speedcubing, and what I cook.',
    Art: TennisBallDoodle,
  },
]

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]']

// The home page's table of contents: one sketched card per page.
function ExploreSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="keep flipping">More in the notebook</SectionHeading>
      <div className="grid gap-8 sm:grid-cols-3">
        {PAGES.map(({ to, title, teaser, Art }, i) => (
          <Link
            key={to}
            to={to}
            className={`group relative flex flex-col p-6 transition-transform hover:-translate-y-1 hover:rotate-0 ${TILTS[i]}`}
          >
            <SketchBorder filled variant={i % 2 === 0 ? 0 : 1} className="drop-shadow-sm" />
            <Art className="relative h-16 w-auto self-start text-base-content transition-transform group-hover:-rotate-6" />
            <h3 className="relative mt-4 font-hand text-2xl font-extrabold">{title} →</h3>
            <p className="relative mt-2 leading-relaxed text-base-content/75">{teaser}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ExploreSection
