import { createFileRoute } from '@tanstack/react-router'
import { getProfile } from '@/server/functions/profile'
import { getSkills } from '@/server/functions/skills'
import { getExperiences } from '@/server/functions/experiences'
import { SkillsGrid } from '@/components/portfolio/skills-grid'
import { ExperienceTimeline } from '@/components/portfolio/experience-timeline'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { MapPin, Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react'

export const Route = createFileRoute('/_public/about')({
  loader: async () => {
    const [profileData, skillsData, experiencesData] = await Promise.all([
      getProfile(),
      getSkills(),
      getExperiences(),
    ])
    return { profile: profileData, skills: skillsData, experiences: experiencesData }
  },
  head: () => ({ meta: [{ title: 'About - Atul Verma' }] }),
  component: AboutPage,
})

function AboutPage() {
  const { profile, skills, experiences } = Route.useLoaderData()

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            About Me
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Get to know me better
          </p>
        </AnimatedSection>

        {/* Bio Section */}
        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <AnimatedSection className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Story</h2>
              <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile?.longBio ? (
                  profile.longBio.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <p>A passionate developer dedicated to creating amazing digital experiences. Check back soon for more about my journey!</p>
                )}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Info</h2>
              <div className="mt-4 space-y-4">
                {profile?.fullName && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <span className="font-medium">{profile.fullName}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <MapPin size={18} className="text-primary-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Mail size={18} className="text-primary-500" />
                    <a href={`mailto:${profile.email}`} className="hover:text-primary-600">{profile.email}</a>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  {profile?.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Github size={20} /></a>}
                  {profile?.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Linkedin size={20} /></a>}
                  {profile?.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Twitter size={20} /></a>}
                  {profile?.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Globe size={20} /></a>}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-24">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Skills</h2>
            </AnimatedSection>
            <div className="mt-8">
              <SkillsGrid skills={skills} />
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mt-24">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h2>
            </AnimatedSection>
            <div className="mt-8">
              <ExperienceTimeline experiences={experiences} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
