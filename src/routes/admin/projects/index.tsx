import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getAllProjects, deleteProject } from '@/server/functions/projects'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/admin/projects/')({
  loader: async () => await getAllProjects(),
  component: AdminProjectsList,
})

function AdminProjectsList() {
  const projects = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await deleteProject({ data: { id } })
    router.invalidate()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your portfolio projects</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">No projects yet.</p>
            <Link to="/admin/projects/new" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Create your first project
            </Link>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-4">
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.title} className="h-16 w-24 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <span className="text-2xl font-bold text-slate-300">{project.title[0]}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{project.slug}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {project.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400"><Eye size={12} /> Published</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400"><EyeOff size={12} /> Draft</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={deleting === project.id}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
