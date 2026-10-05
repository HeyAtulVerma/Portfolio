import { createFileRoute, Link } from '@tanstack/react-router'
import { getProjectBySlug } from '@/server/functions/projects'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowLeft, ExternalLink, Github, MonitorPlay, Tag, Wrench } from 'lucide-react'
import { notFound } from '@tanstack/react-router'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/projects/$slug')({
  loader: async ({ params }) => {
    if (typeof window !== 'undefined') {
      const cached = await getCachedPublicSiteData()
      const project = cached.projects.find((p: any) => p.slug === params.slug)
      if (!project) {
        throw notFound()
      }
      return project
    }
    const project = await getProjectBySlug({ data: { slug: params.slug } })
    if (!project) {
      throw notFound()
    }
    return project
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title || 'Project'} - Atul Verma` }] }),
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData()

  return (
    <div className="py-16 md:py-24 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimatedSection>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 dark:text-white/60 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>
        </AnimatedSection>

        {/* Title & Actions */}
        <AnimatedSection className="mt-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
            {project.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Github size={14} /> Source Code
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MonitorPlay size={14} /> Video Demo
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Thumbnail Preview */}
        {project.thumbnailUrl && (
          <AnimatedSection className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c0e0c] shadow-xl">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full object-cover max-h-[480px]"
              />
            </div>
          </AnimatedSection>
        )}

        {/* Tech Stack & Categories */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {project.techStack.length > 0 && (
            <AnimatedSection>
              <div className="glass-card rounded-2xl p-5 h-full">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
                  <Wrench size={13} /> Tech Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {project.tags.length > 0 && (
            <AnimatedSection delay={0.08}>
              <div className="glass-card rounded-2xl p-5 h-full">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-3">
                  <Tag size={13} /> Categories
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-black/[0.06] bg-black/[0.02] px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Overview & Architecture */}
        <AnimatedSection className="mt-8">
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-bold text-[#141714] dark:text-[#ecf0ea] mb-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              Overview &amp; Architecture
            </h2>
            <div className="space-y-4 text-sm text-slate-600 dark:text-white/70 leading-relaxed whitespace-pre-line">
              {project.longDescription || project.shortDescription}
            </div>
          </div>
        </AnimatedSection>

        {/* How It Was Built */}
        {project.howItWasBuilt && (
          <AnimatedSection className="mt-8">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-[#141714] dark:text-[#ecf0ea] mb-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                Implementation Details
              </h2>
              <div className="space-y-4 text-sm text-slate-600 dark:text-white/70 leading-relaxed whitespace-pre-line">
                {project.howItWasBuilt}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Screenshots Gallery */}
        {project.images && project.images.length > 0 && (
          <AnimatedSection className="mt-12">
            <h2 className="text-lg font-bold text-[#141714] dark:text-[#ecf0ea] mb-4">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map((img: any) => (
                <div key={img.id} className="overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c0e0c]">
                  <img
                    src={img.url}
                    alt={img.altText || project.title}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {img.caption && (
                    <p className="p-2.5 text-center text-xs text-slate-400 dark:text-white/40">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
