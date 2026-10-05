import { createFileRoute } from '@tanstack/react-router'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getProfile } from '@/server/functions/profile'
import { Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/contact')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) {
      return { profile: cached.profile }
    }

    const profileData = await getProfile()
    return { profile: profileData }
  },
  head: () => ({ meta: [{ title: 'Contact - Atul Verma' }] }),
  component: ContactPage,
})

function ContactPage() {
  const { profile } = Route.useLoaderData()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (profile?.email) {
      const mailto = `mailto:${profile.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.name} (${form.email})`
      window.location.href = mailto
      setSent(true)
    }
  }

  return (
    <div className="py-20 md:py-28 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-50/50 px-3.5 py-1 text-xs font-semibold text-primary-600 dark:border-primary-500/30 dark:bg-primary-950/40 dark:text-primary-400 mb-4">
            Start a Conversation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
            Have a project in mind, need technical expertise, or looking to collaborate? Let&apos;s connect.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-7 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Jane Doe"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Tell me about your project..."
                />
              </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all hover:bg-primary-700"
                >
                  <Send size={15} />
                  {sent ? 'Opening email client...' : 'Send Message'}
                </button>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-7 sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Direct Contact
                </h3>
                <div className="mt-5 space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                        <Mail size={16} />
                      </div>
                      <a href={`mailto:${profile.email}`} className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-950/60 dark:text-accent-400">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-medium">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-primary-600 via-accent-600 to-indigo-700 p-7 sm:p-8 text-white shadow-lg shadow-primary-500/10">
                <h3 className="text-lg font-bold">Open for Collaborations</h3>
                <p className="mt-2 text-sm text-white/90 leading-relaxed">
                  I&apos;m currently available for full-stack engineering contracts, freelance projects, and full-time technical roles. Let&apos;s build something remarkable together.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
