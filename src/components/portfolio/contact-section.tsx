import { useState } from 'react'
import { Mail, MapPin, Send, Check, Copy, Github, Linkedin, Sparkles, MessageSquare } from 'lucide-react'
import { AnimatedSection } from '@/components/portfolio/animated-section'

interface ContactSectionProps {
  profile?: {
    fullName?: string | null
    email?: string | null
    location?: string | null
    githubUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
  } | null
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const email = profile?.email || 'contact@atulverma.dev'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const mailtoSubject = encodeURIComponent(
      form.subject ? `[Portfolio] ${form.subject}` : `Contact from ${form.name}`
    )
    const mailtoBody = encodeURIComponent(
      `${form.message}\n\n---\nFrom: ${form.name}\nEmail: ${form.email}`
    )
    const mailtoUrl = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`

    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  return (
    <section className="pinned-panel relative py-16 md:py-24 rounded-t-[32px] sm:rounded-t-[44px] bg-[#fafbfa] dark:bg-[#090b09] border-t border-black/[0.08] dark:border-white/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.35)] dark:shadow-[0_-25px_60px_rgba(0,0,0,0.85)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-10 text-left">
            <span className="section-tag">
              <MessageSquare size={13} className="text-primary-500" />
              Get In Touch
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141714] dark:text-[#ecf0ea]">
              Let&apos;s build something <span className="shimmer-text">extraordinary.</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-white/60 max-w-xl">
              Have a product in mind, need a full-stack engineer, or want to discuss architecture and ideas? Drop a message or reach out directly.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Contact & Availability */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatedSection delay={0.05}>
              <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
                {/* Status indicator */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-700 dark:text-primary-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                  Open to Full-Time &amp; Contracts
                </div>

                <div className="space-y-4 pt-2">
                  {/* Email row with instant copy */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider block mb-1.5">
                      Direct Email
                    </label>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-black/[0.02] p-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 text-xs font-semibold text-[#141714] hover:text-primary-600 dark:text-[#ecf0ea] dark:hover:text-primary-400 truncate transition-colors selectable-text"
                      >
                        <Mail size={14} className="text-primary-500 shrink-0" />
                        <span className="truncate">{email}</span>
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="flex items-center gap-1 rounded-lg bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-black/[0.1] dark:bg-white/[0.08] dark:text-white/80 dark:hover:bg-white/[0.15] transition-colors shrink-0"
                        title="Copy email to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-primary-500" />
                            <span className="text-primary-600 dark:text-primary-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Location */}
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/70 pt-1">
                      <MapPin size={14} className="text-primary-500 shrink-0" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {/* Turnaround speed */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/50 pt-1">
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                    <span>Typical response time within 24 hours</span>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-white/40 block mb-3">
                    Connect On
                  </span>
                  <div className="flex gap-2">
                    {profile?.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center gap-2 rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-medium text-slate-700 hover:border-primary-500/40 hover:text-primary-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/80 dark:hover:border-primary-500/40 dark:hover:text-primary-400 transition-colors"
                      >
                        <Github size={14} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center gap-2 rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 text-xs font-medium text-slate-700 hover:border-primary-500/40 hover:text-primary-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/80 dark:hover:border-primary-500/40 dark:hover:text-primary-400 transition-colors"
                      >
                        <Linkedin size={14} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <AnimatedSection delay={0.1}>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-primary-500">
                      <Check size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[#141714] dark:text-[#ecf0ea]">
                      Message Prepared!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-white/60 max-w-sm mx-auto">
                      Your default email client was opened. If it didn&apos;t open automatically, you can email me directly at{' '}
                      <a href={`mailto:${email}`} className="text-primary-500 underline font-semibold selectable-text">
                        {email}
                      </a>.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary text-xs mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                          Your Name <span className="text-primary-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-[#111411]"
                          placeholder="e.g. Sarah Jenkins"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                          Your Email <span className="text-primary-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-[#111411]"
                          placeholder="sarah@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-[#111411]"
                        placeholder="e.g. Full-Stack Role / Web App Project"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                        Message <span className="text-primary-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3.5 py-2.5 text-xs text-[#141714] outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#ecf0ea] dark:placeholder:text-white/30 dark:focus:bg-[#111411] resize-none"
                        placeholder="Tell me a bit about what you're working on or looking for..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full justify-center text-xs mt-2"
                    >
                      <Send size={13} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
