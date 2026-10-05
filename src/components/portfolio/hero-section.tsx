import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Github, Linkedin, Mail, Play, RotateCcw, Sparkles, Terminal } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useMagnetic } from '@/hooks/use-magnetic'

interface HeroSectionProps {
  name?: string
  role?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  email?: string
}

export function HeroSection({
  githubUrl,
  linkedinUrl,
  email,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<SVGRectElement>(null)
  const glyph1Ref = useRef<HTMLDivElement>(null)
  const glyph2Ref = useRef<HTMLDivElement>(null)
  const glyph3Ref = useRef<HTMLDivElement>(null)
  const glyph4Ref = useRef<HTMLDivElement>(null)

  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  // Magnetic button refs
  const primaryBtnRef = useMagnetic<HTMLAnchorElement>(0.3)
  const secondaryBtnRef = useMagnetic<HTMLAnchorElement>(0.3)

  // Code runner state (100% safe client simulation, no eval)
  const [isRunning, setIsRunning] = useState(false)
  const [runLogs, setRunLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'code' | 'console'>('code')

  useEffect(() => {
    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
        // Entrance animation
        gsap.from(leftRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        })
        if (cardRef.current) {
          gsap.from(cardRef.current, {
            opacity: 0,
            x: 40,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
          })
        }

        // SVG animated border beam loop
        if (beamRef.current) {
          gsap.to(beamRef.current, {
            strokeDashoffset: -100,
            duration: 3.5,
            repeat: -1,
            ease: 'none',
          })
        }

        // Floating ambient tech glyphs
        if (glyph1Ref.current) {
          gsap.to(glyph1Ref.current, { y: -16, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        }
        if (glyph2Ref.current) {
          gsap.to(glyph2Ref.current, { y: 14, duration: 4.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 })
        }
        if (glyph3Ref.current) {
          gsap.to(glyph3Ref.current, { y: -12, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 })
        }
        if (glyph4Ref.current) {
          gsap.to(glyph4Ref.current, { y: 18, duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 })
        }
      }, containerRef)
    }
    run()
    return () => ctx?.revert()
  }, [])

  // 3D Tilt across the WHOLE hero section, affecting card more strongly when hovering directly
  const handleSectionMouseMove = async (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return

    const cardRect = card.getBoundingClientRect()
    const isDirect =
      e.clientX >= cardRect.left &&
      e.clientX <= cardRect.right &&
      e.clientY >= cardRect.top &&
      e.clientY <= cardRect.bottom

    const centerX = cardRect.left + cardRect.width / 2
    const centerY = cardRect.top + cardRect.height / 2
    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2)
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2)

    let rotateX = 0
    let rotateY = 0

    if (isDirect) {
      // Direct hover: stronger responsive tilt + vibrant spotlight
      const localX = e.clientX - cardRect.left
      const localY = e.clientY - cardRect.top
      const localCenterX = cardRect.width / 2
      const localCenterY = cardRect.height / 2
      rotateX = -((localY - localCenterY) / localCenterY) * 9
      rotateY = ((localX - localCenterX) / localCenterX) * 9
      setSpotlight({ x: localX, y: localY, opacity: 1 })
    } else {
      // Ambient cursor tracking across entire hero section
      rotateX = -deltaY * 4.5
      rotateY = deltaX * 4.5
      setSpotlight((prev) => ({ ...prev, opacity: 0.12 }))
    }

    const { gsap } = await import('gsap')
    gsap.to(card, {
      rotateX,
      rotateY,
      scale: isDirect ? 1.02 : 1,
      duration: isDirect ? 0.2 : 0.45,
      ease: 'power2.out',
      transformPerspective: 1000,
    })

    // Parallax on ambient glyphs
    if (glyph1Ref.current) gsap.to(glyph1Ref.current, { x: deltaX * 12, duration: 0.4 })
    if (glyph2Ref.current) gsap.to(glyph2Ref.current, { x: -deltaX * 16, duration: 0.4 })
    if (glyph3Ref.current) gsap.to(glyph3Ref.current, { x: deltaX * 20, duration: 0.4 })
    if (glyph4Ref.current) gsap.to(glyph4Ref.current, { x: -deltaX * 14, duration: 0.4 })
  }

  const handleSectionMouseLeave = async () => {
    const card = cardRef.current
    if (!card) return
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
    const { gsap } = await import('gsap')
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: 'power3.out',
    })
    if (glyph1Ref.current) gsap.to(glyph1Ref.current, { x: 0, duration: 0.6 })
    if (glyph2Ref.current) gsap.to(glyph2Ref.current, { x: 0, duration: 0.6 })
    if (glyph3Ref.current) gsap.to(glyph3Ref.current, { x: 0, duration: 0.6 })
    if (glyph4Ref.current) gsap.to(glyph4Ref.current, { x: 0, duration: 0.6 })
  }

  // Safe Interactive Code Execution Simulation
  const handleRunCode = async () => {
    if (isRunning) return
    setIsRunning(true)
    setActiveTab('console')
    setRunLogs([])

    const { gsap } = await import('gsap')

    // Pulse card border
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { boxShadow: '0 0 0px rgba(136, 206, 2, 0)' },
        { boxShadow: '0 0 30px rgba(136, 206, 2, 0.4)', duration: 0.4, yoyo: true, repeat: 1 }
      )
    }

    const steps = [
      '$ bun run developer.ts',
      '📦 Compiling TypeScript (strict mode)...',
      '✓ Compiled in 12ms (0 errors)',
      '⚡ Initializing Atul Verma runtime...',
      '🚀 Status: Open to Full-Stack Opportunities!',
      '💡 Output: { name: "Atul Verma", stack: ["React", "TypeScript", "PostgreSQL"], available: true }',
      '⚡ Ready to build extraordinary products with you.',
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 100 : i === 2 ? 300 : 220))
      setRunLogs((prev) => [...prev, steps[i]])
    }
    setIsRunning(false)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="pinned-panel relative overflow-hidden min-h-[calc(100svh-3.5rem)] flex flex-col justify-center py-10 sm:py-16 md:py-24 bg-dot-pattern bg-[#fafbfa] dark:bg-[#090b09]"
    >
      {/* Ambient spotlight */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-12 left-1/2 h-[450px] w-[550px] -translate-x-1/2 rounded-full bg-primary-500/[0.07] blur-[140px]" />
      </div>

      {/* Floating Ambient Interactive Tech Glyphs */}
      <div className="pointer-events-none absolute inset-0 -z-5 overflow-hidden select-none" aria-hidden="true">
        <div ref={glyph1Ref} className="absolute top-16 left-[6%] font-mono text-lg font-bold text-primary-500/15 dark:text-primary-400/15">
          &lt;/&gt;
        </div>
        <div ref={glyph2Ref} className="absolute top-36 left-[38%] font-mono text-sm font-semibold text-primary-500/10 dark:text-primary-400/10">
          &#123; &#125;
        </div>
        <div ref={glyph3Ref} className="absolute bottom-16 left-[18%] font-mono text-xs font-medium text-primary-500/10 dark:text-primary-400/10">
          // fast &amp; clean
        </div>
        <div ref={glyph4Ref} className="absolute top-24 right-[12%] font-mono text-lg text-primary-500/15 dark:text-primary-400/15">
          ⚡
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Clean Copy */}
          <div ref={leftRef} className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-black/[0.02] px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/70 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Full-Stack &amp; Systems Developer
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-[4.25rem] leading-[1.06] text-[#141714] dark:text-[#ecf0ea]">
              Engineering software with{' '}
              <span className="shimmer-text">speed &amp; craft.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-white/60 max-w-lg leading-relaxed">
              Hi, I&apos;m Atul. I build fast, resilient web applications and systems tools with TypeScript, React, Next.js, and modern backends.
            </p>

            {/* Actions with Magnetic Pull */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link ref={primaryBtnRef} to="/projects" className="btn-primary">
                View Selected Work <ArrowRight size={14} />
              </Link>
              <Link ref={secondaryBtnRef} to="/contact" className="btn-secondary">
                Get in Touch
              </Link>

              {/* Minimal social icons */}
              <div className="ml-2 flex items-center gap-2 border-l border-black/[0.08] dark:border-white/[0.08] pl-3">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors"
                  >
                    <Github size={16} />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    aria-label="Email"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Cursor-Reactive Interactive Code Card */}
          <div className="lg:col-span-5 hidden lg:block" style={{ perspective: 1000 }}>
            <div
              ref={cardRef}
              className="relative rounded-2xl border border-black/[0.08] bg-[#ffffff] p-5 shadow-xl shadow-black/[0.03] dark:border-white/[0.08] dark:bg-[#0c0e0c] dark:shadow-2xl dark:shadow-black/70 transition-shadow duration-300 hover:shadow-primary-500/10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* SVG Animated Laser Border */}
              <svg
                className="pointer-events-none absolute -inset-[1.5px] h-[calc(100%+3px)] w-[calc(100%+3px)] rounded-2xl overflow-visible"
                aria-hidden="true"
              >
                <rect
                  ref={beamRef}
                  x="1"
                  y="1"
                  width="calc(100% - 2px)"
                  height="calc(100% - 2px)"
                  rx="16"
                  fill="none"
                  stroke="url(#gsap-laser)"
                  strokeWidth="2"
                  pathLength="100"
                  strokeDasharray="18 82"
                />
                <defs>
                  <linearGradient id="gsap-laser" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#88ce02" stopOpacity="0" />
                    <stop offset="50%" stopColor="#88ce02" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00e575" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Cursor Spotlight Glare */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
                style={{
                  opacity: spotlight.opacity,
                  background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, rgba(136, 206, 2, 0.12), transparent 70%)`,
                }}
              />

              {/* Corner crosshairs */}
              <span className="pointer-events-none absolute -top-1.5 -left-1.5 text-primary-500/40 font-mono text-[10px] leading-none select-none">+</span>
              <span className="pointer-events-none absolute -top-1.5 -right-1.5 text-primary-500/40 font-mono text-[10px] leading-none select-none">+</span>
              <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-primary-500/40 font-mono text-[10px] leading-none select-none">+</span>
              <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-primary-500/40 font-mono text-[10px] leading-none select-none">+</span>

              {/* Card Header with Tabs & Run Button */}
              <div className="relative flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />

                  {/* Tabs */}
                  <div className="ml-2 flex items-center gap-1">
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors ${
                        activeTab === 'code'
                          ? 'bg-black/[0.05] text-[#141714] font-semibold dark:bg-white/[0.08] dark:text-white'
                          : 'text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white'
                      }`}
                    >
                      developer.ts
                    </button>
                    {runLogs.length > 0 && (
                      <button
                        onClick={() => setActiveTab('console')}
                        className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors flex items-center gap-1 ${
                          activeTab === 'console'
                            ? 'bg-primary-500/10 text-primary-600 font-semibold dark:text-primary-400'
                            : 'text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white'
                        }`}
                      >
                        <Terminal size={10} /> console ({runLogs.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Safe Interactive Run Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary-500/40 bg-primary-500/15 px-2.5 py-1 font-mono text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-[#090b09] active:scale-95 transition-all disabled:opacity-50"
                    title="Safely run developer snippet"
                  >
                    {isRunning ? (
                      <Sparkles size={11} className="animate-spin" />
                    ) : runLogs.length > 0 ? (
                      <RotateCcw size={10} />
                    ) : (
                      <Play size={10} className="fill-current" />
                    )}
                    <span>{isRunning ? 'Running...' : runLogs.length > 0 ? 'Re-run' : 'Run'}</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Code View */}
              {activeTab === 'code' ? (
                <pre className="relative mt-4 font-mono text-[12px] leading-6 text-slate-800 dark:text-white/90 overflow-x-auto min-h-[180px]">
                  <code>
                    <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">developer</span> = &#123;{'\n'}
                    {'  '}name: <span className="text-primary-600 dark:text-primary-400">&apos;Atul Verma&apos;</span>,{'\n'}
                    {'  '}role: <span className="text-primary-600 dark:text-primary-400">&apos;Full-Stack Engineer&apos;</span>,{'\n'}
                    {'  '}stack: [<span className="text-emerald-600 dark:text-emerald-400">&apos;React&apos;</span>, <span className="text-emerald-600 dark:text-emerald-400">&apos;TypeScript&apos;</span>, <span className="text-emerald-600 dark:text-emerald-400">&apos;PostgreSQL&apos;</span>],{'\n'}
                    {'  '}status: <span className="text-primary-600 dark:text-primary-400">&apos;Open to opportunities&apos;</span>,{'\n'}
                    &#125;{'\n'}
                    {'\n'}
                    <span className="text-slate-400 dark:text-white/40">// Click &apos;Run&apos; to execute snippet</span>{'\n'}
                    <span className="text-purple-600 dark:text-purple-400">export default</span> developer;
                    <span className="ml-1 inline-block h-3.5 w-1.5 bg-primary-500 cursor-blink align-middle" />
                  </code>
                </pre>
              ) : (
                /* Tab 2: Live Console Output */
                <div className="relative mt-4 font-mono text-[11px] leading-5 text-slate-800 dark:text-white/90 min-h-[180px] space-y-1.5 overflow-y-auto max-h-[220px]">
                  {runLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.startsWith('$')
                          ? 'text-slate-400 dark:text-white/40 font-semibold'
                          : log.startsWith('✓') || log.startsWith('🚀') || log.startsWith('⚡')
                          ? 'text-primary-600 dark:text-primary-400 font-semibold'
                          : log.startsWith('💡')
                          ? 'text-amber-500 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg'
                          : 'text-slate-600 dark:text-white/70'
                      }
                    >
                      {log}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex items-center gap-1.5 text-primary-500 text-xs">
                      <span className="inline-block h-3 w-1.5 bg-primary-500 cursor-blink" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
