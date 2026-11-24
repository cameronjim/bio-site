import SiteLayout from '../components/sketch/SiteLayout'
import ProjectsSection from '../components/home/ProjectsSection'

function ProjectsPage() {
  return (
    <SiteLayout title="Projects">
      <div className="pt-12">
        <ProjectsSection level={1} />
      </div>
    </SiteLayout>
  )
}

export default ProjectsPage
