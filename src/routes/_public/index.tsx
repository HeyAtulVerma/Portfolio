import { createFileRoute, Link } from '@tanstack/react-router'
import { getProfile } from '@/server/functions/profile'
import { getProjects } from '@/server/functions/projects'
import { getSkills } from '@/server/functions/skills'
import { HeroSection } from '@/components/portfolio/hero-section'
import { ProjectCard } from '@/components/portfolio/project-card'
import { SkillsGrid } from '@/components/portfolio/skills-grid'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowRight, FileText, Code2, Sparkles } from 'lucide-react'

import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) {
      return { profile: cached.profile, projects: cached.projects, skills: cached.skills }
    }

    const [profileData, projectsData, skillsData] = await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
    ])
    return { profile: profileData, projects: projectsData, skills: skillsData }
  },
  component: HomePage,
})

function HomePage() {
  const { profile, projects, skills } = Route.useLoaderData()

  return (
    <>
      <HeroSection
        name={profile?.fullName || 'Developer'}
        role={profile?.role || 'Full-Stack Developer'}
        bio={profile?.shortBio || 'Building modern web experiences with cutting-edge technologies.'}
        githubUrl={profile?.githubUrl}
        linkedinUrl={profile?.linkedinUrl}
        email={profile?.email}
      />

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    Featured Projects
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    A selection of my recent work
                  </p>
                </div>
                <Link
                  to="/projects"
                  className="hidden items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 sm:flex"
                >
                  View All <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project, idx) => (
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

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400"
              >
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills Preview */}
      {skills.length > 0 && (
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Skills & Expertise
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Technologies I work with
              </p>
            </AnimatedSection>
            <div className="mt-12">
              <SkillsGrid skills={skills} />
            </div>
          </div>
        </section>
      )}

      {/* Quick Links / Stats */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <AnimatedSection delay={0}>
              <Link to="/about" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">About Me</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Learn more about my journey</p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Link to="/projects" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Projects</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Explore my work</p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link to="/resume" className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Resume</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">View my CV</p>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
