import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getAllCertifications, deleteCertification, updateCertification } from '@/server/functions/certifications'
import { Plus, Edit, Trash2, Award, ExternalLink, FileText, CheckCircle2, EyeOff, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/certifications/')({
  loader: async () => await getAllCertifications(),
  component: AdminCertificationsList,
})

function AdminCertificationsList() {
  const certifications = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete certification "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteCertification({ data: { id } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to delete certification')
    } finally {
      setDeleting(null)
    }
  }

  const togglePublished = async (id: string, current: boolean) => {
    try {
      await updateCertification({ data: { id, isPublished: !current } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  const filtered = useMemo(() => {
    return certifications.filter((c: any) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()) ||
      (c.credentialId && c.credentialId.toLowerCase().includes(search.toLowerCase()))
    )
  }, [certifications, search])

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Certifications & Licenses
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your verified credentials, verification links, and certificate documents.
          </p>
        </div>

        <Link
          to="/admin/certifications/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-accent-700 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> New Certification
        </Link>
      </div>

      {/* Search Input */}
      {certifications.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certifications..."
            className="w-full rounded-xl border border-slate-200/80 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-accent-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      )}

      {/* List / Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Award className="mx-auto text-slate-400 dark:text-slate-600" size={40} />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            {search ? 'No matching certifications' : 'No certifications added yet'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {search ? 'Try clearing your search query' : 'Upload your first certification with verification credentials'}
          </p>
          {!search && (
            <Link
              to="/admin/certifications/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent-700"
            >
              <Plus size={14} /> Add Certification
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cert: any) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100/70 text-accent-600 dark:bg-accent-950/70 dark:text-accent-400 flex-shrink-0">
                  <Award size={24} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {cert.title}
                    </h3>
                    <span className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {cert.issuer}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span>Issued: {cert.issueDate || 'N/A'}</span>
                    {cert.credentialId && (
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        ID: {cert.credentialId}
                      </span>
                    )}
                    {cert.certificateUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-accent-600 dark:text-accent-400 font-medium">
                        <FileText size={11} /> File Attached
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => togglePublished(cert.id, cert.isPublished)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    cert.isPublished
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Click to toggle publish status"
                >
                  {cert.isPublished ? (
                    <>
                      <CheckCircle2 size={12} className="text-emerald-500" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={12} /> Draft
                    </>
                  )}
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    title="Open Verification Link"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}

                <Link
                  to="/admin/certifications/$id"
                  params={{ id: cert.id }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent-600 dark:hover:bg-slate-800"
                  title="Edit Certification"
                >
                  <Edit size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(cert.id, cert.title)}
                  disabled={deleting === cert.id}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 disabled:opacity-50"
                  title="Delete Certification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
