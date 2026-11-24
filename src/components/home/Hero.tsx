import headshot from '../../assets/headshot.jpeg'
import SketchButton from '../sketch/SketchButton'
import HandArrow from '../sketch/HandArrow'
import Tape from '../sketch/Tape'
import GameBoyDoodle from '../doodles/GameBoyDoodle'
import RaceCarDoodle from '../doodles/RaceCarDoodle'
import TennisBallDoodle from '../doodles/TennisBallDoodle'

const LINK_CLASS = 'decoration-primary decoration-wavy underline-offset-4 hover:underline'

function HeroCollage() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md text-base-content sm:h-[480px]">
      <GameBoyDoodle draw="load" className="absolute top-2 left-0 w-24 -rotate-6 sm:w-28" />
      <p className="absolute top-[184px] left-0 w-28 -rotate-3 font-scrawl text-xl leading-tight text-primary sm:top-[220px] sm:w-36">
        I wrote an emulator for this (and four games for it)
      </p>
      <HandArrow
        className="draw-on absolute top-[150px] left-[88px] w-12 text-primary [--draw-delay:0.9s] sm:top-[170px] sm:left-[104px]"
        d="M20 90 C 30 60, 40 40, 30 12"
        head="M18 26 L 30 10 L 42 24"
      />
      <TennisBallDoodle
        draw="load"
        className="absolute -top-1 left-[33%] w-10 rotate-12 [--draw-delay:0.5s]"
      />
      <figure className="absolute top-8 right-0 w-40 rotate-3 bg-base-100 p-3 shadow-md sm:right-6 sm:w-56">
        <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-6" />
        <img src={headshot} alt="Cameron Jim" className="aspect-square w-full object-cover" />
        <figcaption className="mt-2 text-center font-scrawl text-lg sm:text-xl">
          UBC &apos;28 · tennis captain
        </figcaption>
      </figure>
      <RaceCarDoodle
        draw="load"
        className="absolute bottom-6 left-0 w-56 [--draw-delay:0.3s] sm:w-72"
      />
      <p className="absolute right-0 bottom-[140px] w-28 rotate-3 font-scrawl text-xl leading-tight text-primary sm:bottom-[84px] sm:w-36">
        I&apos;m teaching this to drive itself
      </p>
      <HandArrow
        className="draw-on absolute right-[128px] bottom-[124px] hidden w-11 text-primary [--draw-delay:1.2s] sm:block"
        d="M90 70 C 72 40, 50 30, 14 34"
        head="M28 20 L 12 34 L 28 48"
      />
    </div>
  )
}

function Hero() {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-5xl items-center gap-12 px-6 pt-8 pb-24 md:grid-cols-[1.1fr_1fr] md:pt-16"
    >
      <div>
        <p className="-rotate-2 font-scrawl text-3xl text-primary">hi, I&apos;m</p>
        <h1 className="mt-1 font-hand text-6xl leading-[0.95] font-extrabold tracking-tight sm:text-7xl">
          Cameron{' '}
          <span className="relative inline-block">
            <svg
              className="draw-on absolute -bottom-1 -left-[8%] h-1/2 w-[116%] text-secondary [--draw-delay:0.6s]"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path
                pathLength="1"
                d="M6 26 C 50 17, 120 31, 194 18"
                stroke="currentColor"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
            <span className="relative">Jim</span>
          </span>
        </h1>
        <p className="mt-6 font-hand text-xl text-base-content/80">
          UBC computer engineering · men&apos;s tennis captain
        </p>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-base-content/75">
          I&apos;m a fourth-year Computer Engineering student and the captain of the UBC
          Men&apos;s Tennis Team. Right now I&apos;m on co-op as a QA Software Engineer at the BC
          Maritime Employers Association, and I&apos;m also the technical cofounder of Ursa Care
          Ride, a transport platform for foster children that is close to launching on the App
          Store. Outside of school and work I build side projects to learn new things, and I am
          very passionate about both game development and robotics. Currently I am in the midst of
          expanding on my self-driving car and developing a 3D action game in Unreal Engine.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SketchButton href="#contact" primary>
            get in touch
          </SketchButton>
          <SketchButton href="/resume.pdf">résumé</SketchButton>
          <div className="flex gap-4 font-scrawl text-2xl">
            <a
              href="https://github.com/cameronjim"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              github
            </a>
            <a
              href="https://www.linkedin.com/in/cameron-jim-037b992a6/"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              linkedin
            </a>
          </div>
        </div>
      </div>
      <HeroCollage />
    </section>
  )
}

export default Hero
