import Doodle, { type DoodleProps } from '../sketch/Doodle'

// A frying pan with an egg and a little steam.
function PanDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 140 100" {...props}>
      <path pathLength="1" d="M42 8 C 36 14, 48 18, 42 24 M58 6 C 52 12, 64 16, 58 22" strokeWidth="1.8" />
      <ellipse pathLength="1" cx="50" cy="62" rx="44" ry="30" />
      <ellipse pathLength="1" cx="50" cy="62" rx="36" ry="23" strokeWidth="1.6" />
      <path pathLength="1" d="M93 56 L134 46 Q138 50 134 54 L94 66" />
      <path pathLength="1" d="M30 60 C 26 48, 44 44, 52 50 C 64 46, 74 56, 66 66 C 62 76, 40 78, 32 70 C 26 68, 28 64, 30 60 Z" />
      <circle pathLength="1" cx="50" cy="60" r="8" />
    </Doodle>
  )
}

export default PanDoodle
