import SiteLayout from '../components/sketch/SiteLayout'
import ExperienceSection from '../components/home/ExperienceSection'
import SkillsSection from '../components/home/SkillsSection'

function ExperiencePage() {
  return (
    <SiteLayout title="Experience">
      <div className="pt-12">
        <ExperienceSection level={1} />
        <SkillsSection />
      </div>
    </SiteLayout>
  )
}

export default ExperiencePage
