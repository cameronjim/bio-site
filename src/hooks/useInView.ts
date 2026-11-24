import { useEffect, useRef, useState } from 'react'

// Flips to true the first time the element scrolls into view, then stops
// observing — used to start scroll-triggered draw-on animations exactly once.
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, threshold])

  return [ref, inView] as const
}
