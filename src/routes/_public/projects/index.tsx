import { createFileRoute } from '@tanstack/react-router'
import { getProjects } from '@/server/functions/projects'
import { ProjectCard } from '@/components/portfolio/project-card'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'
import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'

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

function ProjectsPage() {
  const projects = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

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
    <div className="py-16 md:py-24 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedSection>
          <span className="section-tag">Portfolio</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
            Selected Works
          </h1>
        </AnimatedSection>

        {/* Search & Filters */}
        <AnimatedSection delay={0.08} className="mt-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-black/[0.08] bg-white/70 py-2 pl-9 pr-3 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {tags.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTag === tag
                        ? 'bg-primary-500 text-[#090b09] font-bold'
                        : 'border border-black/[0.06] bg-white/60 text-slate-600 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.08]'
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
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/[0.08] dark:border-white/[0.08] p-12 text-center text-xs text-slate-500 dark:text-white/40">
              No projects match your filter.
            </div>
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
