import { useState, useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createCertification, updateCertification } from '@/server/functions/certifications'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'
import { Plus, X, Upload, Save, Award, ExternalLink, FileText } from 'lucide-react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

interface CertificationFormProps {
  certification?: {
    id: string
    title: string
    issuer: string
    issueDate: string
    expirationDate: string | null
    credentialId: string | null
    credentialUrl: string
    certificateUrl: string | null
    certificatePublicId: string | null
    skills: string[]
    description: string
    sortOrder: number
    isPublished: boolean
  }
}

export function CertificationForm({ certification }: CertificationFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expirationDate: certification?.expirationDate || '',
    credentialId: certification?.credentialId || '',
    credentialUrl: certification?.credentialUrl || '',
    certificateUrl: certification?.certificateUrl || '',
    certificatePublicId: certification?.certificatePublicId || '',
    skills: certification?.skills || [] as string[],
    description: certification?.description || '',
    sortOrder: certification?.sortOrder ?? 0,
    isPublished: certification?.isPublished ?? true,
  })

  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  // Cloudinary upload for certificate image or PDF
  const { openWidget, results, uploading } = useCloudinaryUpload('portfolio/certifications', {
    allowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
    maxFiles: 1,
    resourceType: 'auto',
  })

  const processedResults = useRef(new Set<string>())
  useEffect(() => {
    if (results.length > 0) {
      const lastUpload = results[results.length - 1]
      if (!processedResults.current.has(lastUpload.public_id)) {
        processedResults.current.add(lastUpload.public_id)
        setForm(prev => ({
          ...prev,
          certificateUrl: lastUpload.secure_url,
          certificatePublicId: lastUpload.public_id,
        }))
      }
    }
  }, [results])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (certification) {
        await updateCertification({
          data: {
            id: certification.id,
            ...form,
            expirationDate: form.expirationDate ? form.expirationDate : null,
            credentialId: form.credentialId ? form.credentialId : null,
            certificateUrl: form.certificateUrl ? form.certificateUrl : null,
            certificatePublicId: form.certificatePublicId ? form.certificatePublicId : null,
          }
        })
      } else {
        await createCertification({
          data: {
            ...form,
            expirationDate: form.expirationDate ? form.expirationDate : null,
            credentialId: form.credentialId ? form.credentialId : null,
            certificateUrl: form.certificateUrl ? form.certificateUrl : null,
            certificatePublicId: form.certificatePublicId ? form.certificatePublicId : null,
          } as any
        })
      }
      clearPublicDataCache()
      router.navigate({ to: '/admin/certifications' })
    } catch (err) {
      console.error(err)
      alert('Failed to save certification. Please check the inputs.')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    const val = skillInput.trim()
    if (val && !form.skills.includes(val)) {
      setForm({ ...form, skills: [...form.skills, val] })
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skillToRemove) })
  }

  const inputClass = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Certification Details
        </h2>

        {/* Title and Issuer */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Certification Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Issuing Organization *
            </label>
            <input
              required
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services, Google, Meta"
              className={inputClass}
            />
          </div>
        </div>

        {/* Issue Date & Expiry Date */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Issue Date *
            </label>
            <input
              required
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              placeholder="e.g. Aug 2024"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Expiration Date (Optional)
            </label>
            <input
              value={form.expirationDate || ''}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
              placeholder="e.g. Aug 2027 (or leave blank if no expiry)"
              className={inputClass}
            />
          </div>
        </div>

        {/* Credential ID and Verification URL */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Credential ID (Optional)
            </label>
            <input
              value={form.credentialId || ''}
              onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
              placeholder="e.g. AWS-12345678"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Verification Link / URL
            </label>
            <input
              type="url"
              value={form.credentialUrl}
              onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
              placeholder="https://www.credly.com/badges/..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Description / Overview (Optional)
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Briefly describe what competencies this certification demonstrates..."
            className={inputClass}
          />
        </div>

        {/* Associated Skills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Associated Skills / Topics
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent-500/20 bg-accent-50/60 px-3 py-1 text-xs font-semibold text-accent-700 dark:bg-accent-950/40 dark:text-accent-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded p-0.5 hover:bg-accent-200 dark:hover:bg-accent-800"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="e.g. Cloud Architecture, Docker, PostgreSQL (Press Enter)"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 outline-none focus:border-accent-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Certificate File Upload (Cloudinary) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Certificate Document / Image
          </label>
          <div className="mt-3">
            {form.certificateUrl ? (
              <div className="relative mb-3 inline-block rounded-xl border border-slate-200 p-2 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                {form.certificateUrl.endsWith('.pdf') ? (
                  <div className="flex items-center gap-3 p-3">
                    <FileText size={32} className="text-primary-500" />
                    <span className="text-xs font-mono truncate max-w-xs">{form.certificateUrl}</span>
                  </div>
                ) : (
                  <img
                    src={form.certificateUrl}
                    alt="Certificate Preview"
                    className="h-36 rounded-lg object-contain"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, certificateUrl: '', certificatePublicId: '' })}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-md hover:bg-rose-600"
                  title="Remove File"
                >
                  <X size={14} />
                </button>
              </div>
            ) : null}

            <div>
              <button
                type="button"
                onClick={openWidget}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-5 py-3 text-xs font-semibold text-slate-700 transition-colors hover:border-accent-500 hover:bg-white hover:text-accent-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-accent-400"
              >
                <Upload size={15} />
                {uploading ? 'Uploading to Cloudinary...' : form.certificateUrl ? 'Change Certificate File' : 'Upload Certificate (Image or PDF)'}
              </button>
            </div>
          </div>
        </div>

        {/* Sort Order & Publishing */}
        <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Sort Order (0 = highest priority)
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
            />
            <label htmlFor="isPublished" className="text-sm font-semibold text-slate-800 dark:text-slate-200 select-none cursor-pointer">
              Published on Public Site
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 disabled:opacity-50 transition-all"
        >
          <Save size={16} />
          {saving ? 'Saving...' : certification ? 'Update Certification' : 'Create Certification'}
        </button>

        <button
          type="button"
          onClick={() => router.navigate({ to: '/admin/certifications' })}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
