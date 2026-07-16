import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Atul Verma
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Building digital experiences that matter.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">Navigation</h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/projects', label: 'Projects' },
                { href: '/about', label: 'About' },
                { href: '/resume', label: 'Resume' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">Connect</h4>
            <div className="mt-3 flex gap-3">
              <a href="#" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                <Github size={20} />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                <Linkedin size={20} />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                <Twitter size={20} />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">Get in Touch</h4>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Open for opportunities and collaborations.
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Contact Me
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Portfolio. Built with TanStack Start.
          </p>
        </div>
      </div>
    </footer>
  )
}
