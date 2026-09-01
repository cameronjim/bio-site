import { applyTheme, useTheme, type Theme } from '../hooks/useTheme'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'lofi', label: 'Light' },
  { value: 'business', label: 'Dark' },
  { value: 'piedpiper', label: 'Pied Piper' },
  { value: 'spiderman', label: 'Spider-Man' },
]

function ThemeToggle() {
  const theme = useTheme()

  function select(next: Theme) {
    applyTheme(next)
    // Close the dropdown after choosing (daisyUI dropdowns close on blur).
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        aria-label="Change theme"
        title="Change theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-3 w-40 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        {THEMES.map((t) => (
          <li key={t.value}>
            <button
              type="button"
              className={theme === t.value ? 'text-primary font-semibold' : ''}
              onClick={() => select(t.value)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemeToggle
