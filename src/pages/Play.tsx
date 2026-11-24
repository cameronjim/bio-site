import { useEffect } from 'react'
import { PLAY_URL } from '../config/projects'

// cameronjim.com/play → the emulator on gb.cameronjim.com. Kept as a route so
// the short URL works and "play" can never be claimed as a token slug.
function Play() {
  useEffect(() => {
    window.location.replace(PLAY_URL)
  }, [])

  return (
    <div
      data-theme="sketch"
      className="sketch-paper flex min-h-screen items-center justify-center font-scrawl text-3xl text-base-content"
    >
      <a href={PLAY_URL}>loading the Game Boy…</a>
    </div>
  )
}

export default Play
