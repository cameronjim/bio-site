import { useState } from 'react'

// Screenshots within this distance of 16:9 fill the card's 16:9 panel; anything else
// (square Game Boy screens, phone shots, ultrawide) is shown whole instead of cropped.
const WIDESCREEN = 16 / 9
const WIDESCREEN_TOLERANCE = 0.12

type Fit = 'fill' | 'framed'

interface Measured {
  fit: Fit
  // Small images (pixel art, raw emulator captures) get upscaled; keep their pixels sharp.
  pixelated: boolean
}

interface ProjectThumbnailProps {
  src: string
  alt: string
}

// Fits any screenshot into a project card's 16:9 picture panel. It measures the image once
// it loads and picks a layout, so a project only ever needs `thumbnail` set.
function ProjectThumbnail({ src, alt }: ProjectThumbnailProps) {
  const [measured, setMeasured] = useState<Measured | null>(null)

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    const ratio = img.naturalWidth / img.naturalHeight
    const fit = Math.abs(ratio - WIDESCREEN) <= WIDESCREEN_TOLERANCE ? 'fill' : 'framed'
    const panel = img.parentElement?.getBoundingClientRect()
    const pixelated = panel ? img.naturalHeight < panel.height : false
    setMeasured({ fit, pixelated })
  }

  const sharp = measured?.pixelated ? '[image-rendering:pixelated]' : ''

  if (measured?.fit === 'fill') {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        className={`absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] object-cover ${sharp}`}
      />
    )
  }

  // Framed (also the look while the image is still loading, so nothing jumps): the whole
  // shot on a paper mount, tilted a little, straightening on hover.
  return (
    <div className="absolute inset-[9%] flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        className={`max-h-full max-w-full -rotate-2 bg-base-100 object-contain p-1.5 shadow-md transition-transform duration-300 group-hover:rotate-0 ${sharp}`}
      />
    </div>
  )
}

export default ProjectThumbnail
