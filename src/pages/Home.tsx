import SiteLayout from '../components/sketch/SiteLayout'
import Hero from '../components/home/Hero'
import ProjectsSection from '../components/home/ProjectsSection'
import PlaySection from '../components/home/PlaySection'
import ExploreSection from '../components/home/ExploreSection'

const FEATURED_SLUGS = ['race-car', 'hawkeye', 'gameboy-emulator']

// The public home page: who I am, my top three projects (in order), the Game
// Boy, and a card for each other page. Token links (/t/:token, /:token) render
// this same page after validation, so every visitor sees one site.
function Home() {
  return (
    <SiteLayout>
      <Hero />
      <ProjectsSection slugs={FEATURED_SLUGS} note="the highlights" />
      <PlaySection />
      <ExploreSection />
    </SiteLayout>
  )
}

export default Home
