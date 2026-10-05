import { Outlet, createFileRoute, redirect, Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { getSession } from '@/server/functions/auth-check'
import { authClient } from '@/lib/auth-client'
import {
  LayoutDashboard,
  FolderOpen,
  User,
  FileText,
  Wrench,
  Briefcase,
  Award,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/experiences', label: 'Experience', icon: Briefcase },
  { href: '/admin/resume', label: 'Resume', icon: FileText },
  { href: '/admin/profile', label: 'Profile', icon: User },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: '/login' })
  }

  // Current page label
  const activeLink = adminLinks.find(link =>
    link.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(link.href)
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#0b0f19] transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6 dark:border-slate-800/80">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-md shadow-primary-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white">Admin Console</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Atul Verma</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Portfolio Management
          </div>
          <nav className="space-y-1.5">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = link.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  )}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                  {link.label}
                  {link.label === 'Certifications' && (
                    <span className="ml-auto rounded-md bg-accent-500/10 px-1.5 py-0.5 text-[10px] font-bold text-accent-600 dark:text-accent-400">
                      New
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="border-t border-slate-200/80 p-4 dark:border-slate-800/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="inline-flex items-center gap-2">
              <ExternalLink size={14} className="text-primary-500" /> View Live Site
            </span>
            <span className="text-[10px] text-slate-400">atul.ople.in</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <LogOut size={16} /> Sign Out of Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#070b14]/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Admin</span>
              <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeLink?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200/80 bg-white/50 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
