import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getCertificationById } from '@/server/functions/certifications'
import { CertificationForm } from '@/components/admin/certification-form'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/admin/certifications/$id')({
  loader: async ({ params }) => {
    const cert = await getCertificationById({ data: { id: params.id } })
    if (!cert) {
      throw notFound()
    }
    return cert
  },
  component: AdminEditCertification,
})

function AdminEditCertification() {
  const certification = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/certifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-accent-600 dark:text-slate-400 mb-2 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Certifications
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Edit Certification
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update credential verification link, details, or upload a new certificate document.
        </p>
      </div>

      <CertificationForm certification={certification} />
    </div>
  )
}
