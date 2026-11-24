import Doodle, { type DoodleProps } from '../sketch/Doodle'

// A big hand-drawn Game Boy for /play. Its screen window is (30,30) to (170,156) in the
// 200x300 viewBox, exactly 10:9 like the real screen. As percentages that is left 15%,
// top 10%, width 70%, height 42%, which is where /play places the emulator frame.
function ConsoleDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 200 300" {...props}>
      <path
        pathLength="1"
        d="M18 6.5 H181 Q193.5 6 194 18.5 V250 Q194.5 294 150 294.5 H18 Q6 294 6.5 282 V18 Q6 6 18 6.5 Z"
      />
      <path
        pathLength="1"
        d="M26 20 H174 Q180.5 20 180 26 V158 Q180.5 168.5 168 168 H28 Q19.5 168 20 160 V26 Q20 19.5 26 20 Z"
      />
      <path pathLength="1" d="M30 30 H170 V156 H30 Z" strokeWidth="1.6" />
      <circle pathLength="1" cx="25" cy="64" r="2" />
      <path pathLength="1" d="M48 194 H62 V208 H76 V222 H62 V236 H48 V222 H34 V208 H48 Z" />
      <circle pathLength="1" cx="156" cy="204" r="12" />
      <circle pathLength="1" cx="128" cy="222" r="12" />
      <path pathLength="1" d="M70 264 L84 258 M96 264 L110 258" strokeWidth="5" />
      <path pathLength="1" d="M142 280 L170 252 M152 285 L178 259 M162 288 L184 266" strokeWidth="2" />
    </Doodle>
  )
}

export default ConsoleDoodle
