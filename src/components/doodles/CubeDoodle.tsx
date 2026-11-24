import Doodle, { type DoodleProps } from '../sketch/Doodle'

// An isometric 3x3 puzzle cube.
function CubeDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 100 100" {...props}>
      <path pathLength="1" d="M50 8 L88 28 L88 72 L50 92 L12 72 L12 28 Z" />
      <path pathLength="1" d="M12 28 L50 48 L88 28 M50 48 V92" />
      <path
        pathLength="1"
        d="M24.7 21.3 L62.7 41.3 M37.3 14.7 L75.3 34.7 M62.7 14.7 L24.7 34.7 M75.3 21.3 L37.3 41.3"
        strokeWidth="1.6"
      />
      <path
        pathLength="1"
        d="M24.7 34.7 V78.7 M37.3 41.3 V85.3 M12 42.7 L50 62.7 M12 57.3 L50 77.3"
        strokeWidth="1.6"
      />
      <path
        pathLength="1"
        d="M62.7 41.3 V85.3 M75.3 34.7 V78.7 M50 62.7 L88 42.7 M50 77.3 L88 57.3"
        strokeWidth="1.6"
      />
    </Doodle>
  )
}

export default CubeDoodle
