import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { checkUsersExist } from '@/server/functions/auth-check'
import { Lock, Mail, LogIn } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  loader: async () => {
    const hasUsers = await checkUsersExist()
    if (!hasUsers) {
      throw redirect({ to: '/setup' })
    }
    return {}
  },
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      setError(result.error.message || 'Invalid credentials')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950">
              <LogIn className="text-primary-600 dark:text-primary-400" size={28} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative mt-1">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="admin@portfolio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative mt-1">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
