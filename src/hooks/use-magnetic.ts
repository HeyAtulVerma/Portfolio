import { useEffect, useRef } from 'react'

export function useMagnetic<T extends HTMLElement = HTMLElement>(strength: number = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const node = ref.current
    if (!node) return

    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const xTo = gsap.quickTo(node, 'x', { duration: 0.3, ease: 'power2.out' })
        const yTo = gsap.quickTo(node, 'y', { duration: 0.3, ease: 'power2.out' })

        const handleMouseMove = (e: MouseEvent) => {
          const rect = node.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const deltaX = e.clientX - centerX
          const deltaY = e.clientY - centerY

          xTo(deltaX * strength)
          yTo(deltaY * strength)
        }

        const handleMouseLeave = () => {
          gsap.to(node, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1.1, 0.4)',
          })
        }

        node.addEventListener('mousemove', handleMouseMove)
        node.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          node.removeEventListener('mousemove', handleMouseMove)
          node.removeEventListener('mouseleave', handleMouseLeave)
        }
      }, node)
    }

    run()
    return () => ctx?.revert()
  }, [strength])

  return ref
}
