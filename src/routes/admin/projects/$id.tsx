import { createFileRoute } from '@tanstack/react-router'
import { getProjectById } from '@/server/functions/projects'
import { ProjectForm } from '@/components/admin/project-form'

export const Route = createFileRoute('/admin/projects/$id')({
  loader: async ({ params }) => await getProjectById({ data: { id: params.id } }),
  component: EditProjectPage,
})

function EditProjectPage() {
  const project = Route.useLoaderData()

  if (!project) {
    return <p className="text-slate-500">Project not found.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Project</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update project details</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
