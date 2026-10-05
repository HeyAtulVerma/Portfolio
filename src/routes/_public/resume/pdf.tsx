import { createFileRoute, Link } from '@tanstack/react-router'
import { getResumePdfData } from '@/server/functions/resume'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useMemo } from 'react'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/resume/pdf')({
  loader: async () => {
    if (typeof window !== 'undefined') {
      const cached = await getCachedPublicSiteData()
      return cached.resumePdf
    }
    return await getResumePdfData()
  },
  head: () => ({ meta: [{ title: 'Resume PDF - Atul Verma' }] }),
  component: ResumePdfPage,
})

function ResumePdfPage() {
  const pdfBase64 = Route.useLoaderData()
  const pdfSrc = useMemo(() => pdfBase64 ? `data:application/pdf;base64,${pdfBase64}` : null, [pdfBase64])

  const handleDownload = () => {
    if (!pdfSrc) return
    const link = document.createElement('a')
    link.href = pdfSrc
    link.download = 'resume.pdf'
    link.click()
  }

  return (
    <div className="py-12 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a7a40] transition-colors hover:text-primary-600 dark:text-[#7a9c5e] dark:hover:text-primary-400"
            >
              <ArrowLeft size={16} /> Back to Resume
            </Link>
            {pdfSrc && (
              <button
                onClick={handleDownload}
                className="btn-green text-xs px-5 py-2.5"
              >
                <Download size={14} /> Download PDF
              </button>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          {pdfSrc ? (
            <div className="overflow-hidden rounded-2xl border border-green-200/60 bg-white shadow-xl dark:border-green-900/50 dark:bg-[#0c1407]">
              <iframe
                src={pdfSrc}
                className="h-[85vh] w-full"
                title="Resume PDF"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200/60 bg-white p-24 dark:border-green-900/50 dark:bg-[#0c1407]">
              <FileText className="text-primary-500/40" size={64} />
              <p className="mt-4 text-base text-[#5a7a40] dark:text-[#6a8a55]">
                No resume uploaded yet.
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  )
}
