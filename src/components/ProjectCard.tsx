import { Link } from 'react-router-dom'
import type { Project } from '../config/projects'
import SketchBorder from './sketch/SketchBorder'
import CircledTag from './sketch/CircledTag'
import Tape from './sketch/Tape'
import ProjectArt from './ProjectArt'
import ProjectThumbnail from './ProjectThumbnail'

const LINK_CLASS = 'decoration-wavy underline-offset-4 hover:underline'

interface ProjectLinksProps {
  project: Project
}

function ProjectLinks({ project }: ProjectLinksProps) {
  if (project.draft) {
    return (
      <p className="-rotate-2 font-scrawl text-2xl text-primary">demo + write-up coming soon</p>
    )
  }
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 font-hand text-lg font-semibold">
      <Link to={`/projects/${project.slug}`} className={`text-primary ${LINK_CLASS}`}>
        {project.video ? 'watch the demo →' : 'read more →'}
      </Link>
      {project.live && (
        <a href={project.live} className={LINK_CLASS}>
          {project.liveLabel ?? 'live'} ↗
        </a>
      )}
      {project.repo && (
        <a href={project.repo} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          code ↗
        </a>
      )}
    </div>
  )
}

function PlayMark() {
  return (
    <svg
      className="ink-rough w-16 text-primary transition-transform duration-300 group-hover:scale-110"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M40 6 C 60 5, 75 20, 74 40 C 73 60, 58 75, 38 74 C 18 73, 5 58, 6 38 C 7 20, 22 7, 42 7" />
      <path d="M32 26 L 56 40 L 32 54 Z" />
    </svg>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
}

// A project as a sketched page: doodle panel, margin note, circled tags and
// links. The featured project gets a wide layout with a video frame.
function ProjectCard({ project, index }: ProjectCardProps) {
  const tilt = index % 2 === 0 ? '-rotate-[0.4deg]' : 'rotate-[0.5deg]'

  if (project.featured) {
    return (
      <article className="group relative grid gap-8 p-6 sm:p-8 md:col-span-2 md:grid-cols-[1.25fr_1fr]">
        <SketchBorder filled className="drop-shadow-sm" />
        <div className="relative">
          <Tape className="-top-3 -left-4 -rotate-12" />
          <Link
            to={`/projects/${project.slug}`}
            className="relative flex aspect-video items-center justify-center"
            aria-label={`Open ${project.title}`}
          >
            <span className="sketch-hatch sketch-clip absolute inset-0 bg-base-200" />
            <SketchBorder variant={1} />
            <ProjectArt
              art={project.art}
              className="absolute w-3/5 text-base-content/25"
              draw="none"
            />
            <PlayMark />
            <span className="absolute bottom-3 font-scrawl text-xl text-base-content/60">
              {project.video ? 'watch the demo' : 'demo video coming soon'}
            </span>
          </Link>
        </div>
        <div className="relative flex flex-col">
          <p className="font-scrawl text-2xl text-primary">{project.note}</p>
          <h3 className="font-hand text-3xl leading-tight font-extrabold">
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="mt-4 leading-relaxed text-base-content/75">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-3">
            {project.tags.map((tag) => (
              <CircledTag key={tag} label={tag} />
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`group relative flex flex-col p-6 transition-transform duration-300 hover:rotate-0 ${tilt}`}
    >
      <SketchBorder filled variant={index % 2 === 0 ? 0 : 1} className="drop-shadow-sm" />
      {project.thumbnail ? (
        <ProjectThumbnail src={project.thumbnail} alt={`${project.title} screenshot`} />
      ) : (
        <div className="relative flex aspect-video items-center justify-center">
          <span className="sketch-hatch sketch-clip absolute inset-0 bg-base-200" />
          <SketchBorder variant={1} className="text-base-content/50" />
          <ProjectArt
            art={project.art}
            className="relative h-24 w-auto max-w-[70%] transition-transform duration-300 group-hover:-rotate-3 sm:h-28"
          />
        </div>
      )}
      <p className="relative mt-5 font-scrawl text-xl text-primary">{project.note}</p>
      <h3 className="relative font-hand text-2xl leading-tight font-extrabold">
        {project.draft ? (
          project.title
        ) : (
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        )}
      </h3>
      <p className="relative mt-3 leading-relaxed text-base-content/75">{project.summary}</p>
      {project.tags.length > 0 && (
        <ul className="relative mt-4 flex flex-wrap gap-x-2 gap-y-3">
          {project.tags.map((tag) => (
            <CircledTag key={tag} label={tag} />
          ))}
        </ul>
      )}
      <div className="relative mt-auto pt-5">
        <ProjectLinks project={project} />
      </div>
    </article>
  )
}

export default ProjectCard
