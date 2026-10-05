import { createFileRoute, Link } from '@tanstack/react-router'
import { getResumeContent } from '@/server/functions/resume'
import { getProfile } from '@/server/functions/profile'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { Download, FileText } from 'lucide-react'
import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/resume/')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) {
      return { content: cached.resumeContent, profile: cached.profile }
    }

    const [content, profileData] = await Promise.all([
      getResumeContent(),
      getProfile(),
    ])
    return { content, profile: profileData }
  },
  head: () => ({ meta: [{ title: 'Resume - Atul Verma' }] }),
  component: ResumePage,
})

function ResumePage() {
  const { content, profile } = Route.useLoaderData()

  return (
    <div className="py-20 md:py-28 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-50/70 px-3.5 py-1 text-xs font-bold text-primary-700 dark:border-primary-500/20 dark:bg-primary-950/40 dark:text-primary-400 mb-3">
                <FileText size={14} /> Curriculum Vitae
              </div>
              <h1 className="text-4xl font-black tracking-tight text-[#1a2310] dark:text-[#e8f5d0] sm:text-5xl">
                Resume &amp; Qualifications
              </h1>
              <p className="mt-2 text-base text-[#5a7a40] dark:text-[#6a8a55]">
                {profile?.fullName || 'Atul Verma'} — Technical Qualifications &amp; Background
              </p>
            </div>
            <div className="flex gap-3">
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="btn-green text-xs px-5 py-2.5"
                >
                  <FileText size={14} /> View PDF
                </Link>
              )}
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="btn-outline text-xs px-5 py-2.5"
                >
                  <Download size={14} /> Download
                </Link>
              )}
            </div>
          </div>
        </AnimatedSection>

        {content.length === 0 ? (
          <AnimatedSection className="mt-12 text-center">
            <div className="glass-card rounded-2xl p-16">
              <FileText className="mx-auto text-primary-500/40" size={48} />
              <p className="mt-4 text-base text-[#5a7a40] dark:text-[#6a8a55]">
                Resume content is being prepared. Check back soon!
              </p>
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="mt-4 inline-block text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  View PDF Resume instead →
                </Link>
              )}
            </div>
          </AnimatedSection>
        ) : (
          <div className="mt-12 space-y-6">
            {content.map((section, idx) => (
              <AnimatedSection key={section.id} delay={idx * 0.08}>
                <div className="glass-card rounded-2xl p-7 sm:p-8">
                  <h2 className="text-xl font-bold text-[#1a2310] dark:text-[#e8f5d0] pb-3 border-b border-green-100/60 dark:border-green-900/40">
                    {section.sectionTitle}
                  </h2>
                  <div className="mt-4 text-sm text-[#4a6535] dark:text-[#8ab870] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
