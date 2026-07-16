import { motion } from 'motion/react'
import { ExternalLink, Github } from 'lucide-react'
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

export function ProjectCard({ title, slug, shortDescription, thumbnailUrl, techStack, liveUrl, githubUrl, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <Link to={`/projects/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950 dark:to-accent-950">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl font-bold text-primary-300 dark:text-primary-700">{title[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/projects/${slug}`}>
          <h3 className="text-lg font-bold text-slate-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
            {title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/50 dark:text-primary-300"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{techStack.length - 4}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400">
              <ExternalLink size={14} /> Live
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400">
              <Github size={14} /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
