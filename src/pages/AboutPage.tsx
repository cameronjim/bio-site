import SiteLayout from '../components/sketch/SiteLayout'
import SectionHeading from '../components/sketch/SectionHeading'
import AthleticsSection from '../components/home/AthleticsSection'
import InterestsSection from '../components/home/InterestsSection'

function AboutPage() {
  return (
    <SiteLayout title="About">
      <div className="pt-12">
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <SectionHeading note="the person behind the projects" level={1}>
            About me
          </SectionHeading>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-base-content/80">
            <p>
              Hi there! I&apos;m Cameron and I&apos;m a senior student-athlete at UBC studying
              Computer Engineering. I&apos;m proud to be the captain of the UBC Men&apos;s Tennis
              team! I&apos;m currently on co-op as a QA software engineer, writing performance,
              end-to-end, and API tests. I&apos;ll be heading back to school in January, but
              I&apos;m always looking for more internship and co-op experience!
            </p>
            <p>
              Outside of work and school, I love to build things for my own learning. Most recently
              I have been focused on further developing my fully autonomous 1/10-scale race car.
              I&apos;m constantly playing around with new algorithms, both reactive and learned
              (more focused on learned). I&apos;m also using a lot of my spare time building out a
              3D action game with Hawkeye as the main character. Some of my all time favourite
              games are the Insomniac Spider-Man ones, and it has really inspired me to try to
              develop my own gaming projects.
            </p>
            <p className="font-hand text-base-content/60">
              University of British Columbia · Vancouver, BC
            </p>
          </div>
        </section>
        <AthleticsSection />
        <InterestsSection />
      </div>
    </SiteLayout>
  )
}

export default AboutPage
