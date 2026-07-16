import { createFileRoute, Link } from '@tanstack/react-router'
import { getProjectBySlug } from '@/server/functions/projects'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowLeft, ExternalLink, Github, MonitorPlay, Tag, Wrench } from 'lucide-react'
import { notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/projects/$slug')({
  loader: async ({ params }) => {
    const project = await getProjectBySlug({ data: { slug: params.slug } })
    if (!project) {
      throw notFound()
    }
    return project
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title || 'Project'} | Portfolio` }] }),
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData()

  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </AnimatedSection>

        {/* Hero Image */}
        {project.thumbnailUrl && (
          <AnimatedSection className="mt-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
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
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            {project.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-700">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Github size={16} /> Source Code
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <MonitorPlay size={16} /> Demo Video
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <AnimatedSection className="mt-12">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Wrench size={16} /> Tech Stack
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <AnimatedSection className="mt-8">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Tag size={16} /> Tags
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Description */}
        <AnimatedSection className="mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h2>
            <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {project.longDescription || project.shortDescription}
            </div>
          </div>
        </AnimatedSection>

        {/* How It Was Built */}
        {project.howItWasBuilt && (
          <AnimatedSection className="mt-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How It Was Built</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {project.howItWasBuilt}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Project Images Gallery */}
        {project.images && project.images.length > 0 && (
          <AnimatedSection className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Screenshots</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.images.map((img) => (
                <div key={img.id} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <img src={img.url} alt={img.altText || project.title} className="w-full object-cover transition-transform hover:scale-105" loading="lazy" />
                  {img.caption && (
                    <p className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">{img.caption}</p>
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
