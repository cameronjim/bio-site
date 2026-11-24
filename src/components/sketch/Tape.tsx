interface TapeProps {
  className?: string
}

// A strip of translucent masking tape for pinning photos and cards to the page.
function Tape({ className = '' }: TapeProps) {
  return (
    <span
      className={`absolute z-10 h-6 w-20 bg-secondary/55 shadow-sm mix-blend-multiply ${className}`}
      aria-hidden="true"
    />
  )
}

export default Tape
