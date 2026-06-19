import { useEffect, useRef, useState } from 'react'

// A tiny custom audio player. We own the UI and the play / volume / snippet
// logic; the audio stream comes from a hidden YouTube IFrame player, so nothing
// copyrighted is self-hosted. Crispian St. Peters — The Pied Piper.
const YT_VIDEO_ID = 'RFdSOppmkNw' // swap if this video ever blocks embedding
const START = 17 // seconds — where the snippet begins
const END = 35.5 // seconds — where it auto-stops
const VOLUME = 25 // 0–100, kept deliberately low

// Load YouTube's IFrame API exactly once; resolve when it's ready to use.
let apiPromise: Promise<void> | null = null
function loadYouTubeApi(): Promise<void> {
  if (apiPromise) return apiPromise
  apiPromise = new Promise<void>((resolve) => {
    const w = window as any
    if (w.YT && w.YT.Player) {
      resolve()
      return
    }
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiPromise
}

function PiedPiperPlayer() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const pollRef = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  function stopPolling() {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  // Poll playback position and stop the snippet once it reaches END.
  function startPolling() {
    stopPolling()
    pollRef.current = window.setInterval(() => {
      const p = playerRef.current
      if (p?.getCurrentTime && p.getCurrentTime() >= END) p.pauseVideo()
    }, 250)
  }

  useEffect(() => {
    return () => {
      stopPolling()
      playerRef.current?.destroy?.()
    }
  }, [])

  function playFromStart() {
    const p = playerRef.current
    p.setVolume(VOLUME)
    p.seekTo(START, true)
    p.playVideo()
  }

  async function toggle() {
    if (playing && playerRef.current) {
      playerRef.current.pauseVideo()
      return
    }
    setLoading(true)
    await loadYouTubeApi()
    const w = window as any

    if (playerRef.current) {
      playFromStart()
      return
    }

    playerRef.current = new w.YT.Player(hostRef.current, {
      videoId: YT_VIDEO_ID,
      playerVars: { controls: 0, disablekb: 1, modestbranding: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: () => playFromStart(),
        onError: () => setLoading(false),
        onStateChange: (e: any) => {
          const state = w.YT.PlayerState
          if (e.data === state.PLAYING) {
            setPlaying(true)
            setLoading(false)
            startPolling()
          } else if (e.data === state.PAUSED || e.data === state.ENDED) {
            setPlaying(false)
            stopPolling()
          }
        },
      },
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="btn btn-ghost btn-circle"
        aria-label={playing ? 'Pause the Pied Piper theme' : 'Play the Pied Piper theme'}
        title="Pied Piper theme"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : playing ? (
          <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      {/* Hidden YouTube player — audio source only. Off-screen, not display:none,
          so the browser keeps it playing. */}
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 h-[180px] w-[320px] overflow-hidden">
        <div ref={hostRef} />
      </div>
    </>
  )
}

export default PiedPiperPlayer
