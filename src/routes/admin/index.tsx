import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllProjects } from '@/server/functions/projects'
import { getSkills } from '@/server/functions/skills'
import { getExperiences } from '@/server/functions/experiences'
import { FolderOpen, Wrench, Briefcase, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  loader: async () => {
    const [projects, skills, experiences] = await Promise.all([
      getAllProjects(),
      getSkills(),
      getExperiences(),
    ])
    return {
      projectCount: projects.length,
      skillCount: skills.length,
      experienceCount: experiences.length,
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const stats = Route.useLoaderData()

  const cards = [
    { label: 'Projects', count: stats.projectCount, icon: FolderOpen, href: '/admin/projects', color: 'bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400' },
    { label: 'Skills', count: stats.skillCount, icon: Wrench, href: '/admin/skills', color: 'bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400' },
    { label: 'Experiences', count: stats.experienceCount, icon: Briefcase, href: '/admin/experiences', color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your portfolio</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon size={24} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{card.count}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/projects/new" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700">
            Add New Project
          </Link>
          <Link to="/admin/profile" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Edit Profile
          </Link>
          <Link to="/admin/resume" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Upload Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
