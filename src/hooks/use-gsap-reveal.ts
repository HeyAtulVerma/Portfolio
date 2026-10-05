import { useEffect, useRef } from 'react'

interface GsapRevealOptions {
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  stagger?: number
  distance?: number
  ease?: string
}

/**
 * A hook that registers a GSAP ScrollTrigger reveal animation on a container ref.
 * Children with [data-reveal] attribute are staggered; otherwise the container itself animates.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: GsapRevealOptions = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    let ctx: any

    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const {
        delay = 0,
        duration = 0.7,
        direction = 'up',
        stagger = 0,
        distance = 40,
        ease = 'power3.out',
      } = options

      if (!ref.current) return

      const fromVars: gsap.TweenVars = {
        opacity: 0,
        ease,
        duration,
        delay,
      }
      if (direction === 'up') fromVars.y = distance
      if (direction === 'down') fromVars.y = -distance
      if (direction === 'left') fromVars.x = distance
      if (direction === 'right') fromVars.x = -distance

      const targets = stagger
        ? Array.from(ref.current.querySelectorAll('[data-reveal]'))
        : [ref.current]

      ctx = gsap.context(() => {
        gsap.from(targets, {
          ...fromVars,
          stagger: stagger || 0,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      }, ref)
    }

    run()

    return () => {
      ctx?.revert()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
