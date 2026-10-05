import { createFileRoute } from '@tanstack/react-router'
import { AnimatedSection } from '@/components/portfolio/animated-section'
import { getProfile } from '@/server/functions/profile'
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { getWarmPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/_public/contact')({
  loader: async () => {
    const cached = getWarmPublicDataCache()
    if (cached) return { profile: cached.profile }
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (profile?.email) {
      const mailto = `mailto:${profile.email}?subject=Contact from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.name} (${form.email})`
      window.location.href = mailto
      setSent(true)
    }
  }

  return (
    <div className="py-16 md:py-24 bg-dot-pattern min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AnimatedSection>
          <span className="section-tag">Contact</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
            Get in touch.
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-white/60 max-w-md">
            Open for full-time roles, contracts, and collaborations.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid gap-10 md:grid-cols-12 items-start">
          {/* Form */}
          <AnimatedSection className="md:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-black"
                    placeholder="you@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-black resize-none"
                    placeholder="How can I help?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-xs mt-2">
                  <Send size={13} />
                  {sent ? 'Opening mail client...' : 'Send Message'}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Direct Details */}
          <AnimatedSection delay={0.1} className="md:col-span-5">
            <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
              <h2 className="text-sm font-bold text-[#141714] dark:text-[#ecf0ea]">
                Direct Contact
              </h2>

              <div className="space-y-3 text-xs">
                {profile?.email && (
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/80">
                    <Mail size={14} className="text-primary-500" />
                    <a href={`mailto:${profile.email}`} className="hover:text-primary-500 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-white/80">
                    <MapPin size={14} className="text-primary-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-white/40 block mb-3">
                  Online Profiles
                </span>
                <div className="flex gap-2">
                  {profile?.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.02] text-slate-600 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/70 dark:hover:text-white transition-colors"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {profile?.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.02] text-slate-600 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/70 dark:hover:text-white transition-colors"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
