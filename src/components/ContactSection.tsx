import SketchBorder from './sketch/SketchBorder'
import SketchButton from './sketch/SketchButton'
import Tape from './sketch/Tape'

const EMAIL = 'cameroncjim@gmail.com'

function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 pb-24">
      <div className="relative -rotate-1 px-7 py-12 text-center sm:px-12">
        <SketchBorder filled className="drop-shadow-md" />
        <Tape className="-top-3 left-8 -rotate-12" />
        <Tape className="-top-3 right-8 rotate-12" />
        <p className="relative font-scrawl text-3xl text-primary">so, say hi!</p>
        <h2 className="relative mt-1 font-hand text-4xl font-extrabold tracking-tight sm:text-5xl">
          Let&apos;s talk
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-lg leading-relaxed text-base-content/75">
          I&apos;m looking for co-op and internship opportunities for 2027–2028, especially in
          game development and robotics. I&apos;m always open for a chat!
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="relative mt-6 inline-block font-hand text-xl font-semibold break-all decoration-primary decoration-wavy underline-offset-4 hover:underline sm:text-2xl"
        >
          {EMAIL}
        </a>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <SketchButton href={`mailto:${EMAIL}`} primary>
            email me
          </SketchButton>
          <SketchButton href="https://www.linkedin.com/in/cameron-jim-037b992a6/" external>
            linkedin
          </SketchButton>
          <SketchButton href="https://github.com/cameronjim" external>
            github
          </SketchButton>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
