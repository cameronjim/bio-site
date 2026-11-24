import Doodle, { type DoodleProps } from '../sketch/Doodle'

function ChipDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 100 100" {...props}>
      <path pathLength="1" d="M22 20 H78 Q80 20 80 23 V78 Q80 80 77 80 H22 Q20 80 20 77 V22 Q20 20 22 20 Z" />
      <path pathLength="1" d="M35 35 H65 V65 H35 Z" />
      <path pathLength="1" d="M40 41 L46 47 M50 41 H60 M40 58 H52 M57 53 L60 59" strokeWidth="1.6" />
      <path
        pathLength="1"
        d="M32 20 V8 M44 20 V8 M56 20 V8 M68 20 V8 M32 80 V92 M44 80 V92 M56 80 V92 M68 80 V92 M20 32 H8 M20 44 H8 M20 56 H8 M20 68 H8 M80 32 H92 M80 44 H92 M80 56 H92 M80 68 H92"
      />
    </Doodle>
  )
}

export default ChipDoodle
