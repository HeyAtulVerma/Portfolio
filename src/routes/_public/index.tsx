import { createFileRoute, Link } from '@tanstack/react-router'
import { getProfile } from '@/server/functions/profile'
import { getProjects } from '@/server/functions/projects'
import { getSkills } from '@/server/functions/skills'
import { getCertifications } from '@/server/functions/certifications'
import { HeroSection } from '@/components/portfolio/hero-section'
import { ProjectCard } from '@/components/portfolio/project-card'
import { SkillsGrid } from '@/components/portfolio/skills-grid'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) {
      return {
        profile: cached.profile,
        projects: cached.projects,
        skills: cached.skills,
        certifications: (cached as any).certifications || []
      }
    }
    const [profileData, projectsData, skillsData, certsData] = await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getCertifications(),
    ])
    return { profile: profileData, projects: projectsData, skills: skillsData, certifications: certsData }
  },
  component: HomePage,
})

function HomePage() {
  const { profile, projects, skills, certifications } = Route.useLoaderData()

  return (
    <>
      <HeroSection
        name={profile?.fullName || 'Atul Verma'}
        role={profile?.role || 'Full-Stack Developer'}
        bio={profile?.shortBio}
        githubUrl={profile?.githubUrl}
        linkedinUrl={profile?.linkedinUrl}
        email={profile?.email}
      />

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-16 md:py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="section-tag">Featured Work</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
                    Selected Projects
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 dark:text-white/60 dark:hover:text-primary-400 transition-colors"
                >
                  View All ({projects.length}) <ArrowRight size={13} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project: any, idx: number) => (
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
              <Link to="/projects" className="btn-secondary text-xs">
                View All Projects <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="py-16 md:py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection>
              <div className="mb-10">
                <span className="section-tag">Capabilities</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
                  Tech Stack
                </h2>
              </div>
            </AnimatedSection>

            <SkillsGrid skills={skills} />
          </div>
        </section>
      )}

      {/* Certifications Preview */}
      {certifications && certifications.length > 0 && (
        <section className="py-16 md:py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="section-tag">Credentials</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
                    Certifications
                  </h2>
                </div>
                <Link
                  to="/certifications"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 dark:text-white/60 dark:hover:text-primary-400 transition-colors"
                >
                  View All ({certifications.length}) <ArrowRight size={13} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.slice(0, 3).map((cert: any, idx: number) => (
                <AnimatedSection key={cert.id} delay={idx * 0.08}>
                  <div className="glass-card rounded-2xl p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50">
                        {cert.issuer}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary-600 dark:text-primary-400">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-[#141714] dark:text-[#ecf0ea] line-clamp-2">
                      {cert.title}
                    </h3>

                    <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-slate-400 dark:text-white/40">{cert.issueDate}</span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Verify <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
