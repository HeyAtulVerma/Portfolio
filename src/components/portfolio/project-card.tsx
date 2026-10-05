import { useRef, useEffect } from 'react'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface ProjectCardProps {
  id: string
  title: string
  slug: string
  shortDescription: string
  thumbnailUrl?: string | null
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  index: number
}

export function ProjectCard({
  title,
  slug,
  shortDescription,
  thumbnailUrl,
  techStack,
  liveUrl,
  githubUrl,
  index,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: 'power3.out',
          delay: (index % 3) * 0.08,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        })
      }, cardRef)
    }
    run()
    return () => ctx?.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click originated from an explicit link or button, do not navigate the card
    const target = e.target as HTMLElement
    if (target.closest('a, button')) {
      return
    }
    navigate({ to: '/projects/$slug', params: { slug } })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement
      if (!target.closest('a, button')) {
        e.preventDefault()
        navigate({ to: '/projects/$slug', params: { slug } })
      }
    }
  }

  return (
    <div
      ref={cardRef}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative flex flex-col h-full rounded-2xl border border-black/[0.08] bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary-500/40 hover:shadow-lg dark:border-white/[0.08] dark:bg-[#111411]/60 overflow-hidden cursor-pointer select-none"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/[0.02]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-white/[0.02]">
            <span className="text-4xl font-extrabold text-slate-300 dark:text-white/10">{title[0]}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold tracking-tight text-[#141714] transition-colors group-hover:text-primary-600 dark:text-[#ecf0ea] dark:group-hover:text-primary-400 inline-flex items-center gap-1.5">
            {title}
            <ArrowUpRight
              size={14}
              className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </h3>
        </div>

        <p className="mt-2 text-xs text-slate-600 dark:text-white/60 line-clamp-2 leading-relaxed">
          {shortDescription}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-black/[0.06] bg-black/[0.02] px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white/70"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="rounded-md px-1.5 py-0.5 text-[10px] text-slate-400 dark:text-white/40">
              +{techStack.length - 4}
            </span>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2 mt-auto">
          {/* Direct External Action Buttons (Stop Propagation) */}
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-500/15 transition-colors"
                title="Open live preview in new tab"
              >
                Live <ExternalLink size={11} />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors"
                title="View source code on GitHub"
              >
                <Github size={12} /> Code
              </a>
            )}
          </div>

          {/* Details visual indicator (clicks bubble to whole card) */}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-primary-500 transition-colors">
            Details <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </div>
  )
}
