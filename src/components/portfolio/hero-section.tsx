import { useEffect, useRef } from 'react'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'

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

  useEffect(() => {
    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
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
      }, containerRef)
    }
    run()
    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-dot-pattern"
    >
      {/* Subtle single ambient spotlight */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-12 left-1/2 h-[450px] w-[550px] -translate-x-1/2 rounded-full bg-primary-500/[0.07] blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Focused Copy */}
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

            {/* Clean Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="btn-primary">
                View Selected Work <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
              </Link>

              {/* Minimal social links */}
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

          {/* Right Column: Sleek Code Preview Card */}
          <div ref={cardRef} className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl border border-black/[0.08] bg-[#ffffff] p-5 shadow-lg shadow-black/[0.03] dark:border-white/[0.08] dark:bg-[#0c0e0c] dark:shadow-2xl dark:shadow-black/50">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-white/40">developer.ts</span>
                </div>
                <span className="rounded-md border border-primary-500/30 bg-primary-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary-600 dark:text-primary-400">
                  TypeScript
                </span>
              </div>

              {/* Code editor content */}
              <pre className="mt-4 font-mono text-[12px] leading-6 text-slate-800 dark:text-white/90 overflow-x-auto">
                <code>
                  <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">developer</span> = &#123;{'\n'}
                  {'  '}name: <span className="text-primary-600 dark:text-primary-400">&apos;Atul Verma&apos;</span>,{'\n'}
                  {'  '}role: <span className="text-primary-600 dark:text-primary-400">&apos;Full-Stack Engineer&apos;</span>,{'\n'}
                  {'  '}stack: [<span className="text-emerald-600 dark:text-emerald-400">&apos;React&apos;</span>, <span className="text-emerald-600 dark:text-emerald-400">&apos;TypeScript&apos;</span>, <span className="text-emerald-600 dark:text-emerald-400">&apos;PostgreSQL&apos;</span>],{'\n'}
                  {'  '}status: <span className="text-primary-600 dark:text-primary-400">&apos;Open to opportunities&apos;</span>,{'\n'}
                  &#125;{'\n'}
                  {'\n'}
                  <span className="text-slate-400 dark:text-white/40">// Ready to build great products</span>{'\n'}
                  <span className="text-purple-600 dark:text-purple-400">export default</span> developer;
                  <span className="ml-1 inline-block h-3.5 w-1.5 bg-primary-500 cursor-blink align-middle" />
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
