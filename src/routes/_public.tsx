import { useEffect } from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { prefetchPublicSiteData, getWarmPublicDataCache } from '@/lib/public-data-cache'
import { getProfile } from '@/server/functions/profile'

export const Route = createFileRoute('/_public')({
  loader: async () => {
    if (typeof window !== 'undefined') {
      const cached = getWarmPublicDataCache()
      if (cached) return { profile: cached.profile }
    }
    const profile = await getProfile()
    return { profile }
  },
  component: PublicLayout,
})

function PublicLayout() {
  const { profile } = Route.useLoaderData()

  useEffect(() => {
    // Prefetch all public portfolio data in the background after first paint
    prefetchPublicSiteData().catch(err => {
      console.error('Background prefetch failed:', err)
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer profile={profile} />
    </div>
  )
}
