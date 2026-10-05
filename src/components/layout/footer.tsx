import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface FooterProps {
  profile?: {
    githubUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    email?: string | null
  } | null
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="relative z-[52] rounded-t-[32px] sm:rounded-t-[40px] bg-[#fafbfa] dark:bg-[#090b09] border-t border-black/[0.08] dark:border-white/[0.08] py-12 shadow-[0_-20px_50px_rgba(0,0,0,0.35)] dark:shadow-[0_-25px_60px_rgba(0,0,0,0.85)] text-slate-500 dark:text-white/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand / Copyright */}
        <div className="flex items-center gap-3 text-xs">
          <Link to="/" className="font-bold text-[#141714] dark:text-[#ecf0ea] hover:text-primary-500 transition-colors">
            Atul Verma
          </Link>
          <span>·</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link to="/projects" className="hover:text-primary-500 transition-colors">
            Projects
          </Link>
          <Link to="/about" className="hover:text-primary-500 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-primary-500 transition-colors">
            Contact
          </Link>
          {profile?.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              GitHub
            </a>
          )}
          {profile?.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
