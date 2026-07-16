import { createFileRoute } from '@tanstack/react-router'
import { getProjects } from '@/server/functions/projects'
import { ProjectCard } from '@/components/portfolio/project-card'
import { AnimatedSection } from '@/components/portfolio/animated-section'

export const Route = createFileRoute('/_public/projects/')({
  loader: async () => await getProjects(),
  head: () => ({ meta: [{ title: 'Projects - Atul Verma' }] }),
  component: ProjectsPage,
})

function ProjectsPage() {
  const projects = Route.useLoaderData()

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            Projects
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            A collection of my work and personal projects
          </p>
        </AnimatedSection>

        {projects.length === 0 ? (
          <AnimatedSection className="mt-16 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-16 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-lg text-slate-500 dark:text-slate-400">
                No projects yet. Check back soon!
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
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
  )
}
