import { useEffect, useRef, useState } from 'react'

export function ScrollSnake() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Only run on desktop/tablet devices
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const path = pathRef.current
        const head = headRef.current
        const glow = glowRef.current
        if (!path || !head || !glow) return

        const pathLength = path.getTotalLength()

        // Set up dasharray for drawing path as you scroll
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })

        // Position head at the very start
        const startPoint = path.getPointAtLength(0)
        head.setAttribute('cx', String(startPoint.x))
        head.setAttribute('cy', String(startPoint.y))
        glow.setAttribute('cx', String(startPoint.x))
        glow.setAttribute('cy', String(startPoint.y))

        // ScrollTrigger to animate snake along the zigzag path cleanly
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
          onUpdate: (self) => {
            const progress = Math.min(Math.max(self.progress, 0), 1)
            setScrollProgress(Math.round(progress * 100))

            const currentLength = pathLength * progress
            // Draw path directly via dashoffset
            path.style.strokeDashoffset = String(pathLength - currentLength)

            // Direct attribute coordinates (fixes SVG transform scale drift bug)
            const point = path.getPointAtLength(currentLength)
            head.setAttribute('cx', point.x.toFixed(2))
            head.setAttribute('cy', point.y.toFixed(2))
            glow.setAttribute('cx', point.x.toFixed(2))
            glow.setAttribute('cy', point.y.toFixed(2))

            // Subtle velocity radius response without breaking coordinates
            const velocity = Math.min(Math.abs(self.getVelocity() || 0) / 2000, 1)
            head.setAttribute('r', (5 + velocity * 1.5).toFixed(1))
            glow.setAttribute('r', (10 + velocity * 3).toFixed(1))
            glow.setAttribute('opacity', (0.4 + velocity * 0.3).toFixed(2))
          },
        })
      })
    }

    run()
    return () => ctx?.revert()
  }, [])

  const handleSnakeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const SNAKE_D =
    'M 20 12 Q 36 55, 20 98 Q 4 141, 20 184 Q 36 227, 20 270 Q 4 313, 20 348'

  return (
    <div
      ref={containerRef}
      onClick={handleSnakeClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed right-7 top-1/2 -translate-y-1/2 z-[55] hidden lg:flex flex-col items-center cursor-pointer group select-none"
      title="Click to scroll to top"
      role="button"
      tabIndex={0}
      aria-label="Scroll progress and return to top"
    >
      <div className="w-10 h-[360px] relative flex flex-col items-center">
        <svg
          className="w-full h-[348px] overflow-visible transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 40 360"
          fill="none"
        >
          {/* Subtle background track */}
          <path
            d={SNAKE_D}
            stroke="currentColor"
            className="text-black/[0.08] dark:text-white/[0.08] transition-colors group-hover:text-primary-500/25"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Animated glowing snake path */}
          <path
            ref={pathRef}
            d={SNAKE_D}
            stroke="url(#snake-neon-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Glowing aura around head */}
          <circle
            ref={glowRef}
            cx="20"
            cy="12"
            r="10"
            fill="#88ce02"
            opacity="0.45"
            className="blur-[5px]"
          />

          {/* Snake Head */}
          <circle
            ref={headRef}
            cx="20"
            cy="12"
            r="5"
            fill="#88ce02"
            stroke="#090b09"
            strokeWidth="2"
          />

          <defs>
            <linearGradient id="snake-neon-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#88ce02" stopOpacity="0.3" />
              <stop offset="80%" stopColor="#88ce02" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00e575" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Progress pill / back to top indicator safely placed below SVG */}
        <div className="mt-2.5 px-2 py-0.5 rounded-full border border-primary-500/25 bg-[#090b09]/85 backdrop-blur-md font-mono text-[9px] font-bold text-primary-400 group-hover:text-primary-300 group-hover:border-primary-400/50 shadow-sm transition-all whitespace-nowrap">
          {hovered ? 'TOP ↑' : `${scrollProgress}%`}
        </div>
      </div>
    </div>
  )
}
