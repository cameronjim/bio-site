import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PLAY_GAMES } from '../config/projects'
import SiteLayout from '../components/sketch/SiteLayout'
import SectionHeading from '../components/sketch/SectionHeading'
import SketchBorder from '../components/sketch/SketchBorder'
import Tape from '../components/sketch/Tape'
import ConsoleDoodle from '../components/doodles/ConsoleDoodle'

const EMU_SRC = '/play/emu.html'
const EMU_WIDTH = 320
const EMU_HEIGHT = 288

const CONTROLS = [
  { keys: 'arrows / WASD', button: 'd-pad' },
  { keys: 'F / Space', button: 'A' },
  { keys: 'G / X', button: 'B' },
  { keys: 'Enter', button: 'Start' },
  { keys: 'Backspace', button: 'Select' },
]

type EmuState = 'booting' | 'ready' | 'loading' | 'playing' | 'error'

interface EmuStatus {
  type: 'gbemu:status'
  state: Exclude<EmuState, 'booting'>
  rom?: string
  message?: string
}

function isEmuStatus(data: unknown): data is EmuStatus {
  return typeof data === 'object' && data !== null && (data as EmuStatus).type === 'gbemu:status'
}

function statusText(state: EmuState, rom: string | null, message: string) {
  const title = PLAY_GAMES.find((game) => game.rom === rom)?.title ?? rom
  if (state === 'booting') return 'warming up the Game Boy…'
  if (state === 'ready') return 'pick a game'
  if (state === 'loading') return `loading ${title}…`
  if (state === 'playing') return `playing ${title}`
  return `couldn't load ${title}: ${message}`
}

// The emulator picks a whole-number scale of whatever size it measures, so its frame stays at
// exactly 2x (320x288) and this hook works out how far to scale that frame to fill the drawn
// screen. A transform on the iframe is invisible to the page inside it.
function useScreenScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / EMU_WIDTH, height / EMU_HEIGHT))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return scale
}

// /play: the gbemu browser build running inside the hand-drawn Game Boy. The emulator lives
// in its own frame (public/play/emu.html) so leaving and coming back always boots it fresh;
// this page only sends it "load this game" and listens for its status.
function Play() {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const screenRef = useRef<HTMLDivElement | null>(null)
  const screenScale = useScreenScale(screenRef)
  const [state, setState] = useState<EmuState>('booting')
  const [rom, setRom] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    function handle(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) {
        return
      }
      if (!isEmuStatus(e.data)) return
      setState(e.data.state)
      if (e.data.rom) setRom(e.data.rom)
      setMessage(e.data.message ?? '')
    }
    window.addEventListener('message', handle)
    return () => window.removeEventListener('message', handle)
  }, [])

  function load(game: string) {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage({ type: 'gbemu:load', rom: game }, window.location.origin)
    frame.focus()
  }

  const canPick = state !== 'booting'

  return (
    <SiteLayout title="Play">
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <SectionHeading note="press start" level={1}>
          Play my Game Boy games
        </SectionHeading>
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative mx-auto w-full max-w-md">
            <div
              ref={screenRef}
              className="absolute top-[10%] left-[15%] h-[42%] w-[70%] overflow-hidden bg-neutral"
            >
              <iframe
                ref={frameRef}
                src={EMU_SRC}
                title="Game Boy emulator"
                className="absolute top-1/2 left-1/2 h-[288px] w-[320px] origin-center border-0"
                style={{ transform: `translate(-50%, -50%) scale(${screenScale})` }}
              />
              {/* covers the emulator's idle test pattern until a game is running */}
              {(state === 'booting' || state === 'ready') && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral px-4 text-center font-scrawl text-2xl text-neutral-content">
                  {state === 'booting' ? 'warming up…' : 'pick a game →'}
                </div>
              )}
            </div>
            <ConsoleDoodle draw="load" className="pointer-events-none relative w-full text-base-content" />
          </div>
          <div>
            <p className="mb-6 max-w-md text-lg leading-relaxed text-base-content/75">
              This is my Game Boy emulator running right in your browser. There are 4 games to choose
              from, written in C. Controls are down below. Enjoy!
            </p>
            <ul className="grid grid-cols-2 gap-4">
              {PLAY_GAMES.map((game, i) => {
                const active = rom === game.rom && (state === 'playing' || state === 'loading')
                return (
                  <li key={game.rom}>
                    <button
                      type="button"
                      disabled={!canPick}
                      onClick={() => load(game.rom)}
                      className={`relative w-full px-4 py-3 font-hand text-lg font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50 ${active ? 'bg-primary text-primary-content' : 'bg-base-100'} ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                    >
                      <SketchBorder variant={i % 2 === 0 ? 0 : 1} className="text-base-content" />
                      <span className="relative">{game.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-5 font-scrawl text-2xl text-primary" aria-live="polite">
              {statusText(state, rom, message)}
            </p>
            <div className="relative mt-8 rotate-1 bg-secondary/25 p-5 shadow-sm">
              <Tape className="-top-3 left-1/2 w-16 -translate-x-1/2" />
              <h2 className="font-hand text-lg font-extrabold">Controls</h2>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-hand text-base-content/80">
                {CONTROLS.map((control) => (
                  <div key={control.button} className="contents">
                    <dt className="font-semibold">{control.keys}</dt>
                    <dd>{control.button}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-hand text-sm text-base-content/60">
                Controllers work too. Saves stay in this browser.
              </p>
              <p className="mt-2 font-hand text-sm text-base-content/60 md:hidden">
                On a phone, you&apos;ll need a controller for now.
              </p>
            </div>
            <p className="mt-8 font-hand text-base-content/70">
              Curious how it works?{' '}
              <Link
                to="/projects/gameboy-emulator"
                className="text-primary decoration-wavy underline-offset-4 hover:underline"
              >
                read about the emulator →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}

export default Play
