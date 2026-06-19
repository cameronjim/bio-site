import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import tennis2026 from '../assets/athletics/tennis-2026.jpg'
import tennis2024 from '../assets/athletics/tennis-2024.jpg'
import valorant2023 from '../assets/athletics/valorant-2023.jpg'
import feliks from '../assets/athletics/feliks.jpg'
import piedPiperLogo from '../assets/pied-piper-logo.png'
import PiedPiperPlayer from './PiedPiperPlayer'

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
  const linkClass = (href: string) =>
    href === `#${active}` ? 'text-primary font-semibold' : ''

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
      <div className="navbar mx-auto max-w-3xl px-6">
        <div className="navbar-start gap-2">
          <img src={piedPiperLogo} alt="Pied Piper" className="h-11 w-auto" />
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
          <PiedPiperPlayer />
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
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
        Software Engineer
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Cameron Jim
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
        Hi! I'm Cameron, a fourth-year Computer Engineering student at UBC (expected May 2028) and
        Team Captain of the UBC Men's Varsity Tennis Team. I'm currently on co-op as a QA Software
        Engineer, where I write Playwright JavaScript for e2e test automation, build API test suites
        with C# and NUnit, and write SQL queries for data verification, all within an Agile
        environment. Previously, I completed a co-op at Sitewise Analytics building scalable
        enterprise application features with React and TypeScript.
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
        Outside of my co-op work, I've been building hands-on experience in robotics and autonomous
        systems. I recently developed a self-driving car using both reactive control algorithms and a
        reinforcement learning agent trained to navigate autonomously. I'm passionate about this space
        and actively seeking my next co-op in a robotics-focused software engineering role.
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
      company: 'British Columbia Maritime Employers Association (BCMEA)',
      location: 'Vancouver, BC',
      role: 'QA Software Engineer (Co-op)',
      period: 'May 2026 – Dec 2026',
      highlights: [
        'Developed end-to-end test automation suites in Playwright JavaScript, improving regression coverage across critical B2B workflows',
        'Built and maintained API test automation using C# and NUnit, validating RESTful endpoints alongside manual Postman testing for exploratory and edge-case scenarios',
        'Wrote SQL queries against production and test databases to verify data integrity, trace defects, and validate backend logic independently of the UI',
        'Performed cross-browser and cross-platform validation using BrowserStack, ensuring consistent behavior across devices and environments',
        'Collaborated with developers in an Agile environment with established code review processes, Git workflows, and sprint ceremonies',
      ],
    },
    {
      company: 'Sitewise Analytics',
      location: 'Vancouver, BC',
      role: 'Software Engineer (Co-op)',
      period: 'May 2025 – Sept 2025',
      highlights: [
        'Developed scalable features for an enterprise SaaS application using React, TypeScript, Redux Toolkit (RTK Query), and Vite',
        'Built data-driven UI components connecting backend API services with the Google Maps API for dynamic visualizations',
        'Leveraged custom MCP servers, Figma, and Playwright to streamline development workflows',
        'Collaborated in an agile environment following established code review processes and Git workflows',
        'Helped migrate the front-end build to a CI/CD workflow, enabling automatic PR builds, previews, and coverage checks',
      ],
    },
    {
      company: 'Turing AI (Google)',
      location: 'Vancouver, BC (Remote)',
      role: 'STEM Annotator',
      period: 'Dec 2024 – Jan 2025',
      highlights: [
        "Led Computer Science and Physics teams to create and verify AP-level problems for training Google's AI model, contributing to what is now Gemini 2.5",
        'Matched AI-generated responses against multiple models and collected comparative data from Gemini and other AI systems',
        'Created detailed analytical reports sent directly to Google for model-improvement insights',
      ],
    },
    {
      company: 'Richmond Country Club',
      location: 'Richmond, BC',
      role: 'Tennis Instructor (Part-Time)',
      period: 'Nov 2020 – Jun 2023',
      highlights: [
        'Coached beginner and intermediate students aged 4–13, teaching proper technique, game fundamentals, and strategic thinking',
        'Developed engaging lesson plans that inspired young athletes to build confidence and sportsmanship',
        'Emphasized teamwork, leadership, and communication through structured activities and positive reinforcement',
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
}

function Projects() {
  // To add a screenshot or clip: drop the file in public/projects/ and set `image`
  // to its path (e.g. '/projects/nba.png'). Set `repo`/`demo` to show link buttons.
  const projects: Project[] = [
    {
      title: 'NBA Stats & Fantasy Trade Analyzer',
      demo: 'https://fantasy-nba.cameronjim.com',
      repo: '', // TODO: add the GitHub repo URL
      image: '', // TODO: e.g. '/projects/nba.png'
      description:
        'A production-deployed full-stack NBA fantasy and analytics platform built end-to-end as a solo developer. Users can track live scores, manage a fantasy roster, receive AI-powered team analysis and trade suggestions via the Anthropic Claude API, and log sports bets with real-time odds. The app runs on a serverless AWS stack with a fully automated two-environment CI/CD pipeline, OIDC-federated deploys, and 200+ automated tests across every layer.',
      technologies: [
        'React 18, TypeScript (strict), Vite 6, Tailwind CSS 4, DaisyUI 5, React Router 7, Axios, Google OAuth, lucide-react',
        'Node.js 22, Express 4, serverless-http, JWT, bcrypt, Helmet, Anthropic Claude SDK, Google Auth Library, AWS SDK v3 (SES)',
        'PostgreSQL (Neon serverless), hand-written schema with sequential migrations',
        'Python, Scrapy, nba_api, BeautifulSoup, psycopg2',
        'AWS Lambda, API Gateway, S3, CloudFront, SES, IAM (OIDC federation), Serverless Framework v3 (CloudFormation)',
        'GitHub Actions (CI/CD, scheduled cron)',
        'Vitest, Supertest, React Testing Library, Playwright (Page Object Model)',
      ],
    },
    {
      title: 'F1TENTH Autonomous Driving',
      repo: 'https://github.com/cameronjim/f1tenth-autonomous-racing',
      demo: '', // TODO: add a driving demo video URL (YouTube/Loom)
      image: '', // TODO: e.g. '/projects/f1tenth.png'
      description:
        'An autonomous driving software stack for the F1TENTH 1/10-scale race car, built in ROS 2 and runnable in both simulation and on the physical car. The project implements and compares two complete driving approaches: classical reactive controllers (wall following, gap following, vision-based lane following) and a learning-based controller trained with behavioural cloning and then fine-tuned with Soft Actor-Critic reinforcement learning. Both share an independent LiDAR-based safety layer for automatic emergency braking, allowing driving policies to be swapped or retrained without compromising collision avoidance.',
      technologies: [
        'ROS 2 (ament_python, nodes, topics, parameters, launch files), F1TENTH Gym simulator',
        'Linux/Ubuntu, Docker, NVIDIA Jetson, SSH',
        'LiDAR (LaserScan), RGB camera (Image), odometry, Ackermann drive',
        'PID control, LiDAR gap-following with disparity extension, wall following (two-ray geometry), automatic emergency braking (TTC)',
        'OpenCV, cv_bridge (grayscale, morphological filtering, thresholding, contour detection)',
        'PyTorch, behavioural cloning (MLP, MSE loss), Soft Actor-Critic RL (Gaussian policy, twin critics, automatic entropy tuning, replay buffer, Polyak target updates)',
        'BC-to-SAC warm starting, BC-regularized RL fine-tuning',
        'NumPy, pandas, ROS bag extraction, time synchronization, data augmentation',
      ],
    },
    {
      title: 'Token-Gated Portfolio',
      repo: 'https://github.com/cameronjim/bio-site',
      description:
        'This site. A private, serverless portfolio where access is granted through unique, time-limited tokens, enabling privacy-respecting analytics without invasive tracking. It runs on AWS Lambda, API Gateway, DynamoDB, and CloudFront, with React and TypeScript on the front end. Every merge to main deploys automatically through a GitHub Actions CI/CD pipeline that authenticates to AWS with short-lived OIDC-federated credentials, updates the Lambda functions, syncs the front end to S3, and invalidates the CDN cache.',
      technologies: [
        'React, TypeScript, Vite, Tailwind CSS, DaisyUI',
        'AWS Lambda, API Gateway, DynamoDB, CloudFront, S3',
        'SAM / CloudFormation, GitHub Actions CI/CD, OIDC-federated deploys',
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
    Languages: ['C++', 'C', 'C#', 'Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'ARM Assembly', 'Verilog'],
    Frontend: ['React', 'Redux Toolkit', 'Vite', 'HTML', 'CSS'],
    'Backend & Data': ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'DynamoDB'],
    'Robotics & ML': ['ROS 2', 'PyTorch', 'OpenCV', 'LiDAR'],
    'Testing & QA': ['Playwright', 'NUnit', 'Vitest', 'BrowserStack', 'Postman', 'Apidog'],
    'Cloud & DevOps': ['AWS Lambda', 'API Gateway', 'S3', 'CloudFront', 'GitHub Actions', 'CI/CD', 'Docker'],
    'Embedded & Hardware': ['Arduino', 'ModelSim', 'Quartus', 'GDB', 'Wireshark'],
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
        "I've been playing competitive tennis since I was nine years old, training almost every day for close to 12 years now. The sport has shaped how I approach problems: singles taught me to think independently, adapt on the fly, and stay composed under pressure, while doubles and team competition taught me how to communicate, trust my teammates, and put the group's success ahead of my own. I currently compete at the varsity level for UBC in both singles and doubles, and serve as Team Captain of the men's team. I joined the team in my first year of university back in 2023, and it's become like a family to me.",
      achievements: [
        '2026 USPORTS National Champion',
        '2025 USPORTS National Runner-up',
        '2024 USPORTS National Champion',
        'Former top-9 ranked player in Canada',
        'Current 10 UTR',
        'High-school team captain (2021–2023), leading the team to two provincial championships',
      ],
      photos: [
        { src: tennis2026, caption: 'U SPORTS national champions (2026)', w: 1600, h: 2000 },
        { src: tennis2024, caption: 'U SPORTS national champions (2024)', w: 1124, h: 1500 },
      ],
    },
    {
      title: 'Valorant',
      subtitle: 'Team Shot-Caller & In-Game Strategist',
      description:
        "I've been gaming for about 8 years now, and it's taught me more than most people would expect. Competitive gaming demands fast decision-making under pressure, clear communication with teammates, and the ability to adapt strategies in real time. As a team shot-caller, I learned how to lead through chaos, keep people focused, and make split-second calls that the whole team commits to. Some of my closest friendships came from gaming, and those relationships carried over into real competitive success. I captained my high-school Valorant team for two years, leading the squad to back-to-back provincial championships and earning tournament MVP in both. More recently, I teamed up with some friends to enter a UBC tournament where we took first place, beating the varsity UBC team in the process.",
      achievements: [
        'High-school team captain (2021–2023), two provincial championships with tournament MVP in both',
        '2026 UBC tournament champion',
        'Currently a top-1000 player in North America',
        'Team shot-caller and in-game strategist',
      ],
      photos: [
        { src: valorant2023, caption: 'First provincial title with my high-school team (2023)', w: 1600, h: 1200 },
      ],
    },
    {
      title: 'Speedcubing',
      subtitle: 'WCA Competitor',
      description:
        "I picked up a Rubik's Cube about 9 years ago and pretty quickly fell down the rabbit hole. There's something addictive about chasing a faster solve, and a lot of the skills overlap with what tennis drilled into me: pattern recognition, staying composed when it counts, and putting in the reps until something clicks. Every solve is its own little puzzle where you have to read the state, pick a plan, and commit without second-guessing yourself. I've competed in seven official WCA competitions over the years, and performing under tournament conditions with a judge watching and a timer running is its own kind of pressure that I've come to enjoy.",
      achievements: [
        'Consistent sub-10 solver; personal best of approximately 4 seconds',
        'WCA official personal best: 8.16s single, 10.33s average (3x3)',
        'WCA 2x2 personal best: 1.93s single, 3.67s average',
        '7 official WCA competitions, 135 completed solves',
        'Nationally ranked in Canada across multiple events',
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
              engineering (yes, the Pied Piper theme of this whole site is on purpose). I've rewatched
              it probably 15 times since. Beyond that, some of my go-to shows are Umbrella Academy,
              Brooklyn Nine-Nine, Blue Lock, While You Were Sleeping, and Hawkeye. For movies, I'll
              watch anything Spider-Man (especially the Spider-Verse films), and some of my favourites
              are Obsession, Memento, 21, and Endgame.
            </p>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100">
          <div className="card-body gap-3 p-6">
            <h3 className="text-lg font-semibold">What I Cook</h3>
            <p className="text-sm leading-relaxed text-base-content/80">
              I spend a lot of time in the kitchen and tend to gravitate toward Asian cooking,
              especially Chinese rice dishes with braised meats. I also love making Italian cream sauce
              pastas, and on the comfort food side I'm usually making things like beef stew, pan-fried
              chicken, or a good steak with a pan sauce. Cooking is one of those things I do for comfort
              rather than survival, and it calms me down.
            </p>
          </div>
        </article>
      </div>

      {/* Homage: the original "Pied Piper" the show's company is named after. */}
      <div className="card mt-5 border border-base-300 bg-base-100">
        <div className="card-body gap-3 p-6">
          <p className="text-sm text-base-content/70">
            The song behind it all: the original Pied Piper by Crispian St. Peters (1966).
          </p>
          <iframe
            title="The Pied Piper by Crispian St. Peters"
            src="https://open.spotify.com/embed/track/6H38Ea6neHRvw43XMn6MmM"
            className="w-full rounded-lg border-0"
            height="152"
            loading="lazy"
            allow="encrypted-media; clipboard-write"
          />
        </div>
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
