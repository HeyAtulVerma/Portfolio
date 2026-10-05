import { useEffect, useRef } from 'react'

/**
 * Animates a numeric counter from 0 to `target` when the element scrolls into view.
 * Returns a ref to attach to the element that will display the number.
 */
export function useGsapCounter(target: number, suffix = '', duration = 1.5) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let ctx: any

    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!ref.current) return

      const el = ref.current
      const counter = { val: 0 }

      ctx = gsap.context(() => {
        gsap.to(counter, {
          val: target,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onUpdate() {
            el.textContent = Math.round(counter.val) + suffix
          },
        })
      })
    }

    run()

    return () => {
      ctx?.revert()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return ref
}
