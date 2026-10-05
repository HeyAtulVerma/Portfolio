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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-50/50 px-3.5 py-1 text-xs font-semibold text-primary-600 dark:border-primary-500/30 dark:bg-primary-950/40 dark:text-primary-400 mb-3">
                <FileText size={14} /> Curriculum Vitae
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Resume & Background
              </h1>
              <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
                {profile?.fullName || 'Atul Verma'} — Professional Experience & Qualifications
              </p>
            </div>
            <div className="flex gap-3">
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
                >
                  <FileText size={15} /> View PDF
                </Link>
              )}
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
                >
                  <Download size={15} /> Download
                </Link>
              )}
            </div>
          </div>
        </AnimatedSection>

        {content.length === 0 ? (
          <AnimatedSection className="mt-12 text-center">
            <div className="glass-card rounded-2xl p-16">
              <FileText className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Resume content is being prepared. Check back soon!
              </p>
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="mt-4 inline-block text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
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
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    {section.sectionTitle}
                  </h2>
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
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
