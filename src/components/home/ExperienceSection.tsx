import SectionHeading from '../sketch/SectionHeading'

interface Job {
  company: string
  location: string
  role: string
  period: string
  stack: string[]
  highlights: string[]
}

const JOBS: Job[] = [
  {
    company: 'Ursa Care Ride',
    location: 'Vancouver, BC',
    role: 'Technical Cofounder',
    period: 'now',
    stack: ['React', 'React Native', 'AWS'],
    highlights: [
      'Sole engineer on a full-stack transport platform for foster children, with a live web beta and a mobile app in prototype',
      'Built with security and privacy in mind, since it holds sensitive data and is being piloted with government workers',
      'Close to launching on the App Store and getting a government pilot license',
    ],
  },
  {
    company: 'BC Maritime Employers Association',
    location: 'Vancouver, BC',
    role: 'QA Software Engineer (Co-op)',
    period: 'May – Dec 2026',
    stack: ['k6', 'Playwright', 'C#', 'JavaScript'],
    highlights: [
      'Built k6 performance testing suites to catch latency and throughput regressions before they reach production',
      'Developed E2E Playwright automation covering critical B2B workflows and regression scenarios',
      'Built REST API test suites in C# with NUnit for validating endpoint logic',
    ],
  },
  {
    company: 'Sitewise Analytics',
    location: 'Vancouver, BC',
    role: 'Software Engineer (Co-op)',
    period: 'May – Sept 2025',
    stack: ['React', 'TypeScript', 'Redux Toolkit'],
    highlights: [
      'Shipped features for an enterprise B2B SaaS application in React and TypeScript, wiring backend APIs to the Google Maps API for geospatial visualizations',
      'Migrated the front-end build to CI/CD with automatic PR builds, preview deploys, and coverage checks',
    ],
  },
  {
    company: 'Turing AI',
    location: 'Remote',
    role: 'STEM Annotator Internship (Google)',
    period: 'Dec 2024 – Jan 2025',
    stack: [],
    highlights: [
      'Led CS and Physics teams writing and verifying AP-level problems for training and validation datasets',
      'Benchmarked AI responses across models with rubric-based comparisons, reporting failure modes to guide iteration',
    ],
  },
  {
    company: 'Richmond Country Club',
    location: 'Richmond, BC',
    role: 'Tennis Instructor (Part-time)',
    period: 'Nov 2020 – Jun 2023',
    stack: [],
    highlights: [
      'Coached beginner and intermediate students aged 4–13 on technique, fundamentals, and match play',
    ],
  },
]

interface ExperienceSectionProps {
  level?: 1 | 2
}

// A hand-drawn timeline: dates in red pencil in the margin, a wavering pen
// line down the middle and a circled dot for each job.
function ExperienceSection({ level = 2 }: ExperienceSectionProps) {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="where I've worked" level={level}>Experience</SectionHeading>
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
              {job.stack.length > 0 && (
                <p className="mt-1 font-hand text-sm text-primary/80">{job.stack.join(' · ')}</p>
              )}
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
