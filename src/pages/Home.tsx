import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SiteLayout from '../components/sketch/SiteLayout'
import Hero from '../components/home/Hero'
import ProjectsSection from '../components/home/ProjectsSection'
import PlaySection from '../components/home/PlaySection'
import ExperienceSection from '../components/home/ExperienceSection'
import SkillsSection from '../components/home/SkillsSection'
import AthleticsSection from '../components/home/AthleticsSection'
import InterestsSection from '../components/home/InterestsSection'
import ContactSection from '../components/home/ContactSection'

// Client-side navigation to "/#projects" (e.g. "← all projects") doesn't scroll
// by itself, so jump to the hash target once the page has rendered.
function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])
}

// The public home page. Token links (/t/:token, /:token) render this same page
// after validation, so every visitor sees one site.
function Home() {
  useScrollToHash()

  return (
    <SiteLayout home>
      <Hero />
      <ProjectsSection />
      <PlaySection />
      <ExperienceSection />
      <SkillsSection />
      <AthleticsSection />
      <InterestsSection />
      <ContactSection />
    </SiteLayout>
  )
}

export default Home
