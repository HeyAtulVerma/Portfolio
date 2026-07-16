import { createFileRoute, Link } from '@tanstack/react-router'
import { getResumeContent } from '@/server/functions/resume'
import { getProfile } from '@/server/functions/profile'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { Download, FileText } from 'lucide-react'

export const Route = createFileRoute('/_public/resume/')({
  loader: async () => {
    const [content, profileData] = await Promise.all([
      getResumeContent(),
      getProfile(),
    ])
    return { content, profile: profileData }
  },
  head: () => ({ meta: [{ title: 'Resume | Portfolio' }] }),
  component: ResumePage,
})

function ResumePage() {
  const { content, profile } = Route.useLoaderData()

  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Resume
              </h1>
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                {profile?.fullName || 'My'} professional background
              </p>
            </div>
            <div className="flex gap-3">
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-700"
                >
                  <FileText size={16} /> View PDF
                </Link>
              )}
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Download size={16} /> Download
                </Link>
              )}
            </div>
          </div>
        </AnimatedSection>

        {content.length === 0 ? (
          <AnimatedSection className="mt-16 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-16 dark:border-slate-800 dark:bg-slate-900">
              <FileText className="mx-auto text-slate-300 dark:text-slate-700" size={48} />
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                Resume content is being prepared. Check back soon!
              </p>
              {profile?.resumeUrl && (
                <Link
                  to="/resume/pdf"
                  className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  View PDF Resume instead
                </Link>
              )}
            </div>
          </AnimatedSection>
        ) : (
          <div className="mt-12 space-y-8">
            {content.map((section, idx) => (
              <AnimatedSection key={section.id} delay={idx * 0.1}>
                <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {section.sectionTitle}
                  </h2>
                  <div className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
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
