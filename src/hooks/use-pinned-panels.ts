import { useEffect, useRef } from 'react'

/**
 * Pinned Panels with Overscroll
 * Based on GSAP ScrollTrigger's pinned-panels-with-overscroll pattern:
 * https://demos.gsap.com/demo/pinned-panels-with-overscroll/
 *
 * Each panel with className "pinned-panel" pins when scrolled to:
 * - If panel is shorter than viewport: pins at 'top top'
 * - If panel is taller than viewport (overscroll): scrolls through its full content, then pins at 'bottom bottom'
 * - pinSpacing: false allows subsequent panels with higher z-index to smoothly slide over the previous panel
 */
export function usePinnedPanels() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Prevent mobile browser address-bar resize jumps from breaking pin calculations
        ScrollTrigger.config({ ignoreMobileResize: true })

        const panels = gsap.utils.toArray<HTMLElement>('.pinned-panel')
        if (panels.length <= 1) return

        panels.forEach((panel, i) => {
          // Apply increasing z-index so each subsequent section cleanly layers on top
          panel.style.zIndex = String((i + 1) * 10)

          // Pin all panels except the very last one
          if (i < panels.length - 1) {
            ScrollTrigger.create({
              trigger: panel,
              // The first panel (Hero) MUST start at 'top top' immediately from scroll 0
              // so it never shifts before pinning. Subsequent panels overscroll if taller than viewport.
              start: () =>
                i === 0
                  ? 'top top'
                  : panel.offsetHeight <= window.innerHeight
                    ? 'top top'
                    : 'bottom bottom',
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            })
          }
        })

        // Refresh triggers on next animation frame after layout settles
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
      }, containerRef)
    }

    run()

    return () => ctx?.revert()
  }, [])

  return containerRef
}
