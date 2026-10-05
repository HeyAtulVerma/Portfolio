import { createFileRoute, Link } from '@tanstack/react-router'
import { getProfile } from '@/server/functions/profile'
import { getProjects } from '@/server/functions/projects'
import { getSkills } from '@/server/functions/skills'
import { getCertifications } from '@/server/functions/certifications'
import { HeroSection } from '@/components/portfolio/hero-section'
import { ProjectCard } from '@/components/portfolio/project-card'
import { SkillsGrid } from '@/components/portfolio/skills-grid'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowRight, FileText, Code2, Sparkles, Award, CheckCircle2, ExternalLink } from 'lucide-react'
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
        bio={profile?.shortBio || 'Building modern web experiences and high-performance software with TypeScript, React, Next.js, Rust, and Python.'}
        githubUrl={profile?.githubUrl}
        linkedinUrl={profile?.linkedinUrl}
        email={profile?.email}
      />

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="py-20 md:py-28 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
                    <Code2 size={14} /> Featured Portfolio
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Selected Works
                  </h2>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    A collection of production web applications, desktop utilities, and games.
                  </p>
                </div>
                <Link
                  to="/projects"
                  className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-100 hover:shadow dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex"
                >
                  View All Projects <ArrowRight size={14} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                View All Projects <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Verified Certifications Preview Section */}
      {certifications && certifications.length > 0 && (
        <section className="py-20 md:py-28 bg-slate-50/70 dark:bg-[#060911]/60 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-2">
                    <Award size={14} /> Validated Knowledge
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Certifications & Licenses
                  </h2>
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    Official technical qualifications and industry certifications with verifiable credentials.
                  </p>
                </div>
                <Link
                  to="/certifications"
                  className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-100 hover:shadow dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex"
                >
                  View All Certifications <ArrowRight size={14} />
                </Link>
              </div>
            </AnimatedSection>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.slice(0, 3).map((cert: any, idx: number) => (
                <AnimatedSection key={cert.id} delay={idx * 0.1}>
                  <div className="group relative flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                        {cert.issuer}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 size={11} className="text-emerald-500" /> Verified
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {cert.title}
                    </h3>

                    {cert.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {cert.description}
                      </p>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {cert.issueDate}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Verify <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/certifications"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                View All Certifications <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills & Expertise Section */}
      {skills.length > 0 && (
        <section className="py-20 md:py-28 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Sparkles size={14} /> Core Competencies
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Skills & Technical Expertise
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Languages, frameworks, databases, and DevOps tools used in real-world production environments.
              </p>
            </AnimatedSection>

            <div className="mt-12">
              <SkillsGrid skills={skills} />
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="py-20 md:py-24 bg-slate-50/70 dark:bg-[#060911]/60 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <AnimatedSection delay={0}>
              <Link
                to="/about"
                className="group glass-card flex items-center gap-4 rounded-2xl p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">About Me</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Background, journey & philosophy</p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Link
                to="/projects"
                className="group glass-card flex items-center gap-4 rounded-2xl p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-accent-600 transition-colors">Projects</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live demos & architecture case studies</p>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link
                to="/resume"
                className="group glass-card flex items-center gap-4 rounded-2xl p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Resume</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View formatted CV & download PDF</p>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
