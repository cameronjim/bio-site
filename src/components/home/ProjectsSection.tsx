import { Link } from 'react-router-dom'
import { PROJECTS } from '../../config/projects'
import SectionHeading from '../sketch/SectionHeading'
import ProjectCard from '../ProjectCard'

interface ProjectsSectionProps {
  // Show only these projects, in this order (the home page's picks).
  slugs?: string[]
  level?: 1 | 2
  note?: string
  title?: string
}

function ProjectsSection({
  slugs,
  level = 2,
  note = "things I've built",
  title = 'Projects',
}: ProjectsSectionProps) {
  const projects = slugs
    ? slugs.flatMap((slug) => PROJECTS.filter((project) => project.slug === slug))
    : PROJECTS
  const hidden = PROJECTS.length - projects.length

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note={note} level={level}>
        {title}
      </SectionHeading>
      <div className="grid gap-10 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
      {hidden > 0 && (
        <Link
          to="/projects"
          className="mt-12 inline-block font-hand text-xl font-semibold text-primary decoration-wavy underline-offset-4 hover:underline"
        >
          see all {PROJECTS.length} projects →
        </Link>
      )}
    </section>
  )
}

export default ProjectsSection
