import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getProfile, updateProfile } from '@/server/functions/profile'
import { useState } from 'react'
import { Save } from 'lucide-react'

export const Route = createFileRoute('/admin/profile')({
  loader: async () => await getProfile(),
  component: AdminProfile,
})

function AdminProfile() {
  const profile = Route.useLoaderData()
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    role: profile?.role || '',
    shortBio: profile?.shortBio || '',
    longBio: profile?.longBio || '',
    email: profile?.email || '',
    location: profile?.location || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    twitterUrl: profile?.twitterUrl || '',
    websiteUrl: profile?.websiteUrl || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile({ data: form })
    setSaving(false)
    setSaved(true)
    router.invalidate()
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your personal information</p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role / Title</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass} placeholder="Full-Stack Developer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Short Bio (shown on hero)</label>
            <textarea rows={2} value={form.shortBio} onChange={(e) => setForm({ ...form, shortBio: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Long Bio (shown on About page)</label>
            <textarea rows={8} value={form.longBio} onChange={(e) => setForm({ ...form, longBio: e.target.value })} className={inputClass} placeholder="Write multiple paragraphs about yourself..." />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="City, Country" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn URL</label>
              <input type="url" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className={inputClass} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Twitter/X URL</label>
              <input type="url" value={form.twitterUrl} onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })} className={inputClass} placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Website URL</label>
              <input type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
          {saved && <span className="text-sm text-green-600 dark:text-green-400">Saved successfully!</span>}
        </div>
      </form>
    </div>
  )
}
