import { PROJECTS } from '../../config/projects'
import SectionHeading from '../sketch/SectionHeading'
import ProjectCard from '../ProjectCard'

function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="things I've built">Projects</SectionHeading>
      <div className="grid gap-10 md:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
