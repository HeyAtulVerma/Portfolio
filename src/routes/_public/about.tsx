import { createFileRoute } from '@tanstack/react-router'
import { getProfile } from '@/server/functions/profile'
import { getSkills } from '@/server/functions/skills'
import { SkillsGrid } from '@/components/portfolio/skills-grid'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { MapPin, Mail, Github, Linkedin } from 'lucide-react'
import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/about')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) {
      return { profile: cached.profile, skills: cached.skills }
    }
    const [profileData, skillsData] = await Promise.all([
      getProfile(),
      getSkills(),
    ])
    return { profile: profileData, skills: skillsData }
  },
  head: () => ({ meta: [{ title: 'About - Atul Verma' }] }),
  component: AboutPage,
})

function AboutPage() {
  const { profile, skills } = Route.useLoaderData()

  return (
    <div className="py-16 md:py-24 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection>
          <span className="section-tag">About</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
            A bit about me.
          </h1>
        </AnimatedSection>

        {/* Story & Profile */}
        <div className="mt-10 grid gap-8 md:grid-cols-12 items-start">
          {/* Main Story */}
          <AnimatedSection className="md:col-span-8">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-[#141714] dark:text-[#ecf0ea] mb-4">
                Background &amp; Philosophy
              </h2>
              <div className="space-y-4 text-sm text-slate-600 dark:text-white/70 leading-relaxed">
                {profile?.longBio ? (
                  profile.longBio.split('\n').filter(Boolean).map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <>
                    <p>
                      I am a full-stack developer dedicated to building responsive, accessible, and high-performance digital products.
                    </p>
                    <p>
                      My core focus is modern TypeScript, React, and robust backend services. I enjoy exploring systems tools and shipping clean, well-tested code.
                    </p>
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Quick Info Card */}
          <AnimatedSection delay={0.1} className="md:col-span-4">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-4">
                Quick Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <span>{profile?.role || 'Full-Stack Developer'}</span>
                </div>
                {profile?.location && (
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/80">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/80">
                    <Mail size={13} className="text-slate-400" />
                    <a href={`mailto:${profile.email}`} className="hover:text-primary-500 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex gap-2">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-slate-600 hover:text-slate-900 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/70 dark:hover:text-white transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-slate-600 hover:text-slate-900 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/70 dark:hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mt-16">
            <AnimatedSection>
              <div className="mb-8">
                <span className="section-tag">Toolkit</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
                  Technologies &amp; Tools
                </h2>
              </div>
            </AnimatedSection>
            <SkillsGrid skills={skills} />
          </div>
        )}
      </div>
    </div>
  )
}
