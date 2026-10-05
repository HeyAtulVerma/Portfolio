import { motion } from 'motion/react'
import { ArrowRight, Award, FileText, Github, Linkedin, Mail, Sparkles, Terminal, Code2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface HeroSectionProps {
  name?: string
  role?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  email?: string
}

export function HeroSection({
  name = 'Atul Verma',
  role = 'Full-Stack & Systems Developer',
  bio = 'Experienced in building scalable full-stack web applications, PWAs, self-hosted platforms, and high-performance native tools with TypeScript, React, Next.js, Rust, and Python.',
  githubUrl,
  linkedinUrl,
  email
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-dot-pattern">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-500/20 via-accent-500/15 to-transparent blur-[120px] dark:from-primary-600/15 dark:via-accent-600/10" />
        <div className="absolute top-1/2 -left-40 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-40 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Available for New Roles & High-Impact Projects</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-7xl dark:text-white max-w-4xl"
          >
            Engineering scalable web apps &{' '}
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-indigo-600 bg-clip-text text-transparent dark:from-primary-400 dark:via-accent-400 dark:to-indigo-300">
              systems that perform.
            </span>
          </motion.h1>

          {/* Developer identity subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex items-center gap-2 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300"
          >
            <span className="font-bold text-slate-900 dark:text-white">{name}</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-primary-600 dark:text-primary-400">{role}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed"
          >
            {bio}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30"
            >
              Explore Projects <ArrowRight size={16} />
            </Link>

            <Link
              to="/certifications"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <Award size={16} className="text-accent-500" /> View Certifications
            </Link>

            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-100/80 px-5 py-3.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200/80 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FileText size={16} /> Resume
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center gap-3"
          >
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Github size={18} />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label="Send email"
                className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <Mail size={18} />
              </a>
            )}
          </motion.div>

          {/* Quick Metrics & Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left"
          >
            <div className="glass-card rounded-2xl p-5">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">5+ Apps</div>
              <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Shipped & Production Tested</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Full-Stack</div>
              <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Next.js, React, Node, PostgreSQL</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Systems</div>
              <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Rust, Python, Go, Docker</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Verified</div>
              <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Certifications & Credentials</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
