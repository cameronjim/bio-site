import Doodle, { type DoodleProps } from '../sketch/Doodle'

function TennisBallDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 60 60" {...props}>
      <circle pathLength="1" cx="30" cy="30" r="24" />
      <path pathLength="1" d="M11 15 C 25 25, 25 35, 11 45" />
      <path pathLength="1" d="M49 15 C 35 25, 35 35, 49 45" />
    </Doodle>
  )
}

export default TennisBallDoodle
