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
            I watch movies and shows of all varieties: action, comedy, drama, and anime. My
            favourite show of all time is probably Silicon Valley, and it&apos;s a big reason of why
            I entered software/computer engineering. As for movies, I have been a huge Marvel fan
            my whole life, with Spider-Man being my favourite character. The newest one (Brand New
            Day) is very solid!
          </p>
        </article>
        <article className="relative rotate-[0.6deg] p-7">
          <SketchBorder filled variant={1} className="drop-shadow-sm" />
          <PanDoodle className="relative mb-4 w-24 text-base-content" />
          <h3 className="relative font-hand text-2xl font-extrabold">What I cook</h3>
          <p className="relative mt-3 leading-relaxed text-base-content/75">
            I&apos;m half Chinese and half Korean, so I gravitate towards Asian cooking. Lots of
            rice dishes, with meats that follow Chinese and Japanese cuisine mostly. But I still
            love cooking other cuisines as well. Unlike many of my peers, I really enjoy cooking and
            use it as a way to alleviate stress, rather than cause it. My favourite dishes to make
            are Hong Shao Rou (Chinese braised pork belly) and Vodka Parm Subs.
          </p>
        </article>
      </div>
    </section>
  )
}

export default InterestsSection
