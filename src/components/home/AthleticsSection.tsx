import tennis2026 from '../../assets/athletics/tennis-2026.jpg'
import tennis2024 from '../../assets/athletics/tennis-2024.jpg'
import valorant2023 from '../../assets/athletics/valorant-2023.jpg'
import feliks from '../../assets/athletics/feliks.jpg'
import SectionHeading from '../sketch/SectionHeading'
import Tape from '../sketch/Tape'

interface Photo {
  src: string
  caption: string
  w: number
  h: number
}

interface Sport {
  title: string
  role: string
  story: string
  wins: string[]
  link?: { href: string; label: string }
  photos: Photo[]
}

const SPORTS: Sport[] = [
  {
    title: 'Tennis',
    role: "Team captain, UBC men's varsity tennis",
    story:
      "I've played competitive tennis since I was 9, training almost every day for close to 12 years. I'm proud to be the team captain for the UBC Men's Tennis Team. We have formed a dynasty since I have been on the team, winning national titles in 2/3 years (2nd place 1/3 years). This team feels like a family and has taught me beyond the court: how to lead, how to communicate, and how to collaborate with a team with all different personalities and backgrounds.",
    wins: [
      '2026 U SPORTS national champion',
      '2024 U SPORTS national champion',
      'Former 9th ranked player in Canada',
      'Current 10 UTR · 15 WTN',
      '2023 AAA & 2022 AA BC provincial high school champion',
    ],
    photos: [
      { src: tennis2026, caption: 'national champs, 2026', w: 1600, h: 2000 },
      { src: tennis2024, caption: 'and again in 2024', w: 1124, h: 1500 },
    ],
  },
  {
    title: 'Valorant',
    role: 'Team captain, in-game leader',
    story:
      'I captained my high-school team for two years, leading the team to back-to-back provincial titles and earning MVP in both. I would say these teammates are some of the closest friends I have to this day.',
    wins: [
      '2023 SEABC provincial champion (MVP)',
      '2023 NEVL provincial champion (MVP)',
      '2026 UBC tournament champion',
      'Top-600 player in North America',
    ],
    photos: [{ src: valorant2023, caption: 'first provincial title, 2023', w: 1600, h: 1200 }],
  },
  {
    title: 'Speedcubing',
    role: 'WCA competitor',
    story:
      "I picked up a Rubik's Cube about 10 years ago and fell down the rabbit hole. I've competed in seven official WCA competitions so far, with a high of 6th place in BC, and have competed against world champions.",
    wins: [
      'WCA 3x3: 8.16s single, 10.33s average',
      'WCA 2x2: 1.93s single, 3.67s average',
      'Former top 6 in BC for 3x3',
    ],
    link: {
      href: 'https://www.worldcubeassociation.org/persons/2018JIMC01',
      label: 'WCA profile',
    },
    photos: [{ src: feliks, caption: 'meeting Feliks Zemdegs, 2018', w: 1600, h: 2133 }],
  },
]

const PHOTO_TILTS = ['-rotate-3', 'rotate-2', 'rotate-3', '-rotate-2']

interface PolaroidProps {
  photo: Photo
  tilt: string
}

function Polaroid({ photo, tilt }: PolaroidProps) {
  return (
    <figure className={`relative w-full max-w-[16rem] bg-base-100 p-3 shadow-md ${tilt}`}>
      <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
      <img
        src={photo.src}
        alt={photo.caption}
        width={photo.w}
        height={photo.h}
        loading="lazy"
        className="block aspect-[4/5] h-auto w-full object-cover"
      />
      <figcaption className="mt-2 text-center font-scrawl text-lg">{photo.caption}</figcaption>
    </figure>
  )
}

function Star() {
  return (
    <svg
      className="ink-rough absolute top-1 left-0 w-4 text-primary"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2 L12.4 7.4 L18 8 L13.8 11.8 L15 17.5 L10 14.6 L5 17.5 L6.2 11.8 L2 8 L7.6 7.4 Z" />
    </svg>
  )
}

interface AthleticsSectionProps {
  level?: 1 | 2
}

function AthleticsSection({ level = 2 }: AthleticsSectionProps) {
  return (
    <section id="athletics" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="off the keyboard" level={level}>Athletics</SectionHeading>
      <div className="flex flex-col gap-24">
        {SPORTS.map((sport, i) => (
          <article
            key={sport.title}
            className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            <div
              className={`flex justify-center gap-4 ${i % 2 === 1 ? 'md:order-last' : ''}`}
            >
              {sport.photos.map((photo, j) => (
                <Polaroid
                  key={photo.caption}
                  photo={photo}
                  tilt={PHOTO_TILTS[(i + j) % PHOTO_TILTS.length]}
                />
              ))}
            </div>
            <div>
              <h3 className="font-hand text-3xl font-extrabold">{sport.title}</h3>
              <p className="font-scrawl text-2xl text-primary">{sport.role}</p>
              <p className="mt-4 leading-relaxed text-base-content/75">{sport.story}</p>
              <ul className="mt-5 space-y-2 font-hand">
                {sport.wins.map((win) => (
                  <li key={win} className="relative pl-7">
                    <Star />
                    {win}
                  </li>
                ))}
              </ul>
              {sport.link && (
                <a
                  href={sport.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block font-hand font-semibold text-primary decoration-wavy underline-offset-4 hover:underline"
                >
                  {sport.link.label} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AthleticsSection
