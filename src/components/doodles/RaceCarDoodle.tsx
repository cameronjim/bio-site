import Doodle, { type DoodleProps } from '../sketch/Doodle'

function RaceCarDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 230 112" {...props}>
      {/* speed lines */}
      <path pathLength="1" d="M4 58 H22 M10 70 H24 M2 82 H18" strokeWidth="1.8" />
      {/* body */}
      <path
        pathLength="1"
        d="M28 76 C 28 62, 40 56, 62 54 L 98 47 C 112 37, 142 36, 158 46 L 190 52 C 203 54, 210 62, 209 73 L 206 79 H 190 M 146 79 H 77 M 33 79 L 28 76"
      />
      <path pathLength="1" d="M104 49 C 114 42, 136 41, 149 48 Z" />
      {/* lidar puck on the roof */}
      <path pathLength="1" d="M117 38 V30 H139 V38 M120 30 Q128 22 136 30" />
      <path pathLength="1" d="M146 26 Q152 30 146 36 M151 22 Q160 30 151 40" strokeWidth="1.6" />
      <path pathLength="1" d="M196 53 L201 33 H220 L216 40 H203" />
      <circle pathLength="1" cx="56" cy="82" r="19" />
      <circle pathLength="1" cx="56" cy="82" r="7" />
      <circle pathLength="1" cx="168" cy="82" r="19" />
      <circle pathLength="1" cx="168" cy="82" r="7" />
      <path pathLength="1" d="M20 104 C 70 101, 140 106, 222 102" strokeWidth="1.8" />
    </Doodle>
  )
}

export default RaceCarDoodle
