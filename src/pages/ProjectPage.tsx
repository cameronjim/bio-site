import { Link, useParams } from 'react-router-dom'
import { PROJECTS, findProject } from '../config/projects'
import SiteLayout from '../components/sketch/SiteLayout'
import SketchBorder from '../components/sketch/SketchBorder'
import SketchButton from '../components/sketch/SketchButton'
import CircledTag from '../components/sketch/CircledTag'
import Tape from '../components/sketch/Tape'
import ProjectArt from '../components/ProjectArt'

const LINK_CLASS = 'decoration-wavy underline-offset-4 hover:underline'

// One page per project at /projects/:slug — the link to send someone for a
// demo: video up top, then the write-up, stack and links.
function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = findProject(slug)

  if (!project) {
    return (
      <SiteLayout title="Not found">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="font-scrawl text-3xl text-primary">hmm…</p>
          <h1 className="font-hand text-4xl font-extrabold">That project isn&apos;t here</h1>
          <Link to="/" className={`mt-6 inline-block font-hand text-lg text-primary ${LINK_CLASS}`}>
            ← back to the notebook
          </Link>
        </section>
      </SiteLayout>
    )
  }

  const index = PROJECTS.indexOf(project)
  const next = PROJECTS.slice(index + 1).concat(PROJECTS.slice(0, index)).find((p) => !p.draft)

  return (
    <SiteLayout title={project.title}>
      <article className="mx-auto max-w-4xl px-6 pt-10 pb-24">
        <Link to="/projects" className={`font-hand text-base-content/70 ${LINK_CLASS}`}>
          ← all projects
        </Link>
        <header className="mt-6 flex items-end justify-between gap-6">
          <div>
            <p className="font-scrawl text-3xl text-primary">{project.note}</p>
            <h1 className="font-hand text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
              {project.title}
            </h1>
          </div>
          <ProjectArt
            art={project.art}
            draw="load"
            className="hidden h-24 w-auto shrink-0 -rotate-6 text-base-content sm:block"
          />
        </header>

        <div className="relative mt-10">
          <Tape className="-top-3 -left-3 -rotate-12" />
          <Tape className="-top-3 -right-3 rotate-12" />
          {project.video ? (
            <div className="relative bg-base-100 p-3">
              <SketchBorder />
              <video
                className="relative aspect-video w-full bg-neutral"
                src={project.video}
                poster={project.poster}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          ) : (
            <div className="relative flex aspect-video flex-col items-center justify-center gap-4">
              <span className="sketch-hatch sketch-clip absolute inset-0 bg-base-100" />
              <SketchBorder />
              <ProjectArt
                art={project.art}
                className="relative h-1/3 w-auto text-base-content/40"
              />
              <p className="relative font-scrawl text-2xl text-base-content/60">
                demo video coming soon
              </p>
            </div>
          )}
        </div>

        {project.screenshots && (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {project.screenshots.map((shot, i) => (
              <figure
                key={shot.src}
                className={`bg-base-100 p-2 shadow-sm ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}
              >
                <img
                  src={shot.src}
                  alt={shot.caption}
                  loading="lazy"
                  className="w-full [image-rendering:pixelated]"
                />
                <figcaption className="mt-1 text-center font-scrawl text-lg">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-14 grid gap-12 md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-base-content/80">
            {project.writeup.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {project.stack.length > 0 && (
            <aside className="relative rotate-1 self-start bg-secondary/25 p-6 shadow-sm">
              <Tape className="-top-3 left-1/2 w-16 -translate-x-1/2" />
              <h2 className="font-hand text-xl font-extrabold">Built with</h2>
              <ul className="mt-3 space-y-2 font-hand text-base-content/80">
                {project.stack.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        {project.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-x-2 gap-y-3">
            {project.tags.map((tag) => (
              <CircledTag key={tag} label={tag} />
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          {project.live && (
            <SketchButton href={project.live} primary>
              {project.liveLabel ?? 'live'} ↗
            </SketchButton>
          )}
          {project.repo && (
            <SketchButton href={project.repo} external>
              view the code ↗
            </SketchButton>
          )}
        </div>

        {next && (
          <Link
            to={`/projects/${next.slug}`}
            className="group mt-20 flex items-center justify-end gap-4 text-right"
          >
            <div>
              <p className="font-scrawl text-xl text-primary">next up</p>
              <p className={`font-hand text-2xl font-extrabold ${LINK_CLASS} group-hover:underline`}>
                {next.title} →
              </p>
            </div>
            <ProjectArt art={next.art} draw="none" className="h-14 w-auto text-base-content" />
          </Link>
        )}
      </article>
    </SiteLayout>
  )
}

export default ProjectPage
