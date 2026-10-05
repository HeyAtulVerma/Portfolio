import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

/**
 * Drop-in replacement for the old motion.div AnimatedSection.
 * Uses GSAP ScrollTrigger under the hood — fully SSR-safe.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any

    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!ref.current) return

      const fromVars: gsap.TweenVars = { opacity: 0, duration: 0.7, ease: 'power3.out', delay }
      if (direction === 'up') fromVars.y = 40
      if (direction === 'left') fromVars.x = -40
      if (direction === 'right') fromVars.x = 40

      ctx = gsap.context(() => {
        gsap.from(ref.current!, {
          ...fromVars,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      }, ref)
    }

    run()
    return () => ctx?.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
