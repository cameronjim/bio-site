import { useEffect, useState } from 'react'

export type Theme = 'lofi' | 'business' | 'piedpiper' | 'spiderman'

const VALID_THEMES: Theme[] = ['lofi', 'business', 'piedpiper', 'spiderman']

// Fires whenever the theme changes so every component reading it re-renders,
// even though the value itself lives on the <html> attribute + localStorage.
const THEME_CHANGE_EVENT = 'themechange'

export function getInitialTheme(): Theme {
  const current = document.documentElement.getAttribute('data-theme')
  if (VALID_THEMES.includes(current as Theme)) return current as Theme
  return 'piedpiper'
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }))
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    function handle(e: Event) {
      setTheme((e as CustomEvent<Theme>).detail)
    }
    window.addEventListener(THEME_CHANGE_EVENT, handle)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handle)
  }, [])

  return theme
}
