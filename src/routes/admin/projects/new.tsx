import { createFileRoute } from '@tanstack/react-router'
import { ProjectForm } from '@/components/admin/project-form'

export const Route = createFileRoute('/admin/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Project</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a new portfolio project</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <ProjectForm />
      </div>
    </div>
  )
}
