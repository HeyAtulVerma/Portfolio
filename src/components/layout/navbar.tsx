import { Moon, Sun, Menu, X, Sparkles, Award } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTheme } from '@/hooks/use-theme'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#070b14]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-opacity hover:opacity-90">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-accent-600 text-sm font-black text-white shadow-md shadow-primary-500/20">
              AV
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Atul Verma
            </span>
          </Link>

          {/* Availability pill */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Available for hire
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"
              activeProps={{ className: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 font-semibold' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Get in touch
          </Link>

          <button
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200/80 bg-white/50 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-slate-200/80 bg-white/50 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn('overflow-hidden transition-all duration-300 md:hidden', mobileOpen ? 'max-h-96' : 'max-h-0')}>
        <nav className="border-t border-slate-200/80 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#070b14]/95">
          <div className="flex items-center gap-1.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Available for new opportunities
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              activeProps={{ className: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 font-semibold' }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Get in touch
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
