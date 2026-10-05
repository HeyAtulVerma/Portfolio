import { createFileRoute } from '@tanstack/react-router'
import { getProjects } from '@/server/functions/projects'
import { ProjectCard } from '@/components/portfolio/project-card'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'
import { useState, useMemo } from 'react'
import { Code2, Search, X } from 'lucide-react'

export const Route = createFileRoute('/_public/projects/')({
  loader: async () => {
    if (typeof window !== 'undefined') {
      const cached = await getCachedPublicSiteData()
      return cached.projects
    }
    return await getProjects()
  },
  head: () => ({ meta: [{ title: 'Projects - Atul Verma' }] }),
  component: ProjectsPage,
})

export function ProjectsPage() {
  const projects = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  // Collect all unique tags and tech across projects
  const tags = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p: any) => {
      p.techStack?.forEach((t: string) => set.add(t))
      p.tags?.forEach((t: string) => set.add(t))
    })
    return ['All', ...Array.from(set).slice(0, 8)]
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((project: any) => {
      const matchesTag =
        activeTag === 'All' ||
        project.techStack?.includes(activeTag) ||
        project.tags?.includes(activeTag)

      const matchesSearch =
        search === '' ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        project.techStack?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))

      return matchesTag && matchesSearch
    })
  }, [projects, activeTag, search])

  return (
    <div className="py-20 md:py-28 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-50/50 px-3.5 py-1 text-xs font-semibold text-primary-600 dark:border-primary-500/30 dark:bg-primary-950/40 dark:text-primary-400 mb-4">
            <Code2 size={14} /> Production Portfolio
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Projects & Case Studies
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            A curated showcase of full-stack web platforms, native systems tools, PWAs, and games.
          </p>
        </AnimatedSection>

        {/* Search & Filters */}
        <AnimatedSection delay={0.1} className="mt-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by name or technology..."
                className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Tag Pills */}
            {tags.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTag === tag
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'border border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center">
                <Code2 className="mx-auto text-slate-400 dark:text-slate-600" size={48} />
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No projects found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search criteria or tag filters.
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project: any, idx: number) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  slug={project.slug}
                  shortDescription={project.shortDescription}
                  thumbnailUrl={project.thumbnailUrl}
                  techStack={project.techStack}
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
