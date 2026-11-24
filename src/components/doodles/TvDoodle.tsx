import Doodle, { type DoodleProps } from '../sketch/Doodle'

function TvDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 110 100" {...props}>
      <path pathLength="1" d="M42 24 L30 6 M62 24 L76 4" />
      <path pathLength="1" d="M10 26 H100 Q104 26 104 30 V82 Q104 86 100 86 H10 Q6 86 6 82 V30 Q6 26 10 26 Z" />
      <path pathLength="1" d="M16 34 H80 V78 H16 Z" />
      <circle pathLength="1" cx="92" cy="42" r="4" />
      <circle pathLength="1" cx="92" cy="56" r="4" />
      <path pathLength="1" d="M42 46 L58 56 L42 66 Z" />
      <path pathLength="1" d="M24 86 L18 96 M86 86 L92 96" />
    </Doodle>
  )
}

export default TvDoodle
