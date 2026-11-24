interface HandArrowProps {
  d: string
  head: string
  className?: string
}

// A pen arrow in a 0–100 box: `d` is the shaft, `head` the two barbs.
function HandArrow({ d, head, className = '' }: HandArrowProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path pathLength="1" d={d} />
      <path pathLength="1" d={head} />
    </svg>
  )
}

export default HandArrow
