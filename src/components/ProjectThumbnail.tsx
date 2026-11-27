import { useState } from 'react'
import SketchBorder from './sketch/SketchBorder'

// Until the image loads, assume a widescreen capture (most screenshots are).
const DEFAULT_ASPECT = 16 / 9
// Tall boxes (square or portrait shots) stop growing at this height and shrink in width
// instead, so one card doesn't tower over its neighbours.
const MAX_HEIGHT_REM = 18
// Below this width an image is being scaled up (pixel art, raw emulator captures), so keep
// its pixels sharp instead of blurring them.
const PIXEL_ART_MAX_WIDTH = 480

interface ProjectThumbnailProps {
  src: string
  alt: string
}

// A project card's screenshot in a sketched box that takes the image's own shape: a square
// Game Boy screen gets a square box, a 16:9 capture a wide one. Nothing is cropped or
// letterboxed. The shape is read from the image once it loads.
function ProjectThumbnail({ src, alt }: ProjectThumbnailProps) {
  const [aspect, setAspect] = useState(DEFAULT_ASPECT)
  const [pixelated, setPixelated] = useState(false)

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    if (!naturalWidth || !naturalHeight) return
    setAspect(naturalWidth / naturalHeight)
    setPixelated(naturalWidth < PIXEL_ART_MAX_WIDTH)
  }

  return (
    <div
      className="relative mx-auto max-w-full"
      style={{ aspectRatio: aspect, width: `min(100%, ${MAX_HEIGHT_REM * aspect}rem)` }}
    >
      <span className="sketch-hatch sketch-clip absolute inset-0 bg-base-200" />
      <SketchBorder variant={1} className="text-base-content/50" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        className={`absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] object-cover ${pixelated ? '[image-rendering:pixelated]' : ''}`}
      />
    </div>
  )
}

export default ProjectThumbnail
