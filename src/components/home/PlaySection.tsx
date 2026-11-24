import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLAY_URL, findProject } from '../../config/projects'
import GameBoyDoodle from '../doodles/GameBoyDoodle'
import SketchButton from '../sketch/SketchButton'
import HandArrow from '../sketch/HandArrow'

const SLIDE_MS = 2600

// Screenshots from the emulator project, cycled inside the drawn Game Boy screen.
const SCREENSHOTS = findProject('gameboy-emulator')?.screenshots ?? []

function PlaySection() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (SCREENSHOTS.length < 2) return
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % SCREENSHOTS.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="play" className="mx-auto max-w-5xl px-6 pb-28">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr]">
        <Link
          to={PLAY_URL}
          className="group relative mx-auto block w-56 -rotate-3 transition-transform hover:rotate-0 sm:w-64"
          aria-label="Play the Game Boy games"
        >
          {/* screen window, positioned over the doodle's screen (31,29 → 89,75 of 120×190) */}
          <span className="absolute top-[15.3%] left-[25.8%] h-[24.2%] w-[48.3%] overflow-hidden bg-base-300">
            {SCREENSHOTS.map((shot, i) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={i === slide ? shot.caption : ''}
                className={`absolute inset-0 h-full w-full object-cover [image-rendering:pixelated] transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </span>
          <GameBoyDoodle className="relative w-full text-base-content" />
        </Link>
        <div>
          <p className="font-scrawl text-2xl text-primary">press start</p>
          <h2 className="font-hand text-4xl font-extrabold tracking-tight sm:text-5xl">
            Play my Game Boy games
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-base-content/75">
            My emulator runs in the browser too!
          </p>
          <p className="mt-3 font-hand text-base-content/60">
            {SCREENSHOTS[slide]?.caption ?? ''}
          </p>
          <div className="relative mt-8 flex items-center gap-4">
            <SketchButton href={PLAY_URL} primary>
              play now
            </SketchButton>
            <HandArrow
              className="draw-on w-10 -scale-x-100 text-primary"
              d="M90 70 C 72 40, 50 30, 14 34"
              head="M28 20 L 12 34 L 28 48"
            />
            <span className="-rotate-3 font-scrawl text-xl text-primary">no download needed</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlaySection
