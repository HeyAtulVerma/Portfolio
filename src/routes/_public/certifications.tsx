import { createFileRoute } from '@tanstack/react-router'
import { getCertifications } from '@/server/functions/certifications'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getCachedPublicSiteData } from '@/lib/public-data-cache'
import { useState, useMemo } from 'react'
import { Award, ExternalLink, CheckCircle2, Copy, Check, Search, Calendar, FileText, X } from 'lucide-react'

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
  head: () => ({ meta: [{ title: 'Certifications & Credentials - Atul Verma' }] }),
  component: CertificationsPage,
})

function CertificationsPage() {
  const certifications = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewCert, setPreviewCert] = useState<{ title: string; url: string } | null>(null)

  // Unique issuers for filter tabs
  const issuers = useMemo(() => {
    const list = Array.from(new Set(certifications.map((c: any) => c.issuer).filter(Boolean)))
    return ['All', ...list]
  }, [certifications])

  // Filtered certifications
  const filtered = useMemo(() => {
    return certifications.filter((cert: any) => {
      const matchesIssuer = selectedIssuer === 'All' || cert.issuer === selectedIssuer
      const matchesSearch =
        searchQuery === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cert.skills && cert.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchesIssuer && matchesSearch
    })
  }, [certifications, selectedIssuer, searchQuery])

  const copyCredentialId = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="py-20 md:py-28 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-50/50 px-3.5 py-1 text-xs font-semibold text-primary-600 dark:border-primary-500/30 dark:bg-primary-950/40 dark:text-primary-400 mb-4">
                <Award size={14} /> Verified Competencies
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Certifications & Credentials
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Professional licenses, industry certifications, and accredited technical credentials with direct verification links.
              </p>
            </div>

            {/* Quick summary stat */}
            <div className="flex items-center gap-3 glass-card rounded-2xl p-4 self-start md:self-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/70 dark:text-primary-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{certifications.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Verified Credentials</div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Filter and Search Bar */}
        <AnimatedSection delay={0.1} className="mt-12">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by certification, issuer, or skill..."
                className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Issuer Filter Tabs */}
            {issuers.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {issuers.map((issuer: any) => (
                  <button
                    key={issuer}
                    onClick={() => setSelectedIssuer(issuer)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedIssuer === issuer
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'border border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
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
        <div className="mt-10">
          {filtered.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center">
                <Award className="mx-auto text-slate-400 dark:text-slate-600" size={48} />
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No certifications found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'Try adjusting your search criteria or issuer filter.' : 'Certifications are currently being added. Check back soon!'}
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cert: any, idx: number) => (
                <AnimatedSection key={cert.id} delay={idx * 0.06}>
                  <div className="group relative flex flex-col h-full rounded-2xl border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60">
                    {/* Top Row: Issuer & Verification Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                        {cert.issuer}
                      </div>

                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Verified
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {cert.title}
                    </h3>

                    {/* Description if present */}
                    {cert.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {cert.description}
                      </p>
                    )}

                    {/* Issue & Expiration Dates */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expirationDate && (
                        <span>• Expires: {cert.expirationDate}</span>
                      )}
                    </div>

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate mr-2">
                          <span className="text-slate-400 select-none">ID: </span>
                          {cert.credentialId}
                        </div>
                        <button
                          onClick={() => copyCredentialId(cert.id, cert.credentialId)}
                          className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 p-1 transition-colors"
                          title="Copy Credential ID"
                        >
                          {copiedId === cert.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}

                    {/* Skills Tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {cert.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="rounded-md border border-slate-200/60 bg-white/60 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Action Links */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow"
                        >
                          Verify Credential <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Verified by Issuer</span>
                      )}

                      {cert.certificateUrl && (
                        <button
                          onClick={() => setPreviewCert({ title: cert.title, url: cert.certificateUrl })}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                        >
                          <FileText size={13} /> View Certificate
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

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-4">
                {previewCert.title}
              </h3>
              <button
                onClick={() => setPreviewCert(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 flex max-h-[70vh] items-center justify-center overflow-auto rounded-xl bg-slate-50 p-2 dark:bg-slate-950">
              {previewCert.url.endsWith('.pdf') ? (
                <iframe src={previewCert.url} className="h-[60vh] w-full rounded-lg" title={previewCert.title} />
              ) : (
                <img
                  src={previewCert.url}
                  alt={previewCert.title}
                  className="max-h-[60vh] w-auto rounded-lg object-contain shadow-md"
                />
              )}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <a
                href={previewCert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Open Original in New Tab <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setPreviewCert(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
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
