import Doodle, { type DoodleProps } from '../sketch/Doodle'

// Hawkeye: an eye with a tracking crosshair over the pupil.
function EyeDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 120 84" {...props}>
      <path pathLength="1" d="M6 42 C 30 8, 90 6, 114 42 C 90 76, 30 76, 6 42 Z" />
      <circle pathLength="1" cx="60" cy="42" r="19" />
      <circle pathLength="1" cx="60" cy="42" r="7" />
      <path pathLength="1" d="M52 32 Q55 28 60 28" strokeWidth="1.8" />
      <path pathLength="1" d="M60 4 V18 M60 66 V80 M24 42 H36 M84 42 H96" strokeWidth="1.8" />
      <path pathLength="1" d="M30 18 L24 10 M48 11 L46 3 M72 11 L74 3 M90 18 L96 10" />
    </Doodle>
  )
}

export default EyeDoodle
