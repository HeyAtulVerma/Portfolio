import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load .env from project root (process.cwd() = project root in Vite dev server)
function loadEnvFile(): Record<string, string> {
  const envPaths = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '..', '.env'),
  ]
  for (const envPath of envPaths) {
    try {
      const content = readFileSync(envPath, 'utf-8')
      const env: Record<string, string> = {}
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        const value = trimmed.slice(eqIndex + 1).trim()
        env[key] = value
      }
      return env
    } catch { continue }
  }
  return {}
}

const fileEnv = loadEnvFile()

/**
 * Get an environment variable from process.env, import.meta.env, or .env file.
 * Works in any runtime context (Node.js, Vite SSR, Nitro, etc.)
 */
export function getEnv(key: string): string {
  return process.env[key]
    ?? (import.meta as any).env?.[key]
    ?? fileEnv[key]
    ?? ''
}
