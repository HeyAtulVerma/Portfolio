import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllProjects } from '@/server/functions/projects'
import { getAllCertifications } from '@/server/functions/certifications'
import { getSkills } from '@/server/functions/skills'
import { getExperiences } from '@/server/functions/experiences'
import {
  FolderOpen,
  Wrench,
  Briefcase,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  FileText
} from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  loader: async () => {
    const [projects, certifications, skills, experiences] = await Promise.all([
      getAllProjects(),
      getAllCertifications(),
      getSkills(),
      getExperiences(),
    ])
    return {
      projects,
      certifications,
      projectCount: projects.length,
      certificationCount: certifications.length,
      skillCount: skills.length,
      experienceCount: experiences.length,
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const { projects, certifications, projectCount, certificationCount, skillCount, experienceCount } = Route.useLoaderData()

  const cards = [
    {
      label: 'Projects',
      count: projectCount,
      icon: FolderOpen,
      href: '/admin/projects',
      subtext: 'Flagship apps & games',
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20'
    },
    {
      label: 'Certifications',
      count: certificationCount,
      icon: Award,
      href: '/admin/certifications',
      subtext: 'Verified credentials',
      color: 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border-accent-500/20'
    },
    {
      label: 'Technical Skills',
      count: skillCount,
      icon: Wrench,
      href: '/admin/skills',
      subtext: 'Categorized technologies',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      label: 'Work Experience',
      count: experienceCount,
      icon: Briefcase,
      href: '/admin/experiences',
      subtext: 'Career milestones',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Portfolio Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor, update, and manage all public content, projects, and certifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/certifications/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-accent-700 transition-all"
          >
            <Plus size={15} /> Add Certification
          </Link>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition-all"
          >
            <Plus size={15} /> Add Project
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              to={card.href}
              className="group glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {card.count}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.subtext}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Quick Actions & Setup
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/certifications/new"
            className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-accent-50/50 hover:border-accent-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-accent-950/20 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100/70 text-accent-600 dark:bg-accent-950/60 dark:text-accent-400 mb-2 group-hover:scale-110 transition-transform">
              <Award size={20} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Add Certification</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Upload certificate & link</span>
          </Link>

          <Link
            to="/admin/projects/new"
            className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-primary-50/50 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-primary-950/20 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100/70 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform">
              <FolderOpen size={20} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Add Project</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Showcase code & demo</span>
          </Link>

          <Link
            to="/admin/resume"
            className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-emerald-50/50 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-emerald-950/20 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Update Resume</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Upload PDF & sections</span>
          </Link>

          <Link
            to="/admin/profile"
            className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-blue-50/50 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
              <User size={20} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Edit Profile</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Bio, role & socials</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Latest Projects & Latest Certifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects Preview */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen size={18} className="text-primary-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Projects</h2>
            </div>
            <Link to="/admin/projects" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No projects yet.</p>
            ) : (
              projects.slice(0, 4).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.isPublished ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <Eye size={10} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                    <Link
                      to="/admin/projects/$id"
                      params={{ id: p.id }}
                      className="text-xs font-semibold text-slate-500 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Certifications Preview */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-accent-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Certifications & Credentials</h2>
            </div>
            <Link to="/admin/certifications" className="text-xs font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {certifications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500">No certifications uploaded yet.</p>
                <Link
                  to="/admin/certifications/new"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:underline"
                >
                  <Plus size={12} /> Add your first certification
                </Link>
              </div>
            ) : (
              certifications.slice(0, 4).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.issuer} • {c.issueDate}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.isPublished ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                    <Link
                      to="/admin/certifications/$id"
                      params={{ id: c.id }}
                      className="text-xs font-semibold text-slate-500 hover:text-accent-600 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
