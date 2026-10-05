import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/server/functions/skills'
import { useState } from 'react'
import { Plus, Trash2, Wrench, Sparkles } from 'lucide-react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/skills')({
  loader: async () => await getSkills(),
  component: AdminSkills,
})

function AdminSkills() {
  const skills = Route.useLoaderData()
  const router = useRouter()
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 4 })
  const [adding, setAdding] = useState(false)

  const commonCategories = [
    'Frontend',
    'Backend',
    'Languages',
    'Frameworks',
    'Database & ORMs',
    'Tools & DevOps',
    'System',
  ]

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.name.trim() || !newSkill.category.trim()) return
    setAdding(true)
    try {
      await createSkill({
        data: {
          name: newSkill.name.trim(),
          category: newSkill.category.trim(),
          proficiency: newSkill.proficiency
        }
      })
      clearPublicDataCache()
      setNewSkill({ name: '', category: newSkill.category, proficiency: 4 })
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to add skill')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return
    try {
      await deleteSkill({ data: { id } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to delete skill')
    }
  }

  const handleUpdateProficiency = async (id: string, proficiency: number) => {
    try {
      await updateSkill({ data: { id, proficiency } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
    }
  }

  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Technical Skills Matrix</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Organize your technologies, frameworks, and competencies by category.
        </p>
      </div>

      {/* Add new skill card */}
      <div className="glass-card rounded-2xl p-6 sm:p-7">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
          Add New Technology
        </h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-3">
          <input
            required
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name (e.g. Next.js, Rust)"
            className="flex-1 min-w-[180px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            list="categories-list"
            required
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            placeholder="Category"
            className="w-44 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <datalist id="categories-list">
            {commonCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <select
            value={newSkill.proficiency}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value={5}>Expert / Core</option>
            <option value={4}>Advanced</option>
            <option value={3}>Proficient</option>
            <option value={2}>Working Knowledge</option>
          </select>

          <button
            type="submit"
            disabled={adding || !newSkill.name.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Plus size={15} /> {adding ? 'Adding...' : 'Add Skill'}
          </button>
        </form>
      </div>

      {/* Skills by category */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{cat}</h3>
              <span className="text-xs text-slate-500">{skills.filter((s) => s.category === cat).length} skills</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">{skill.name}</span>
                      <select
                        value={skill.proficiency}
                        onChange={(e) => handleUpdateProficiency(skill.id, parseInt(e.target.value))}
                        className="mt-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 bg-transparent outline-none cursor-pointer"
                      >
                        <option value={5}>Expert</option>
                        <option value={4}>Advanced</option>
                        <option value={3}>Proficient</option>
                        <option value={2}>Basic</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 size={15} />
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
