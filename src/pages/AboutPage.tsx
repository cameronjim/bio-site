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
              I&apos;m a fourth-year Computer Engineering student-athlete at UBC (graduating May
              2028) and captain of the men&apos;s varsity tennis team. I&apos;m on co-op as a QA
              software engineer, writing performance, end-to-end and API tests, and last summer I
              was a software engineer at Sitewise Analytics.
            </p>
            <p>
              Outside of work I build things to learn: a Game Boy Color emulator and games for it,
              and a 1/10-scale race car that teaches itself to drive. Game development and robotics
              are what I&apos;m most excited about next.
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
