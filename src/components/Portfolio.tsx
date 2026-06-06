import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#athletics', label: 'Athletics' },
  { href: '#contact', label: 'Contact' },
]

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
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-sm">
      <div className="navbar mx-auto max-w-3xl px-6">
        <div className="navbar-start">
          <a href="#about" className="text-lg font-semibold tracking-tight">
            Cameron Jim
          </a>
        </div>
        <div className="navbar-end gap-1">
          <ul className="menu menu-horizontal hidden gap-1 px-1 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
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
                  <a href={link.href}>{link.label}</a>
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
        Software Developer
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Cameron Jim
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
        Hi! I'm Cameron, a third-year Computer Engineering student at UBC (expected May 2028, including
        five co-op work terms) who enjoys problem solving and working through challenges. I recently
        completed a full co-op term at Sitewise Analytics, where I gained valuable experience building
        scalable enterprise applications with React and TypeScript.
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
          href="https://github.com/sardinebagel"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          GitHub
        </a>
      </div>
    </section>
  )
}

function Experience() {
  const experiences = [
    {
      company: 'Sitewise Analytics',
      location: 'Vancouver, BC',
      role: 'Software Developer (Co-op)',
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

function Projects() {
  const projects = [
    {
      title: 'Token-Gated Portfolio',
      description:
        'This site — a serverless architecture using AWS Lambda, API Gateway, DynamoDB, and CloudFront to create a private portfolio. Access requires a unique token for privacy-respecting analytics without invasive tracking.',
      tags: ['AWS Lambda', 'TypeScript', 'React', 'DynamoDB', 'CloudFront'],
    },
    {
      title: 'NBA Stats & Fantasy Trade Analyzer',
      description:
        'In-progress web application that analyzes NBA player statistics, trade values, and waiver-wire pickups for fantasy basketball. Features real-time data visualization and trade recommendations.',
      tags: ['React', 'TypeScript', 'SQL', 'In Progress'],
    },
    {
      title: 'JavaFX Desktop Application',
      description:
        'Collaborated in a team of five to build a multi-feature desktop app using JavaFX and SceneBuilder, focusing on intuitive UIs and a robust event-driven architecture.',
      tags: ['Java', 'JavaFX', 'SceneBuilder', 'Team Project'],
    },
  ]

  return (
    <section id="projects" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Projects</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
          >
            <div className="card-body gap-3 p-6">
              <h3 className="card-title text-base">{project.title}</h3>
              <p className="text-sm leading-relaxed text-base-content/70">{project.description}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="badge badge-soft badge-sm">
                    {tag}
                  </span>
                ))}
              </div>
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
    Frontend: ['React', 'Redux Toolkit', 'RTK Query', 'HTML', 'CSS', 'Vite'],
    'Backend & APIs': ['Node.js', 'Google Maps API', 'Apidog', 'Postman'],
    'Frameworks & Libraries': ['Scrapy', 'JavaFX', 'SceneBuilder'],
    'Tools & Platforms': ['Git', 'Linux', 'Ubuntu', 'GDB', 'MCP Servers', 'Playwright', 'Figma', 'ModelSim', 'Quartus', 'LaTeX', 'Arduino'],
    'Cloud & DevOps': ['AWS Lambda', 'AWS S3', 'AWS CloudFront', 'API Gateway', 'CI/CD', 'SAM CLI'],
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

function Athletics() {
  const teams = [
    {
      title: 'Tennis',
      subtitle: "UBC Men's Varsity Tennis Team",
      achievements: [
        'Currently competing at the varsity level for UBC in both singles and doubles',
        'UBC was the Canadian champion in 2024 and runner-up in 2025',
        'Former top-9 player in Canada',
        '12 years of competitive experience',
        'High-school team captain (2021–2023); led the team to two provincial championships',
      ],
    },
    {
      title: 'Valorant Esports',
      subtitle: 'High-School Team Captain',
      achievements: [
        'High-school team captain (2021–2023)',
        'Led the team to two provincial championships, earning MVP in both tournaments',
        'Currently a top-1000 player in North America',
        'Team shot-caller and strategist',
      ],
    },
  ]

  return (
    <section id="athletics" className="scroll-mt-20 border-t border-base-300 py-16">
      <SectionHeading>Athletics &amp; Competitive Gaming</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        {teams.map((team) => (
          <article key={team.title} className="card border border-base-300 bg-base-100">
            <div className="card-body gap-3 p-6">
              <h3 className="text-lg font-semibold">{team.title}</h3>
              <p className="text-sm font-medium text-primary">{team.subtitle}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-base-content/80 marker:text-base-content/30">
                {team.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
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
            I'm actively seeking co-op and internship opportunities for 2026–2027. Feel free to reach
            out if you'd like to work together.
          </p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Email</dt>
              <dd className="mt-1">
                <a href="mailto:cameroncjim@gmail.com" className="link link-hover text-primary">
                  cameroncjim@gmail.com
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
            <a href="mailto:cameroncjim@gmail.com" className="btn btn-primary">
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
              href="https://github.com/sardinebagel"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              GitHub
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
