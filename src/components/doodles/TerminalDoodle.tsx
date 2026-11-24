import Doodle, { type DoodleProps } from '../sketch/Doodle'

function TerminalDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 120 90" {...props}>
      <path pathLength="1" d="M8 8 H112 Q114 8 114 11 V80 Q114 83 111 83 H9 Q6 83 6 80 V10 Q6 8 8 8 Z" />
      <path pathLength="1" d="M6 22 C 40 21, 80 23, 114 22" />
      <circle pathLength="1" cx="16" cy="15" r="2.5" />
      <circle pathLength="1" cx="25" cy="15" r="2.5" />
      <circle pathLength="1" cx="34" cy="15" r="2.5" />
      <path pathLength="1" d="M18 38 L28 46 L18 54" />
      <path pathLength="1" d="M34 56 H50" strokeWidth="3" />
      <path pathLength="1" d="M18 68 H44 M50 68 H70" strokeWidth="1.6" />
    </Doodle>
  )
}

export default TerminalDoodle
