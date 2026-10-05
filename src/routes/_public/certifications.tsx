import { createFileRoute } from '@tanstack/react-router'
import { getCertifications } from '@/server/functions/certifications'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'
import { useState, useMemo } from 'react'
import { ExternalLink, CheckCircle2, Search, Calendar, FileText, X } from 'lucide-react'

export const Route = createFileRoute('/_public/certifications')({
  loader: async () => {
    if (typeof window !== 'undefined') {
      const cached = await getCachedPublicSiteData()
      if (cached && (cached as any).certifications) {
        return (cached as any).certifications
      }
    }
    return await getCertifications()
  },
  head: () => ({ meta: [{ title: 'Certifications - Atul Verma' }] }),
  component: CertificationsPage,
})

function CertificationsPage() {
  const certifications = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All')
  const [previewCert, setPreviewCert] = useState<{ title: string; url: string } | null>(null)

  const issuers = useMemo(() => {
    const list = Array.from(new Set(certifications.map((c: any) => c.issuer).filter(Boolean)))
    return ['All', ...list]
  }, [certifications])

  const filtered = useMemo(() => {
    return certifications.filter((cert: any) => {
      const matchesIssuer = selectedIssuer === 'All' || cert.issuer === selectedIssuer
      const matchesSearch =
        searchQuery === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.skills && cert.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchesIssuer && matchesSearch
    })
  }, [certifications, selectedIssuer, searchQuery])

  return (
    <div className="py-16 md:py-24 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection>
          <span className="section-tag">Credentials</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
            Certifications
          </h1>
        </AnimatedSection>

        {/* Filter and Search */}
        <AnimatedSection delay={0.08} className="mt-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certifications..."
                className="w-full rounded-xl border border-black/[0.08] bg-white/70 py-2 pl-9 pr-3 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {issuers.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {issuers.map((issuer: any) => (
                  <button
                    key={issuer}
                    onClick={() => setSelectedIssuer(issuer)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedIssuer === issuer
                        ? 'bg-primary-500 text-[#090b09] font-bold'
                        : 'border border-black/[0.06] bg-white/60 text-slate-600 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {issuer}
                  </button>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Certifications Grid */}
        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/[0.08] dark:border-white/[0.08] p-12 text-center text-xs text-slate-500 dark:text-white/40">
              No certifications match your criteria.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cert: any, idx: number) => (
                <AnimatedSection key={cert.id} delay={(idx % 3) * 0.06}>
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

                    {cert.issueDate && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-white/40">
                        <Calendar size={11} />
                        <span>{cert.issueDate}</span>
                      </div>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {cert.skills.slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="rounded px-1.5 py-0.5 text-[10px] bg-black/[0.03] text-slate-600 dark:bg-white/[0.04] dark:text-white/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between mt-auto">
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Verify <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Verified</span>
                      )}

                      {cert.certificateUrl && (
                        <button
                          onClick={() => setPreviewCert({ title: cert.title, url: cert.certificateUrl })}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-white/50 dark:hover:text-white"
                        >
                          <FileText size={11} /> View
                        </button>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0c0e0c]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.06]">
              <h3 className="text-sm font-bold text-[#141714] dark:text-[#ecf0ea] truncate pr-4">
                {previewCert.title}
              </h3>
              <button
                onClick={() => setPreviewCert(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex max-h-[65vh] items-center justify-center overflow-auto rounded-xl bg-black/[0.02] p-2 dark:bg-white/[0.02]">
              {previewCert.url.endsWith('.pdf') ? (
                <iframe src={previewCert.url} className="h-[55vh] w-full rounded-lg" title={previewCert.title} />
              ) : (
                <img
                  src={previewCert.url}
                  alt={previewCert.title}
                  className="max-h-[55vh] w-auto rounded-lg object-contain"
                />
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewCert(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
