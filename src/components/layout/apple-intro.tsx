import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface AppleIntroProps {
  onComplete?: () => void
}

// Cursive monoline handwriting coordinates for "Atul Verma"
const ATUL_PATH =
  'M 75 195 C 90 215 112 215 132 175 C 150 135 160 80 168 56 C 172 46 179 46 183 58 C 193 95 208 175 218 215 C 212 196 182 158 158 146 C 146 140 145 132 156 132 C 172 135 202 152 238 178 C 258 160 272 120 280 78 C 282 70 287 70 288 78 C 288 115 286 175 289 202 C 291 216 305 218 319 206 C 332 195 344 165 354 148 C 360 175 370 216 392 216 C 408 216 420 180 426 148 C 432 175 442 216 462 216 C 477 216 490 185 500 145 C 517 95 540 50 554 46 C 562 43 566 50 560 70 C 548 108 536 175 538 202 C 540 216 552 218 567 206 C 582 194 602 180 628 180'

const T_CROSS_PATH = 'M 255 115 C 275 113 302 113 320 112'

const VERMA_PATH =
  'M 670 95 C 678 72 688 64 698 64 C 706 64 712 74 714 90 C 718 135 726 195 732 218 C 734 224 738 224 742 216 C 752 175 772 110 784 75 C 788 65 798 66 798 78 C 798 90 790 105 796 122 C 802 136 820 120 832 110 C 845 100 856 106 852 124 C 844 148 816 168 816 198 C 816 215 828 218 842 212 C 854 204 864 175 874 142 C 878 132 888 130 895 134 C 900 137 900 148 898 172 C 896 198 898 216 908 216 C 916 216 924 208 932 192 C 938 175 944 140 955 136 C 962 134 968 140 970 155 C 972 178 970 202 972 215 C 976 182 984 140 998 136 C 1006 134 1012 140 1014 155 C 1016 178 1014 202 1016 215 C 1020 182 1028 140 1042 136 C 1050 134 1056 140 1058 158 C 1060 185 1058 206 1062 215 C 1065 220 1074 220 1084 210 C 1094 196 1102 172 1110 145 C 1118 135 1130 132 1136 135 C 1122 140 1102 162 1102 188 C 1102 214 1118 220 1134 214 C 1144 208 1150 185 1150 142 C 1150 170 1148 200 1150 212 C 1152 220 1164 220 1176 210 C 1198 195 1225 180 1265 180'

export function AppleIntro({ onComplete }: AppleIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Paths
  const atulPathRef = useRef<SVGPathElement>(null)
  const atulGlowRef = useRef<SVGPathElement>(null)
  const atulCoreRef = useRef<SVGPathElement>(null)

  const tCrossPathRef = useRef<SVGPathElement>(null)
  const tCrossGlowRef = useRef<SVGPathElement>(null)
  const tCrossCoreRef = useRef<SVGPathElement>(null)

  const vermaPathRef = useRef<SVGPathElement>(null)
  const vermaGlowRef = useRef<SVGPathElement>(null)
  const vermaCoreRef = useRef<SVGPathElement>(null)

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Check if user has already seen intro in this session unless ?intro is forced
    const hasSeen = sessionStorage.getItem('hasSeenAppleIntro')
    const params = new URLSearchParams(window.location.search)
    const forceIntro = params.get('intro') === 'true'

    if (hasSeen && !forceIntro) {
      return
    }

    setShouldRender(true)

    const handleReplay = () => {
      sessionStorage.removeItem('hasSeenAppleIntro')
      setShouldRender(true)
    }
    window.addEventListener('replay-apple-intro', handleReplay)

    return () => {
      window.removeEventListener('replay-apple-intro', handleReplay)
    }
  }, [])

  useEffect(() => {
    if (!shouldRender) return

    // Lock body scrolling during intro playback
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const atulLength = atulPathRef.current?.getTotalLength() || 1700
    const tCrossLength = tCrossPathRef.current?.getTotalLength() || 70
    const vermaLength = vermaPathRef.current?.getTotalLength() || 1900

    const pathGroups = [
      {
        elements: [atulPathRef.current, atulGlowRef.current, atulCoreRef.current],
        len: atulLength,
      },
      {
        elements: [tCrossPathRef.current, tCrossGlowRef.current, tCrossCoreRef.current],
        len: tCrossLength,
      },
      {
        elements: [vermaPathRef.current, vermaGlowRef.current, vermaCoreRef.current],
        len: vermaLength,
      },
    ]

    pathGroups.forEach(({ elements, len }) => {
      elements.forEach((el) => {
        if (el) {
          gsap.set(el, {
            strokeDasharray: len,
            strokeDashoffset: len,
          })
        }
      })
    })

    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro()
      },
    })
    tlRef.current = tl

    // 1. Write "Atul"
    tl.to(
      [atulPathRef.current, atulGlowRef.current, atulCoreRef.current],
      {
        strokeDashoffset: 0,
        duration: 1.25,
        ease: 'power2.inOut',
      },
      '+=0.15'
    )

    // 2. Swift crossbar on 't'
    tl.to(
      [tCrossPathRef.current, tCrossGlowRef.current, tCrossCoreRef.current],
      {
        strokeDashoffset: 0,
        duration: 0.22,
        ease: 'power1.out',
      },
      '-=0.3'
    )

    // 3. Write "Verma"
    tl.to(
      [vermaPathRef.current, vermaGlowRef.current, vermaCoreRef.current],
      {
        strokeDashoffset: 0,
        duration: 1.35,
        ease: 'power2.inOut',
      },
      '-=0.1'
    )

    // 4. Brief majestic pause with subtle breathing scale
    tl.to(
      containerRef.current,
      {
        scale: 1.035,
        duration: 0.35,
        ease: 'sine.inOut',
      },
      '+=0.05'
    )

    // 5. Apple-style Camera Zoom-In: Text accelerates and zooms straight into camera
    tl.to(containerRef.current, {
      scale: 5.5,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.75,
      ease: 'power3.in',
    })

    // 6. Overlay curtain fades out simultaneously revealing the portfolio
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '-=0.4'
    )

    const finishIntro = () => {
      sessionStorage.setItem('hasSeenAppleIntro', 'true')
      document.body.style.overflow = originalOverflow
      setShouldRender(false)
      onComplete?.()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        skipIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      tl.kill()
    }
  }, [shouldRender])

  const skipIntro = () => {
    if (tlRef.current) {
      tlRef.current.progress(1)
    } else {
      sessionStorage.setItem('hasSeenAppleIntro', 'true')
      document.body.style.overflow = ''
      setShouldRender(false)
      onComplete?.()
    }
  }

  if (!shouldRender) return null

  return (
    <div
      ref={overlayRef}
      onClick={skipIntro}
      className="fixed inset-0 z-[10000] flex cursor-pointer select-none items-center justify-center overflow-hidden bg-[#070b04]"
      aria-label="Atul Verma Intro - Click or press Esc to skip"
    >
      {/* Ambient green glow sphere */}
      <div className="pointer-events-none absolute h-[550px] w-[550px] rounded-full bg-primary-500/15 blur-[130px]" />

      {/* Skip pill */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/50 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white">
        <span>Click or Esc to skip</span>
        <span className="text-[10px] opacity-60">✕</span>
      </div>

      {/* Text SVG container */}
      <div
        ref={containerRef}
        className="relative z-10 flex w-full max-w-4xl items-center justify-center px-6 will-change-transform"
      >
        <svg
          viewBox="0 0 1350 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full drop-shadow-[0_0_25px_rgba(136,206,2,0.45)]"
        >
          <defs>
            <filter id="apple-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: GLOW BLOOM PASS */}
          <g opacity="0.45" filter="url(#apple-neon-glow)">
            <path
              ref={atulGlowRef}
              d={ATUL_PATH}
              stroke="#88CE02"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
            />
            <path
              ref={tCrossGlowRef}
              d={T_CROSS_PATH}
              stroke="#88CE02"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
            />
            <path
              ref={vermaGlowRef}
              d={VERMA_PATH}
              stroke="#88CE02"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2500, strokeDashoffset: 2500 }}
            />
          </g>

          {/* LAYER 2: MAIN STROKE PASS */}
          <g>
            <path
              ref={atulPathRef}
              d={ATUL_PATH}
              stroke="#88CE02"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
            />
            <path
              ref={tCrossPathRef}
              d={T_CROSS_PATH}
              stroke="#88CE02"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
            />
            <path
              ref={vermaPathRef}
              d={VERMA_PATH}
              stroke="#88CE02"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2500, strokeDashoffset: 2500 }}
            />
          </g>

          {/* LAYER 3: BRIGHT INCANDESCENT CORE */}
          <g opacity="0.85">
            <path
              ref={atulCoreRef}
              d={ATUL_PATH}
              stroke="#f0ffb8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
            />
            <path
              ref={tCrossCoreRef}
              d={T_CROSS_PATH}
              stroke="#f0ffb8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
            />
            <path
              ref={vermaCoreRef}
              d={VERMA_PATH}
              stroke="#f0ffb8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 2500, strokeDashoffset: 2500 }}
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
