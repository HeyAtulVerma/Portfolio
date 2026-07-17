import { getPublicSiteData } from '@/server/functions/public-data'

export type PublicSiteData = Awaited<ReturnType<typeof getPublicSiteData>>

let clientCache: PublicSiteData | null = null
let prefetchPromise: Promise<PublicSiteData> | null = null

export async function prefetchPublicSiteData(): Promise<PublicSiteData | null> {
  if (typeof window === 'undefined') return null
  if (clientCache) return clientCache

  if (!prefetchPromise) {
    prefetchPromise = getPublicSiteData()
      .then(data => {
        clientCache = data
        return data
      })
      .catch(err => {
        prefetchPromise = null // Reset so it can be retried on failure
        throw err
      })
  }

  return prefetchPromise
}

export async function getCachedPublicSiteData(): Promise<PublicSiteData> {
  if (typeof window === 'undefined') {
    return await getPublicSiteData()
  }

  if (clientCache) return clientCache
  const data = await prefetchPublicSiteData()
  if (!data) {
    throw new Error('Failed to prefetch site data')
  }
  return data
}

export function getWarmPublicDataCache(): PublicSiteData | null {
  if (typeof window === 'undefined') return null
  return clientCache
}

export function clearPublicDataCache() {
  if (typeof window !== 'undefined') {
    clientCache = null
    prefetchPromise = null
  }
}
