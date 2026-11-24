import Doodle, { type DoodleProps } from '../sketch/Doodle'

function GameBoyDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 120 190" {...props}>
      <path
        pathLength="1"
        d="M14 6.5 H105 Q113.5 6 114 14.5 V158 Q114.5 184 89 184.5 H14 Q6 184 6.5 176 V14 Q6 6 14 6.5 Z"
      />
      <path
        pathLength="1"
        d="M19 19 H101 Q103 19 103 22 V80 Q103 86 96 86 H22 Q18 86 18.5 81 V22 Q19 19 19 19 Z"
      />
      <path pathLength="1" d="M31 29 H89 V75 H31 Z" />
      <circle pathLength="1" cx="24.5" cy="50" r="2" />
      {/* tiny scene on the screen: hills and a sun */}
      <path pathLength="1" d="M33 70 Q46 56 58 66 Q70 54 87 68" strokeWidth="1.8" />
      <circle pathLength="1" cx="76" cy="40" r="5" strokeWidth="1.8" />
      <path pathLength="1" d="M22 120 H34 V110 H46 V122 H56 V134 H46 V144 H34 V134 H22 Z" />
      <circle pathLength="1" cx="80" cy="126" r="8.5" />
      <circle pathLength="1" cx="99" cy="115" r="8.5" />
      <path pathLength="1" d="M44 156 L54 152 M63 156 L73 152" strokeWidth="4" />
      <path
        pathLength="1"
        d="M84 176 L100 160 M90 179 L104 165 M96 181 L107 170"
        strokeWidth="2"
      />
    </Doodle>
  )
}

export default GameBoyDoodle
