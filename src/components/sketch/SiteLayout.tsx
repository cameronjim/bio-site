import { Link } from 'react-router-dom'
import SketchFilters from './SketchFilters'
import SketchBorder from './SketchBorder'
import { PLAY_URL } from '../../config/projects'

const NAV_LINKS = [
  { hash: '#projects', label: 'projects' },
  { hash: '#experience', label: 'experience' },
  { hash: '#athletics', label: 'athletics' },
  { hash: '#contact', label: 'contact' },
]

const LINK_CLASS = 'decoration-primary decoration-wavy underline-offset-4 hover:underline'

// daisyUI dropdowns stay open while focus is inside them; a same-page anchor
// keeps focus, so drop it after a tap to close the mobile menu.
function closeMenu() {
  ;(document.activeElement as HTMLElement | null)?.blur()
}

interface PenRuleProps {
  className?: string
}

// A long, slightly wavering pen line used under the header and above the footer.
function PenRule({ className = '' }: PenRuleProps) {
  return (
    <svg
      className={`pointer-events-none h-2 w-full ${className}`}
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
  )
}

interface SiteLayoutProps {
  // On the home page (public or token path) nav links are same-page anchors so
  // a token visitor never leaves their link; elsewhere they point back home.
  home?: boolean
  children: React.ReactNode
}

function SiteLayout({ home = false, children }: SiteLayoutProps) {
  const href = (hash: string) => (home ? hash : `/${hash}`)

  return (
    <div
      data-theme="sketch"
      className="sketch-paper flex min-h-screen flex-col overflow-x-clip text-base-content"
    >
      <SketchFilters />
      <header className="sticky top-0 z-50 bg-base-200/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {home ? (
            <a href="#about" className="font-scrawl text-3xl font-bold">
              cameron jim
            </a>
          ) : (
            <Link to="/" className="font-scrawl text-3xl font-bold">
              cameron jim
            </Link>
          )}
          <nav className="flex items-center gap-5" aria-label="Main">
            <ul className="hidden items-center gap-6 font-hand md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.hash}>
                  <a href={href(link.hash)} className={LINK_CLASS}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={PLAY_URL} className={`text-primary ${LINK_CLASS}`}>
                  play ↗
                </a>
              </li>
            </ul>
            <span
              className="relative hidden items-center px-3 py-1 font-hand text-sm text-base-content/60 sm:inline-flex"
              title="A second, game-style theme is on the way"
            >
              <SketchBorder variant={1} className="text-base-content/50" />
              <span className="relative">game mode · soon</span>
            </span>
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
                {NAV_LINKS.map((link) => (
                  <li key={link.hash} className="relative">
                    <a href={href(link.hash)} className={LINK_CLASS} onClick={closeMenu}>
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="relative">
                  <a href={PLAY_URL} className={`text-primary ${LINK_CLASS}`}>
                    play ↗
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <PenRule className="text-base-content/40" />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mx-auto w-full max-w-5xl px-6 pt-4 pb-10">
        <PenRule className="mb-6 text-base-content/40" />
        <div className="flex flex-col items-center justify-between gap-3 font-hand text-sm text-base-content/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Cameron Jim · drawn by hand, in code</p>
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
              href="https://www.linkedin.com/in/cameron-jim-037b992a6/"
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
