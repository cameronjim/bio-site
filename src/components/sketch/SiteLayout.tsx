import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import SketchFilters from './SketchFilters'
import SketchBorder from './SketchBorder'
import ContactSection from '../ContactSection'
import { PLAY_URL } from '../../config/projects'
import { useSiteMode, type SiteMode } from '../../hooks/useSiteMode'

const NAV_TABS = [
  { to: '/projects', label: 'projects' },
  { to: '/experience', label: 'experience' },
  { to: '/about', label: 'about' },
]

const SITE_TITLE = 'Cameron Jim'

const LINK_CLASS = 'decoration-primary decoration-wavy underline-offset-4 hover:underline'

const BOOT_MS = 1800

// The current tab keeps its pen underline; the rest only show it on hover.
function tabClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'font-semibold text-primary underline decoration-primary decoration-wavy underline-offset-4'
    : LINK_CLASS
}

// "play" is always red; it also keeps the pen underline while you're on /play.
function playClass({ isActive }: { isActive: boolean }) {
  return `text-primary ${tabClass({ isActive })}`
}

// daisyUI dropdowns stay open while focus is inside them, so drop focus after
// a tap to close the mobile menu.
function closeMenu() {
  ;(document.activeElement as HTMLElement | null)?.blur()
}

// Start each new page at the top, or at its #hash target when there is one.
// Client-side navigation does neither on its own.
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

interface PenRuleProps {
  className?: string
}

// A long, slightly wavering pen line used under the header and above the footer.
function PenRule({ className = '' }: PenRuleProps) {
  return (
    <>
      <div className={`pixel-only h-1 w-full bg-current ${className}`} aria-hidden="true" />
      <svg
        className={`sketch-only pointer-events-none h-2 w-full ${className}`}
        viewBox="0 0 400 8"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path
          d="M1 4 C 60 2.6, 120 5.4, 200 3.8 S 330 2.8, 399 4.4"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  )
}

interface ModeSwitchProps {
  mode: SiteMode
  onToggle: () => void
}

// The stamp in the header that flips between the hand-drawn site and game mode.
function ModeSwitch({ mode, onToggle }: ModeSwitchProps) {
  const toGame = mode === 'sketch'
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex items-center px-3 py-1 font-hand text-sm text-base-content/70 transition-transform hover:-translate-y-0.5"
      aria-pressed={!toGame}
      title={toGame ? 'Switch to game mode' : 'Switch back to the sketchbook'}
    >
      <SketchBorder variant={1} className="text-base-content/50" />
      <span className="relative whitespace-nowrap">
        {toGame ? 'game' : 'sketch'}
        <span className="hidden sm:inline"> mode</span>
        {toGame ? ' ▸' : ' ✎'}
      </span>
    </button>
  )
}

// Shown for a moment when game mode turns on: an arcade attract screen. The name zooms in,
// "insert coin" blinks, then it cuts to the site.
function BootScreen() {
  return (
    <div
      className="boot-screen fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-base-200"
      aria-hidden="true"
    >
      <p className="boot-logo font-hand text-5xl font-bold tracking-wide text-base-content uppercase sm:text-7xl">
        Cameron Jim
      </p>
      <p className="boot-blink font-scrawl text-3xl tracking-widest text-primary uppercase">
        insert coin
      </p>
    </div>
  )
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

interface SiteLayoutProps {
  // Page name for the browser tab; omitted on the home page.
  title?: string
  children: React.ReactNode
}

// Shared shell for every page: paper background, header tabs, the "Let's talk"
// card and the footer.
function SiteLayout({ title, children }: SiteLayoutProps) {
  useScrollOnNavigate()
  const [mode, setMode] = useSiteMode()
  const [booting, setBooting] = useState(false)

  useEffect(() => {
    if (!booting) return
    const id = window.setTimeout(() => setBooting(false), BOOT_MS)
    return () => window.clearTimeout(id)
  }, [booting])

  function toggleMode() {
    const next = mode === 'sketch' ? 'arcade' : 'sketch'
    setMode(next)
    if (next === 'arcade' && !prefersReducedMotion()) setBooting(true)
  }

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_TITLE}` : `${SITE_TITLE} | Software Engineer`
  }, [title])

  return (
    <div
      data-theme={mode}
      className="sketch-paper flex min-h-screen flex-col overflow-x-clip text-base-content"
    >
      <SketchFilters />
      {booting && <BootScreen />}
      <header className="sticky top-0 z-50 bg-base-200/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-scrawl text-3xl font-bold whitespace-nowrap">
            cameron jim
          </Link>
          <nav className="flex items-center gap-3 sm:gap-5" aria-label="Main">
            <ul className="hidden items-center gap-6 font-hand md:flex">
              {NAV_TABS.map((tab) => (
                <li key={tab.to}>
                  <NavLink to={tab.to} className={tabClass}>
                    {tab.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to={PLAY_URL} className={playClass}>
                  play
                </NavLink>
              </li>
            </ul>
            <ModeSwitch mode={mode} onToggle={toggleMode} />
            <div className="dropdown dropdown-end md:hidden">
              <div
                tabIndex={0}
                role="button"
                className="relative inline-flex px-3 py-1 font-hand"
                aria-label="Open menu"
              >
                <SketchBorder />
                <span className="relative">menu</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-50 mt-3 flex w-44 flex-col gap-3 p-5 font-hand"
              >
                <SketchBorder filled className="drop-shadow-sm" />
                <li className="relative">
                  <NavLink to="/" end className={tabClass} onClick={closeMenu}>
                    home
                  </NavLink>
                </li>
                {NAV_TABS.map((tab) => (
                  <li key={tab.to} className="relative">
                    <NavLink to={tab.to} className={tabClass} onClick={closeMenu}>
                      {tab.label}
                    </NavLink>
                  </li>
                ))}
                <li className="relative">
                  <NavLink to={PLAY_URL} className={playClass} onClick={closeMenu}>
                    play
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <PenRule className="text-base-content/40" />
      </header>
      <main className="flex-1">{children}</main>
      <ContactSection />
      <footer className="mx-auto w-full max-w-5xl px-6 pt-4 pb-10">
        <PenRule className="mb-6 text-base-content/40" />
        <div className="flex flex-col items-center justify-between gap-3 font-hand text-sm text-base-content/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Cameron Jim</p>
          <div className="flex gap-5">
            <a
              href="https://github.com/cameronjim"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              github
            </a>
            <a
              href="https://www.linkedin.com/in/cameron-jim/"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              linkedin
            </a>
            <a href="/resume.pdf" className={LINK_CLASS}>
              résumé
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout
