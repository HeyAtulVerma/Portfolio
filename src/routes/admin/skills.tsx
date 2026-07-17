import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/server/functions/skills'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/skills')({
  loader: async () => await getSkills(),
  component: AdminSkills,
})

function AdminSkills() {
  const skills = Route.useLoaderData()
  const router = useRouter()
  const [newSkill, setNewSkill] = useState({ name: '', category: '', proficiency: 3 })

  const handleAdd = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) return
    await createSkill({ data: { name: newSkill.name, category: newSkill.category, proficiency: newSkill.proficiency } })
    clearPublicDataCache()
    setNewSkill({ name: '', category: '', proficiency: 3 })
    router.invalidate()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await deleteSkill({ data: { id } })
    clearPublicDataCache()
    router.invalidate()
  }

  const handleUpdateProficiency = async (id: string, proficiency: number) => {
    await updateSkill({ data: { id, proficiency } })
    clearPublicDataCache()
    router.invalidate()
  }

  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skills</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your technical skills</p>

      {/* Add new skill */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add New Skill</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <input
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            placeholder="Category (e.g., Frontend)"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={newSkill.proficiency}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>Proficiency: {n}/5</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newSkill.name.trim() || !newSkill.category.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Skills by category */}
      <div className="mt-8 space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat}</h3>
            <div className="mt-4 space-y-3">
              {skills.filter((s) => s.category === cat).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-white">{skill.name}</span>
                    <select
                      value={skill.proficiency}
                      onChange={(e) => handleUpdateProficiency(skill.id, parseInt(e.target.value))}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}/5</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={() => handleDelete(skill.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
