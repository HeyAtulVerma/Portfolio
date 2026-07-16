import { motion } from 'motion/react'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface HeroSectionProps {
  name?: string
  role?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  email?: string
}

export function HeroSection({ name = 'Developer', role = 'Full-Stack Developer', bio = 'Building modern web experiences', githubUrl, linkedinUrl, email }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-600/10" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl dark:bg-accent-600/10" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-widest text-primary-600 dark:text-primary-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 bg-clip-text text-transparent">
              {name}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 text-xl font-medium text-slate-600 dark:text-slate-300 sm:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {role}
          </motion.p>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {bio}
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link
              to="/projects"
              className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30"
            >
              View My Work
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
            >
              Get in Touch
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                <Github size={22} />
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                <Linkedin size={22} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                <Mail size={22} />
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="text-slate-400" size={24} />
        </motion.div>
      </div>
    </section>
  )
}
