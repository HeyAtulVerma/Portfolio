import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return
    }
    setEnabled(true)

    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        // GSAP quickTo for silky smooth performance
        const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
        const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
        const setRingX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power2.out' })
        const setRingY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power2.out' })

        let isHovered = false

        const onMouseMove = (e: MouseEvent) => {
          setDotX(e.clientX)
          setDotY(e.clientY)
          setRingX(e.clientX)
          setRingY(e.clientY)

          // Check if hovering interactive element
          const target = e.target as HTMLElement | null
          const interactive = target?.closest('a, button, [role="link"], input, textarea, .glass-card, [data-interactive]')

          if (interactive && !isHovered) {
            isHovered = true
            gsap.to(ring, {
              scale: 1.7,
              borderColor: 'rgba(136, 206, 2, 0.85)',
              backgroundColor: 'rgba(136, 206, 2, 0.08)',
              duration: 0.25,
            })
            gsap.to(dot, { scale: 0.6, duration: 0.2 })
          } else if (!interactive && isHovered) {
            isHovered = false
            gsap.to(ring, {
              scale: 1,
              borderColor: 'rgba(136, 206, 2, 0.4)',
              backgroundColor: 'transparent',
              duration: 0.25,
            })
            gsap.to(dot, { scale: 1, duration: 0.2 })
          }
        }

        const onMouseLeave = () => {
          gsap.to([dot, ring], { opacity: 0, duration: 0.25 })
        }

        const onMouseEnter = () => {
          gsap.to([dot, ring], { opacity: 1, duration: 0.25 })
        }

        window.addEventListener('mousemove', onMouseMove, { passive: true })
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('mouseenter', onMouseEnter)

        return () => {
          window.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseleave', onMouseLeave)
          document.removeEventListener('mouseenter', onMouseEnter)
        }
      })
    }

    run()
    return () => ctx?.revert()
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-primary-500/40 opacity-0 transition-opacity"
        style={{ willChange: 'transform' }}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(136,206,2,0.8)] opacity-0 transition-opacity"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
