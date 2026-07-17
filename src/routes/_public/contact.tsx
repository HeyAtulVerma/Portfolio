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
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Have a project in mind? Let&apos;s talk about it.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Your name"
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
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700"
              >
                <Send size={16} />
                {sent ? 'Opening email client...' : 'Send Message'}
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Mail size={18} className="text-primary-500" />
                      <a href={`mailto:${profile.email}`} className="hover:text-primary-600">{profile.email}</a>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <MapPin size={18} className="text-primary-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary-500 to-accent-600 p-8 text-white">
                <h3 className="text-lg font-bold">Let&apos;s work together</h3>
                <p className="mt-2 text-sm text-white/80">
                  I&apos;m always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
