import SketchBorder from './SketchBorder'

interface SketchButtonProps {
  href: string
  primary?: boolean
  external?: boolean
  download?: boolean
  children: React.ReactNode
}

function SketchButton({
  href,
  primary = false,
  external = false,
  download = false,
  children,
}: SketchButtonProps) {
  const tone = primary
    ? 'bg-primary text-primary-content -rotate-1'
    : 'bg-base-100 text-base-content rotate-1'
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      download={download || undefined}
      className={`relative inline-flex items-center px-5 py-2.5 font-hand text-lg font-semibold transition-transform hover:-translate-y-0.5 ${tone}`}
    >
      <SketchBorder className={primary ? 'text-base-content' : ''} />
      <span className="relative">{children}</span>
    </a>
  )
}

export default SketchButton
