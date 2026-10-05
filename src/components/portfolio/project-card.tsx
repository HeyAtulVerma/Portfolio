import { motion } from 'motion/react'
import { ExternalLink, Github, ArrowUpRight, FolderGit2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

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
  index
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60 overflow-hidden"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-900/20 to-accent-900/20">
            <span className="text-4xl font-black text-slate-300 dark:text-slate-700">{title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Body Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/projects/$slug"
            params={{ slug }}
            className="group/title inline-flex items-center gap-1.5 focus:outline-none"
          >
            <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover/title:text-primary-600 dark:text-white dark:group-hover/title:text-primary-400">
              {title}
            </h3>
            <ArrowUpRight size={16} className="text-slate-400 transition-transform group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-primary-500" />
          </Link>
        </div>

        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {shortDescription}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="rounded-lg border border-slate-200/50 bg-slate-100/50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              +{techStack.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Live Demo <ExternalLink size={12} />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Github size={13} /> Code
              </a>
            )}
          </div>

          <Link
            to="/projects/$slug"
            params={{ slug }}
            className="text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            Case Study →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
