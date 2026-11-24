import SectionHeading from '../sketch/SectionHeading'
import SketchBorder from '../sketch/SketchBorder'
import TvDoodle from '../doodles/TvDoodle'
import PanDoodle from '../doodles/PanDoodle'

function InterestsSection() {
  return (
    <section id="interests" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="when I'm not building">Off the clock</SectionHeading>
      <div className="grid gap-10 md:grid-cols-2">
        <article className="relative -rotate-[0.5deg] p-7">
          <SketchBorder filled className="drop-shadow-sm" />
          <TvDoodle className="relative mb-4 w-20 text-base-content" />
          <h3 className="relative font-hand text-2xl font-extrabold">What I watch</h3>
          <p className="relative mt-3 leading-relaxed text-base-content/75">
            Action, comedy, anime and K-dramas. Silicon Valley is my all-time favourite; I first
            watched it in grade 10, it&apos;s a big reason I got into software engineering, and
            I&apos;ve rewatched it more than 15 times. The Spider-Man films hit home too, for
            someone who has always lived as two people: a student and an athlete.
          </p>
        </article>
        <article className="relative rotate-[0.6deg] p-7">
          <SketchBorder filled variant={1} className="drop-shadow-sm" />
          <PanDoodle className="relative mb-4 w-24 text-base-content" />
          <h3 className="relative font-hand text-2xl font-extrabold">What I cook</h3>
          <p className="relative mt-3 leading-relaxed text-base-content/75">
            Half Chinese, half Korean, so I gravitate toward Asian cooking. I cook for comfort
            more than survival, and it calms me down: braised meats, or some version of (air)
            fried chicken. I love baking too, but I try not to, because I would eat everything I
            make.
          </p>
        </article>
      </div>
    </section>
  )
}

export default InterestsSection
