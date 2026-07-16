import { createFileRoute, Link } from '@tanstack/react-router'
import { getResumePdfData } from '@/server/functions/resume'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/_public/resume/pdf')({
  loader: async () => await getResumePdfData(),
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
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              <ArrowLeft size={16} /> Back to Resume
            </Link>
            {pdfSrc && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-700"
              >
                <Download size={16} /> Download PDF
              </button>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          {pdfSrc ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <iframe
                src={pdfSrc}
                className="h-[85vh] w-full"
                title="Resume PDF"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-24 dark:border-slate-800 dark:bg-slate-900">
              <FileText className="text-slate-300 dark:text-slate-700" size={64} />
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                No resume uploaded yet.
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  )
}
