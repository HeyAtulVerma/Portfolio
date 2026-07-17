import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getExperiences, createExperience, deleteExperience } from '@/server/functions/experiences'
import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/experiences')({
  loader: async () => await getExperiences(),
  component: AdminExperiences,
})

function AdminExperiences() {
  const experiences = Route.useLoaderData()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [newExp, setNewExp] = useState({ role: '', company: '', description: '', startDate: '', endDate: '', isCurrentRole: false })

  const handleAdd = async () => {
    if (!newExp.role.trim()) return
    await createExperience({
      data: {
        role: newExp.role,
        company: newExp.company,
        description: newExp.description,
        startDate: newExp.startDate,
        endDate: newExp.isCurrentRole ? null : newExp.endDate,
        isCurrentRole: newExp.isCurrentRole,
      },
    })
    clearPublicDataCache()
    setNewExp({ role: '', company: '', description: '', startDate: '', endDate: '', isCurrentRole: false })
    setShowForm(false)
    router.invalidate()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    await deleteExperience({ data: { id } })
    clearPublicDataCache()
    router.invalidate()
  }

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Experience</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your work experience</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Experience</h2>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <input value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} placeholder="Role / Title *" className={inputClass} />
              <input value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} placeholder="Company" className={inputClass} />
            </div>
            <textarea rows={4} value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} placeholder="Description" className={inputClass} />
            <div className="grid gap-4 lg:grid-cols-2">
              <input type="text" value={newExp.startDate} onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })} placeholder="Start Date (e.g., Jan 2023)" className={inputClass} />
              <input type="text" value={newExp.endDate} onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })} placeholder="End Date (e.g., Dec 2024)" disabled={newExp.isCurrentRole} className={inputClass} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newExp.isCurrentRole} onChange={(e) => setNewExp({ ...newExp, isCurrentRole: e.target.checked })} className="h-4 w-4 rounded" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Currently working here</span>
            </label>
            <div className="flex gap-3">
              <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                <Save size={16} /> Save
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-xl px-5 py-2.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {experiences.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">No experiences added yet.</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400">{exp.company}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate || ''}
                </p>
                {exp.description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{exp.description}</p>}
              </div>
              <button onClick={() => handleDelete(exp.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
