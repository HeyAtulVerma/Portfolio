import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { resumeContent, profile } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from './auth-check'
import { getEnv } from '@/lib/env'

export const getResumeContent = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(resumeContent).orderBy(asc(resumeContent.sortOrder))
})

export const updateResumeSection = createServerFn({ method: 'POST' })
  .validator((d: { id?: string; sectionTitle: string; content: string; sortOrder?: number }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()

    if (data.id) {
      const [updated] = await db
        .update(resumeContent)
        .set({ sectionTitle: data.sectionTitle, content: data.content, sortOrder: data.sortOrder ?? 0, updatedAt: new Date() })
        .where(eq(resumeContent.id, data.id))
        .returning()
      return updated
    }

    const [inserted] = await db
      .insert(resumeContent)
      .values({
        sectionTitle: data.sectionTitle,
        content: data.content,
        sortOrder: data.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .returning()
    return inserted
  })

export const deleteResumeSection = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    await db.delete(resumeContent).where(eq(resumeContent.id, data.id))
    return { success: true }
  })

export const getResumeUrl = createServerFn({ method: 'GET' }).handler(async () => {
  const result = await db.select({ resumeUrl: profile.resumeUrl, resumePublicId: profile.resumePublicId }).from(profile).limit(1)
  return result[0] || null
})

export const getResumePdfData = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await db.select({
      resumeUrl: profile.resumeUrl,
      resumePublicId: profile.resumePublicId,
    }).from(profile).limit(1)

    const row = result[0]
    if (!row?.resumePublicId) return null

    const cloudName = getEnv('CLOUDINARY_CLOUD_NAME')
    const apiKey = getEnv('CLOUDINARY_API_KEY')
    const apiSecret = getEnv('CLOUDINARY_API_SECRET')
    const credentials = btoa(`${apiKey}:${apiSecret}`)
    const authHeader = `Basic ${credentials}`

    // First ensure access_mode is public (in case it wasn't set during upload)
    const resourceUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/upload/${encodeURIComponent(row.resumePublicId)}`
    await fetch(resourceUrl, {
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_mode: 'public' }),
    })

    // Get resource details to retrieve secure_url
    const getRes = await fetch(resourceUrl, {
      headers: { 'Authorization': authHeader },
    })
    if (!getRes.ok) {
      console.error('Cloudinary admin GET failed:', getRes.status, await getRes.text())
      return null
    }
    const data = await getRes.json() as { secure_url?: string }
    if (!data.secure_url) {
      console.error('No secure_url in Cloudinary response:', data)
      return null
    }

    // Fetch the actual PDF file
    const pdfRes = await fetch(data.secure_url)
    if (!pdfRes.ok) {
      console.error('Failed to fetch PDF from secure_url:', pdfRes.status)
      // Try with auth header as fallback
      const pdfRes2 = await fetch(data.secure_url, {
        headers: { 'Authorization': authHeader },
      })
      if (!pdfRes2.ok) {
        console.error('Also failed with auth:', pdfRes2.status)
        return null
      }
      const buffer = await pdfRes2.arrayBuffer()
      return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    }
    const buffer = await pdfRes.arrayBuffer()
    // Convert to base64 in chunks to avoid call stack overflow
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
    }
    return btoa(binary)
  } catch (error) {
    console.error('getResumePdfData error:', error)
    return null
  }
})

export const updateResumeUrl = createServerFn({ method: 'POST' })
  .validator((d: { resumeUrl: string; resumePublicId?: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const existing = await db.select().from(profile).limit(1)
    if (existing.length === 0) return null

    // Set resource access mode to public via Cloudinary Admin API
    if (data.resumePublicId) {
      const cloudName = getEnv('CLOUDINARY_CLOUD_NAME')
      const apiKey = getEnv('CLOUDINARY_API_KEY')
      const apiSecret = getEnv('CLOUDINARY_API_SECRET')
      const credentials = btoa(`${apiKey}:${apiSecret}`)
      const updateUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/upload/${encodeURIComponent(data.resumePublicId)}`
      try {
        await fetch(updateUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_mode: 'public' }),
        })
      } catch (e) {
        console.error('Failed to set Cloudinary access_mode:', e)
      }
    }

    const [updated] = await db
      .update(profile)
      .set({ resumeUrl: data.resumeUrl, resumePublicId: data.resumePublicId || null, updatedAt: new Date() })
      .where(eq(profile.id, existing[0].id))
      .returning()
    return updated
  })
