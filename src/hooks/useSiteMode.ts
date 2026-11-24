import { useState } from 'react'

// 'sketch' is the hand-drawn default; 'arcade' is game mode. Both are daisyUI themes
// defined in index.css and applied by SiteLayout via data-theme.
export type SiteMode = 'sketch' | 'arcade'

const STORAGE_KEY = 'site-mode'

// Storage can be unavailable (private windows, blocked site data), so every access is
// guarded and the site always falls back to the sketch look.
function readMode(): SiteMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'arcade' ? 'arcade' : 'sketch'
  } catch {
    return 'sketch'
  }
}

function saveMode(mode: SiteMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // remembered for this page only
  }
}

export function useSiteMode() {
  const [mode, setMode] = useState<SiteMode>(readMode)

  function update(next: SiteMode) {
    setMode(next)
    saveMode(next)
  }

  return [mode, update] as const
}
