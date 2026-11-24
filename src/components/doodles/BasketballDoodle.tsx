import Doodle, { type DoodleProps } from '../sketch/Doodle'

function BasketballDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 80 80" {...props}>
      <circle pathLength="1" cx="40" cy="40" r="32" />
      <path pathLength="1" d="M40 8 C 38 30, 42 52, 40 72" />
      <path pathLength="1" d="M8 40 C 30 38, 52 42, 72 40" />
      <path pathLength="1" d="M18 16 C 30 28, 30 52, 18 64" />
      <path pathLength="1" d="M62 16 C 50 28, 50 52, 62 64" />
      <path pathLength="1" d="M74 24 L80 20 M76 34 L82 33" strokeWidth="1.6" />
    </Doodle>
  )
}

export default BasketballDoodle
