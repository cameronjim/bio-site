import SectionHeading from '../sketch/SectionHeading'
import Tape from '../sketch/Tape'

// Trimmed to what I'm most comfortable with (matches the résumé).
const SKILLS: Record<string, string[]> = {
  Languages: ['Java', 'C#', 'C++', 'C', 'Python', 'SystemVerilog', 'JavaScript', 'SQL'],
  'Robotics & ML': ['ROS 2', 'PyTorch'],
  'Cloud & data': ['AWS', 'PostgreSQL'],
  'Tools & engines': ['Unreal Engine', 'k6', 'Linux'],
}

// Sticky-note tones and tilts, cycled so neighbouring notes never match.
const NOTE_TONES = ['bg-secondary/35', 'bg-primary/10', 'bg-accent/10', 'bg-secondary/20']
const NOTE_TILTS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 pb-28">
      <SectionHeading note="my toolbox">Skills</SectionHeading>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(SKILLS).map(([category, items], i) => (
          <div
            key={category}
            className={`relative p-5 pt-6 shadow-sm transition-transform hover:rotate-0 ${NOTE_TONES[i % 4]} ${NOTE_TILTS[i % 4]}`}
          >
            <Tape className="-top-3 left-1/2 w-16 -translate-x-1/2 rotate-3" />
            <h3 className="font-hand text-lg font-extrabold">{category}</h3>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-hand text-sm text-base-content/80">
              {items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
