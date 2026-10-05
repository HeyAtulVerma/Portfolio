import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getAllProjects, deleteProject, updateProject } from '@/server/functions/projects'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, Github } from 'lucide-react'
import { useState, useMemo } from 'react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/projects/')({
  loader: async () => await getAllProjects(),
  component: AdminProjectsList,
})

function AdminProjectsList() {
  const projects = Route.useLoaderData()
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteProject({ data: { id } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to delete project')
    } finally {
      setDeleting(null)
    }
  }

  const togglePublished = async (id: string, current: boolean) => {
    try {
      await updateProject({ data: { id, isPublished: !current } })
      clearPublicDataCache()
      router.invalidate()
    } catch (err) {
      console.error(err)
      alert('Failed to update status')
    }
  }

  const filtered = useMemo(() => {
    return projects.filter((p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.techStack && p.techStack.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
    )
  }, [projects, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your portfolio projects, demos, and tech stacks</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-700 self-start sm:self-auto"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200/80 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No projects found.</p>
          <Link
            to="/admin/projects/new"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            Create a project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project: any) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="h-16 w-24 rounded-xl object-cover flex-shrink-0 border border-slate-200/60 dark:border-slate-800"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <span className="text-2xl font-bold text-slate-400">{project.title[0]}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.slug}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.techStack?.slice(0, 3).map((t: string) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => togglePublished(project.id, project.isPublished)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    project.isPublished
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Click to toggle publish status"
                >
                  {project.isPublished ? (
                    <>
                      <Eye size={12} className="text-emerald-500" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={12} /> Draft
                    </>
                  )}
                </button>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    title="Live Demo"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}

                <Link
                  to="/admin/projects/$id"
                  params={{ id: project.id }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                  title="Edit Project"
                >
                  <Edit size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={deleting === project.id}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 disabled:opacity-50"
                  title="Delete Project"
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
