import SectionHeading from '../sketch/SectionHeading'

interface Job {
  company: string
  location: string
  role: string
  period: string
  highlights: string[]
}

const JOBS: Job[] = [
  {
    company: 'Ursa Care Ride',
    location: 'Vancouver, BC',
    role: 'Technical Co-founder',
    period: 'now',
    highlights: [
      'Building a real-time ride dispatch platform for foster child transport, built around child safety',
      'React + TypeScript front end, Node.js + Express backend, PostgreSQL database',
      'Designed a Hungarian-algorithm (Kuhn-Munkres) solver to optimize driver-to-request matching',
    ],
  },
  {
    company: 'BC Maritime Employers Association',
    location: 'Vancouver, BC',
    role: 'QA Software Engineer (Co-op)',
    period: 'May – Dec 2026',
    highlights: [
      'Built k6 load and performance suites to catch latency and throughput regressions',
      'Developed end-to-end Playwright automation that validates key workflows every release',
      'Built API test coverage in C# with NUnit to validate data integrity',
    ],
  },
  {
    company: 'Sitewise Analytics',
    location: 'Vancouver, BC',
    role: 'Software Engineer (Co-op)',
    period: 'May – Sept 2025',
    highlights: [
      'Developed complex features for an enterprise SaaS app in React and TypeScript',
      'Accelerated development with custom MCP servers for Figma, Playwright and Vite',
      'Created a CI/CD pipeline with automatic PR builds, test runs and production deploys',
    ],
  },
  {
    company: 'Turing AI',
    location: 'Remote',
    role: 'ML Training Data Analyst',
    period: 'Dec 2024 – Jan 2025',
    highlights: [
      'Led the CS and Physics teams writing AP-level problems as training data for Gemini 2.5',
      'Benchmarked AI responses against standards and wrote analytic reports for Google',
    ],
  },
  {
    company: 'Richmond Country Club',
    location: 'Richmond, BC',
    role: 'Tennis Instructor (Part-time)',
    period: 'Nov 2020 – Jun 2023',
    highlights: [
      'Coached beginner and intermediate players aged 4–13 on technique, fundamentals and strategy',
      'Built lesson plans around teamwork, confidence, sportsmanship and an inclusive environment',
    ],
  },
]

// A hand-drawn timeline: dates in red pencil in the margin, a wavering pen
// line down the middle and a circled dot for each job.
function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="where I've worked">Experience</SectionHeading>
      <ol className="relative">
        <svg
          className="absolute top-2 bottom-2 left-[7px] h-[calc(100%-1rem)] w-3 text-base-content/40 md:left-[167px]"
          viewBox="0 0 12 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6 0 C 4 20, 8 40, 6 60 S 5 85, 6 100"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {JOBS.map((job) => (
          <li
            key={job.company}
            className="relative grid gap-2 pb-12 pl-10 last:pb-0 md:grid-cols-[150px_1fr] md:gap-12 md:pl-0"
          >
            <p className="font-scrawl text-2xl leading-tight text-primary md:pt-0.5 md:text-right">
              {job.period}
            </p>
            <svg
              className="ink-rough absolute top-1.5 left-0 w-[26px] text-primary md:left-[160px]"
              viewBox="0 0 26 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="13" cy="13" r="8" className="fill-base-200" />
              <circle cx="13" cy="13" r="3" className="fill-primary" stroke="none" />
            </svg>
            <div className="md:pl-6">
              <h3 className="font-hand text-2xl leading-tight font-extrabold">{job.role}</h3>
              <p className="mt-1 font-hand text-base-content/65">
                {job.company} · {job.location}
              </p>
              <ul className="mt-3 space-y-1.5 leading-relaxed text-base-content/75">
                {job.highlights.map((item) => (
                  <li key={item} className="relative pl-5">
                    <span className="absolute left-0 font-hand text-primary" aria-hidden="true">
                      –
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ExperienceSection
