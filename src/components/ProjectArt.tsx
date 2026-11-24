import type { ProjectArt as ProjectArtKind } from '../config/projects'
import type { DoodleProps } from './sketch/Doodle'
import RaceCarDoodle from './doodles/RaceCarDoodle'
import EyeDoodle from './doodles/EyeDoodle'
import GameBoyDoodle from './doodles/GameBoyDoodle'
import BasketballDoodle from './doodles/BasketballDoodle'
import BrowserDoodle from './doodles/BrowserDoodle'

const ART: Record<ProjectArtKind, (props: DoodleProps) => React.ReactElement> = {
  car: RaceCarDoodle,
  eye: EyeDoodle,
  gameboy: GameBoyDoodle,
  basketball: BasketballDoodle,
  browser: BrowserDoodle,
}

interface ProjectArtProps extends DoodleProps {
  art: ProjectArtKind
}

// Picks the hand-drawn doodle for a project from its `art` key.
function ProjectArt({ art, ...props }: ProjectArtProps) {
  const Art = ART[art]
  return <Art {...props} />
}

export default ProjectArt
