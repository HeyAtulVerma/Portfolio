import { Moon, Sun, Menu, X } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTheme } from '@/hooks/use-theme'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouterState()
  const pathname = router.location.pathname

  useEffect(() => {
    let ctx: any
    const run = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        start: 'top -20',
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      })
    }
    run()
    return () => ctx?.revert()
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-[60] transition-all duration-300',
        scrolled
          ? 'border-b border-black/[0.06] bg-[#fafbfa]/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#090b09]/80'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => {
            if (pathname === '/') {
              window.dispatchEvent(new CustomEvent('replay-apple-intro'))
            }
          }}
          className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-[#141714] dark:text-[#ecf0ea] hover:opacity-85 transition-opacity"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-[11px] font-black text-[#090b09]">
            AV
          </span>
          <span className="font-semibold tracking-tight">Atul Verma</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.02] px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/80 hover:border-primary-500/40 transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
            Available
          </Link>

          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-white/60 text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-white/60 text-slate-700 sm:hidden dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/70"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-black/[0.06] bg-[#fafbfa]/95 px-4 py-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#090b09]/95">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-black/[0.04] dark:text-white/70 dark:hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
