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
    <div className="py-20 md:py-28 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7a40] transition-colors hover:text-primary-600 dark:text-[#7a9c5e] dark:hover:text-primary-400"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </AnimatedSection>

        {/* Hero Image */}
        {project.thumbnailUrl && (
          <AnimatedSection className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-green-200/60 dark:border-green-900/50 shadow-xl bg-[#080e04]">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </AnimatedSection>
        )}

        {/* Title & Meta */}
        <AnimatedSection className="mt-8">
          <h1 className="text-4xl font-black tracking-tight text-[#1a2310] dark:text-[#e8f5d0] sm:text-5xl">
            {project.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-green"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Github size={16} /> Source Code
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MonitorPlay size={16} /> Demo Video
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <AnimatedSection className="mt-12">
            <div className="section-label text-primary-600 dark:text-primary-400">
              <Wrench size={14} /> Tech Stack
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-xl border border-green-200/60 bg-primary-50/70 px-3.5 py-1.5 text-xs font-bold text-primary-700 dark:border-green-900/50 dark:bg-primary-950/40 dark:text-primary-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <AnimatedSection className="mt-8">
            <div className="section-label text-accent-600 dark:text-accent-400">
              <Tag size={14} /> Categories &amp; Tags
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-lg border border-green-200/40 bg-white/60 px-3 py-1 text-xs font-semibold text-[#3a5028] dark:border-green-900/40 dark:bg-[#111a08]/60 dark:text-[#a0c87a]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Description */}
        <AnimatedSection className="mt-12">
          <div className="glass-card rounded-2xl p-7 sm:p-8">
            <h2 className="text-xl font-bold text-[#1a2310] dark:text-[#e8f5d0] pb-3 border-b border-green-100/60 dark:border-green-900/40">
              Overview &amp; Architecture
            </h2>
            <div className="mt-5 space-y-4 text-sm text-[#4a6535] dark:text-[#8ab870] leading-relaxed whitespace-pre-line">
              {project.longDescription || project.shortDescription}
            </div>
          </div>
        </AnimatedSection>

        {/* How It Was Built */}
        {project.howItWasBuilt && (
          <AnimatedSection className="mt-8">
            <div className="glass-card rounded-2xl p-7 sm:p-8">
              <h2 className="text-xl font-bold text-[#1a2310] dark:text-[#e8f5d0] pb-3 border-b border-green-100/60 dark:border-green-900/40">
                How It Was Built &amp; Engineering Decisions
              </h2>
              <div className="mt-5 space-y-4 text-sm text-[#4a6535] dark:text-[#8ab870] leading-relaxed whitespace-pre-line">
                {project.howItWasBuilt}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 && (
          <AnimatedSection className="mt-12">
            <h2 className="text-2xl font-black text-[#1a2310] dark:text-[#e8f5d0]">Screenshots</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {project.images.map((img: any) => (
                <div key={img.id} className="overflow-hidden rounded-xl border border-green-200/60 dark:border-green-900/50 bg-[#080e04]">
                  <img
                    src={img.url}
                    alt={img.altText || project.title}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {img.caption && (
                    <p className="p-3 text-center text-xs text-[#5a7a40] dark:text-[#6a8a55]">{img.caption}</p>
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
