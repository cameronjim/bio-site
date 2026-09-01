import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import tennis2026 from '../assets/athletics/tennis-2026.jpg'
import tennis2024 from '../assets/athletics/tennis-2024.jpg'
import valorant2023 from '../assets/athletics/valorant-2023.jpg'
import feliks from '../assets/athletics/feliks.jpg'
import piedPiperLogo from '../assets/pied-piper-logo.png'
import spidermanLogo from '../assets/spiderman-logo.png'
import headshot from '../assets/headshot.jpeg'
import PiedPiperPlayer from './PiedPiperPlayer'
import { useTheme } from '../hooks/useTheme'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#athletics', label: 'Athletics' },
  { href: '#interests', label: 'Off the Clock' },
  { href: '#contact', label: 'Contact' },
]

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1))

// Highlight the nav link for whichever section the reader is currently in.
// Position-based (not IntersectionObserver) so it updates on every scroll and
// stays correct even as lazy-loaded images change the page height.
function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0])

  useEffect(() => {
    function update() {
      // At the very bottom, the last section is current even if its top never
      // scrolls past the activation line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(SECTION_IDS[SECTION_IDS.length - 1])
        return
      }
      // Current = the last section whose top has scrolled above the line just
      // below the sticky header.
      const line = 100
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return active
}

function Portfolio() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Athletics />
        <Interests />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  const active = useActiveSection()
  const theme = useTheme()
  const isPiedPiper = theme === 'piedpiper'
  const isSpiderman = theme === 'spiderman'
  const linkClass = (href: string) =>
    href === `#${active}` ? 'text-primary font-semibold' : ''

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
      <div className="navbar mx-auto max-w-3xl px-6">
        <div className="navbar-start gap-2">
          {isPiedPiper && <img src={piedPiperLogo} alt="Pied Piper" className="h-11 w-auto" />}
          {isSpiderman && (
            <img src={spidermanLogo} alt="Spider-Man" className="h-9 w-auto rounded-sm" />
          )}
          <a href="#about" className="text-lg font-semibold tracking-tight">
            Cameron Jim
          </a>
        </div>
        <div className="navbar-end gap-1">
          <ul className="menu menu-horizontal hidden gap-1 px-1 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={linkClass(link.href)}
                  aria-current={link.href === `#${active}` ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {isPiedPiper && <PiedPiperPlayer />}
          <ThemeToggle />
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-48 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass(link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>
  )
}

function Hero() {
  return (
    <section id="about" className="scroll-mt-20 py-16 sm:py-20">
      <div className="flex items-start gap-12 sm:gap-16">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Computer Engineer
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Cameron Jim
          </h1>
        </div>
        <img
          src={headshot}
          alt="Cameron Jim"
          className="-mt-8 h-32 w-32 flex-none rounded-lg border-2 border-base-300 object-cover sm:-mt-10 sm:h-40 sm:w-40"
        />
      </div>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
        Hi! I'm Cameron, a fourth-year Computer Engineering student-athlete at UBC (expected May 2028) and
        current Team Captain of the UBC Men's Varsity Tennis Team. I'm currently on co-op as a QA Software
        Engineer, where I write performance, E2E, and API tests. Last summer, I completed a 4 month co-op at 
        Sitewise Analytics as a Software Engineer.
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
        Outside of my co-op work, I have been building side projects to explore my interests, as well as learn 
        new technologies. Most recently I have been developing a gameboy color emulator written in C/C++, while 
        also developing games from scratch using gbdk-2020. Another of my favourite projects was building a physical 
        1/10 scale racing car, developing firmware for it, and teaching it to drive autonomously using reinforcement learning models.
        I am very passionate about both game development and robotics, and I am excited to explore opportunities in these areas.
      </p>
      <p className="mt-2 text-sm text-base-content/60">
        University of British Columbia &middot; Vancouver, BC
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#contact" className="btn btn-primary">
          Get in touch
        </a>
        <a
          href="https://www.linkedin.com/in/cameron-jim-037b992a6/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/cameronjim"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          GitHub
        </a>
        <a href="/resume.pdf" className="btn btn-outline" download>
          Résumé
        </a>
      </div>
    </section>
  )
}

function Experience() {
  const experiences = [
    {
      company: 'Ursa Care Ride',
      location: 'Vancouver, BC',
      role: 'Technical Co-founder',
      period: 'Present',
      highlights: [
        'Building a real-time ride dispatch platform for foster child transport, focusing on safety for children',
        'Developing a React + TypeScript front end, a Node.js + Express backend, and PostgreSQL database',
        'Designed a Hungarian-algorithm (Kuhn-Munkres) solver to optimize driver-to-request matching',
      ],
    },
    {
      company: 'British Columbia Maritime Employers Association (BCMEA)',
      location: 'Vancouver, BC',
      role: 'QA Software Engineer (Co-op)',
      period: 'May 2026 – Dec 2026',
      highlights: [
        'Built k6 load and performance testing suites to catch latency and throughput regressions',
        'Developed end-to-end Playwright test automation to validate key workflows for every release',
        'Built API test coverage in C# with NUnit to validate data integrity',
      ],
    },
    {
      company: 'Sitewise Analytics',
      location: 'Vancouver, BC',
      role: 'Software Engineer (Co-op)',
      period: 'May 2025 – Sept 2025',
      highlights: [
        'Developed complex features for an enterprise SaaS app in React and TypeScript',
        'Accelerated development with custom MCP servers for Figma, Playwright, and Vite',
        'Created a CI/CD pipeline, adding automatic PR builds, running tests, and deployments to production',
      ],
    },
    {
      company: 'Turing AI',
      location: 'Vancouver, BC (Remote)',
      role: 'ML Training Data Analyst ',
      period: 'Dec 2024 – Jan 2025',
      highlights: [
        "Team lead for CS and Physics teams, creating AP-level problems as training data for Gemini 2.5",
        'Benchmarked AI-generated responses against standards and generated analytic reports for Google',
      ],
    },
    {
      company: 'Richmond Country Club',
      location: 'Richmond, BC',
      role: 'Tennis Instructor (Part-Time)',
      period: 'Nov 2020 – Jun 2023',
      highlights: [
        'Coached beginner and intermediate students aged 4–13 on technique, fundamentals, and strategy',
        'Built lesson plans emphasizing teamwork, confidence, sportsmanship, and an inclusive environment',
      ],
    },
  ]

  return (
    <section id="experience" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Experience</SectionHeading>
      <div className="flex flex-col gap-5">
        {experiences.map((exp) => (
          <article
            key={exp.company}
            className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
          >
            <div className="card-body gap-4 p-6">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <div>
                  <h3 className="text-lg font-semibold">{exp.role}</h3>
                  <p className="text-sm text-base-content/70">
                    {exp.company} &middot; {exp.location}
                  </p>
                </div>
                <span className="text-sm text-base-content/60 sm:whitespace-nowrap">{exp.period}</span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-base-content/80 marker:text-base-content/30">
                {exp.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

type Project = {
  title: string
  description: string
  technologies: string[]
  repo?: string // GitHub URL — leave '' to hide the button
  demo?: string // live site or demo video URL (YouTube/Loom is fine) — leave '' to hide
  image?: string // screenshot/clip in public/, e.g. '/projects/nba.png' — leave '' to hide
  images?: { src: string; caption: string }[] // multiple screenshots, e.g. one per game
}

function Projects() {
  // To add a screenshot or clip: drop the file in public/projects/ and set `image`
  // to its path (e.g. '/projects/nba.png'). Set `repo`/`demo` to show link buttons.
  const projects: Project[] = [
    {
      title: 'Game Boy Emulator',
      repo: 'https://github.com/cameronjim/gameboy-emulator',
      demo: '',
      images: [
        { src: '/projects/gbemu/tetris.png', caption: 'Tetris' },
        { src: '/projects/gbemu/crossy-road.png', caption: 'Crossy Road' },
        { src: '/projects/gbemu/flappy-bird.png', caption: 'Flappy Bird' },
        { src: '/projects/gbemu/mario.png', caption: 'Super Mario Bros Deluxe' },
      ],
      description:
        'A Game Boy Color (DMG/CGB) emulator built from scratch in C/C++ compatible on Windows, MacOS, and Linux. This project implements a full CPU, PPU, APU, and cartridge mapper support (MBC1/3/5) for running real commercial ROMs. The emulator is verified by running the same test suites real emulator authors use - blargg, Mooneye, and the pixel-exact acid2 tests. I\'ve also written original games from scratch with gbdk-2020, including Tetris, Flappy Bird, Crossy Road, and Super Mario Bros Deluxe.',
      technologies: [
        'C, C++, CMake, SDL2, gbdk-2020',
        'Custom CPU/PPU/APU core, MBC1/3/5 cartridge support',
        'blargg, Mooneye, acid2 test suites',
      ],
    },
    {
      title: 'Physical Autonomous Racing Car',
      repo: 'https://github.com/cameronjim/fast-car',
      demo: '',
      image: '', // TODO: e.g. '/projects/fast-car.png'
      description:
        'A full-stack project spanning simulation and hardware. I built a custom 1/10-scale racing car with sensors, motors, a Jetson, and a chassis. I also wrote firmware for the microcontrollers. I trained SAC and PPO agents from scratch against the F1TENTH Gym for pure speed, upgrading an existing pure pursuit model I had. This model runs on a ROS 2 stack with an independent LiDAR safety layer for emergency braking.',
      technologies: [
        'Python, C++, C, ROS 2, F1TENTH Gym, NVIDIA Jetson',
        'PyTorch, SAC, PPO',
      ],
    },
    {
      title: 'NBA IQ',
      demo: 'https://nbaiq.cameronjim.com',
      repo: 'https://github.com/cameronjim/nba-iq',
      image: '', // TODO: e.g. '/projects/nba-iq.png'
      description:
        "A full-stack NBA fantasy analytics platform, built for reliable projections. A routine scraping pipeline feeds box scores, odds, stats, and injuries into Postgres, which is run through a 3 model LightGBM system. This large ML system is trained on 29 seasons of individual player performance, weight tuned for accuracy, and built specifically to outperform generic LLMs. In turn, an AI powered assistant reads a user's roster and suggestions to come up with the best possible trades and waiver moves.",
      technologies: [
        'Python, LightGBM, pandas',
        'React, TypeScript, Vite, Tailwind CSS, DaisyUI',
        'Node.js, Express, PostgreSQL, Neon',
        'AWS Lambda, API Gateway, S3, CloudFront, CI/CD',
        'Vitest, Playwright, pytest',
      ],
    },
    {
      title: 'rv32-core',
      repo: 'https://github.com/cameronjim/rv32-core',
      demo: '',
      image: '', // TODO: e.g. '/projects/rv32-core.png'
      description:
        'A RISC-V RV32I CPU designed from scratch in SystemVerilog and synthesized onto a Cyclone V FPGA (DE1-SoC). It is a real processor and runs real machine code on physical hardware in a 5 stage pipeline (fetch, decode, execute, memory, writeback). It implements the full RV32I instruction set as a single-cycle datapath, with memory-mapped I/O to the board\'s LEDs, displays, switches, and buttons.',
      technologies: [
        'SystemVerilog, Quartus Prime, Cyclone V FPGA',
        'Icarus Verilog, GTKWave'
      ],
    },
    {
      title: 'nullsh',
      repo: 'https://github.com/cameronjim/nullsh',
      demo: '',
      image: '', // TODO: e.g. '/projects/nullsh.png'
      description:
        'A Unix shell written in C17 with no dependencies, made for my own educational purposes. Its own lexer, parser, and executor have been implemented from scratch. The shell also has job control with process groups and signal handling, and a custom memory allocator that replaces malloc (first-fit/buddy). It also ships an ELF inspector, a CHIP-8 emulator, and a raw-socket packet monitor.',
      technologies: [
        'C17, GNU Make',
        'Custom allocator, job control, signal handling',
        'ELF parser, CHIP-8 emulator, packet decoder',
      ],
    },
    {
      title: 'Cubetimer',
      repo: 'https://github.com/cameronjim/tui-cube-timer',
      demo: '',
      image: '', // TODO: e.g. '/projects/cubetimer.png'
      description:
        'A speedcube timer that is built for speedcubing & engineers. It is written in Rust, with ratatui for the UI, WCA-style averages, a trend graph, and full csTimer import/export compatibility.',
      technologies: [
        'Rust, ratatui',
      ],
    },
    {
      title: 'Token-Gated Portfolio',
      repo: 'https://github.com/cameronjim/bio-site',
      description:
        'This website. It is a private, serverless portfolio where access is granted through unique, time-limited tokens, enabling privacy-respecting analytics. It runs on AWS Lambda, API Gateway, DynamoDB, and CloudFront, and written with React and TypeScript on the frontend. A CI/CD pipeline is triggered on merge to main through a GitHub Actions workflow that authenticates to AWS with OIDC credentials, updates the Lambda functions, syncs the front end to S3, and invalidates the CDN cache.',
      technologies: [
        'React, TypeScript, Vite, Tailwind CSS, DaisyUI',
        'AWS Lambda, API Gateway, DynamoDB, CloudFront, S3',
        'SAM, GitHub Actions, CI/CD, OIDC',
      ],
    },
  ]

  return (
    <section id="projects" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Projects</SectionHeading>
      <div className="flex flex-col gap-5">
        {projects.map((project) => (
          <article
            key={project.title}
            className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
          >
            <div className="card-body gap-3 p-6">
              <h3 className="card-title text-base">{project.title}</h3>
              {project.image && (
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                  className="w-full rounded-lg border border-base-300"
                />
              )}
              {project.images && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {project.images.map((img) => (
                    <div key={img.src}>
                      <img
                        src={img.src}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full rounded-lg border border-base-300"
                      />
                      <p className="mt-1.5 text-center text-xs text-base-content/60">{img.caption}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed text-base-content/70">{project.description}</p>
              <div className="mt-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                  Technologies
                </h4>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-base-content/70 marker:text-base-content/30">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
              {(project.demo || project.repo) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      Live demo
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  const skills: Record<string, string[]> = {
    Languages: ['C++', 'C', 'C#', 'Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'ARM Assembly', 'SystemVerilog', 'RISC-V Assembly', 'Rust'],
    Frontend: ['React', 'Redux Toolkit', 'Vite', 'HTML', 'CSS'],
    'Backend & Data': ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'DynamoDB'],
    'Robotics & ML': ['ROS 2', 'PyTorch', 'LightGBM', 'OpenCV', 'LiDAR'],
    'Testing & QA': ['Playwright', 'NUnit', 'Vitest', 'k6', 'BrowserStack', 'Postman', 'Apidog'],
    'Cloud & DevOps': ['AWS Lambda', 'API Gateway', 'S3', 'CloudFront', 'GitHub Actions', 'CI/CD', 'Docker'],
    'Embedded & Hardware': ['FPGA', 'RISC-V', 'Arduino', 'ModelSim', 'Quartus', 'GDB', 'Wireshark'],
    'Tools & Platforms': ['Git', 'Linux', 'NVIDIA Jetson', 'Figma', 'LaTeX'],
  }

  return (
    <section id="skills" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Technical Skills</SectionHeading>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-base-content/60">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span key={skill} className="badge badge-outline badge-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

type Team = {
  title: string
  subtitle: string
  description: string
  achievements: string[]
  link?: { href: string; label: string }
  photos?: { src: string; caption: string; w: number; h: number }[]
}

function Athletics() {
  const teams: Team[] = [
    {
      title: 'Tennis',
      subtitle: "Team Captain, UBC Men's Varsity Tennis Team",
      description:
        "I am the current team captain for the UBC Men's Tennis team and compete in both singles and doubles. I have been a competitive tennis player since I was 9 years old - training almost every day for close to 12 years now. This sport has changed my life in so many ways, but most importantly it has shaped how I approach problem solving. Singles has taught me how to adapt, think independently, and stay composed - while doubles has taught me how to communicate, trust my teammates, and put the group's success above all else.",
      achievements: [
        '2026 USPORTS National Champion',
        '2024 USPORTS National Champion',
        'Former top-9 ranked player in Canada',
        'Current 10 UTR & 15.9 WTN',
        'High-school team captain (2021–2023)',
        '2023 AAA BC Provincial Champion',
        '2022 AA BC Provincial Champion',
      ],
      photos: [
        { src: tennis2026, caption: 'U SPORTS national champions (2026)', w: 1600, h: 2000 },
        { src: tennis2024, caption: 'U SPORTS national champions (2024)', w: 1124, h: 1500 },
      ],
    },
    {
      title: 'Valorant',
      subtitle: 'Team Captain, In-Game Leader (IGL)',
      description:
        "I have been playing video games my whole life. Just like tennis, it has taught me more than most people would expect. Competitive gaming demands fast decision-making under pressure, clear communication, and the ability to adapt. As a team captain, I learned how to lead through chaos, keep teammates focused, and make split-second calls. I captained my high-school Valorant team for 2 years, leading to squad to back-to-back provincial titles and earning MVP in both. ",
      achievements: [
        'High-school team captain (2021–2023)',
        '2023 SEABC Provincial Champion (MVP)',
        '2023 NEVL Provincial Champion (MVP)',
        '2026 UBC tournament champion',
        'Former top-600 player in North America',
      ],
      photos: [
        { src: valorant2023, caption: 'First provincial title with my high-school team (2023)', w: 1600, h: 1200 },
      ],
    },
    {
      title: 'Speedcubing',
      subtitle: 'WCA Competitor',
      description:
        "I first picked up a Rubik's Cube about 10 years ago and quickly fell down the rabbit hole. Competitive speedcubing has taught me pattern recognition, staying composed, and memorization skills. Every solve is its own little puzzle where you have to recognize the state, choose a plan, and commit to it. I've competed in 7 official WCA competitions over the years and have a best of 8.16 seconds.",
      achievements: [
        'Sub-10 solver - best of 4.xx',
        'WCA 3x3 PB: 8.16s single, 10.33s average',
        'WCA 2x2 PB: 1.93s single, 3.67s average',
        '7 official WCA competitions, 135 completed solves',
        'Former top 6 in BC for 3x3'
      ],
      link: { href: 'https://www.worldcubeassociation.org/persons/2018JIMC01', label: 'WCA profile' },
      photos: [
        { src: feliks, caption: 'Meeting Feliks Zemdegs, the Roger Federer of speedcubing (2018)', w: 1600, h: 2133 },
      ],
    },
  ]

  return (
    <section id="athletics" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Athletics &amp; Competition</SectionHeading>
      <div className="flex flex-col gap-5">
        {teams.map((team) => (
          <article key={team.title} className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3 p-6">
              <h3 className="text-lg font-semibold">{team.title}</h3>
              <p className="text-sm font-medium text-primary">{team.subtitle}</p>
              <p className="text-sm leading-relaxed text-base-content/80">{team.description}</p>
              {team.photos && (
                <div className={team.photos.length > 1 ? 'grid items-start gap-4 sm:grid-cols-2' : 'mx-auto sm:max-w-md'}>
                  {team.photos.map((photo) => (
                    <div key={photo.src}>
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        width={photo.w}
                        height={photo.h}
                        loading="lazy"
                        className="block h-auto w-full rounded-lg border border-base-300"
                      />
                      <p className="mt-1.5 text-center text-xs text-base-content/60">
                        {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="mt-1 list-disc space-y-2 pl-5 text-sm leading-relaxed text-base-content/80 marker:text-base-content/30">
                {team.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {team.link && (
                <a
                  href={team.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover mt-1 w-fit text-sm font-medium text-primary"
                >
                  {team.link.label} →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Interests() {
  return (
    <section id="interests" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Off the Clock</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        <article className="card border border-base-300 bg-base-100">
          <div className="card-body gap-3 p-6">
            <h3 className="text-lg font-semibold">What I Watch</h3>
            <p className="text-sm leading-relaxed text-base-content/80">
              I'm a big fan of action, comedy, anime, and K-dramas. Silicon Valley is my all-time
              favourite. I first watched it in grade 10 and it's a big reason I got into software
              engineering. I've rewatched the whole show probably over 15 times. Besides that, my 
              favourite movies have to be the Spider-Man films. They really hit home for me as someone
              who has spent their whole life living as 2 people: a student and an athlete. Peter, although fake,
              is someone who I really look up to and strive to be like every day.
            </p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100">
          <div className="card-body gap-3 p-6">
            <h3 className="text-lg font-semibold">What I Cook</h3>
            <p className="text-sm leading-relaxed text-base-content/80">
              As a half Chinese, half Korean, I spend a lot of time in the kitchen and tend to gravitate toward Asian cuisine.
              Cooking is one of those things I do for comfort rather than survival, and it calms me down. You can often
              find me cooking braised meats, or variations of (air) fried chicken. I absolutely love baking too,
              but I try not to because I would eat everything I make.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Get in Touch</SectionHeading>
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-6 p-6 sm:p-8">
          <p className="max-w-2xl leading-relaxed text-base-content/80">
            I'm actively seeking co-op and internship opportunities for 2027–2028. I'm always open for
            a chat!
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Email</dt>
              <dd className="mt-1">
                <a href="mailto:cjim02@student.ubc.ca" className="link link-hover text-primary">
                  cjim02@student.ubc.ca
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Phone</dt>
              <dd className="mt-1 text-base-content/80">604-352-0653</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Location</dt>
              <dd className="mt-1 text-base-content/80">Vancouver, BC</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:cjim02@student.ubc.ca" className="btn btn-primary">
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/cameron-jim-037b992a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/cameronjim"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              GitHub
            </a>
            <a href="/resume.pdf" className="btn btn-outline" download>
              Résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer footer-center border-t border-base-300 bg-base-100 p-6 text-base-content/60">
      <aside>
        <p className="text-sm">© {new Date().getFullYear()} Cameron Jim</p>
      </aside>
    </footer>
  )
}

export default Portfolio
