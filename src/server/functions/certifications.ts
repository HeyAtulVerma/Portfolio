import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { certifications } from '@/db/schema'
import { eq, asc, desc } from 'drizzle-orm'
import { requireAdmin } from './auth-check'
import { deleteCloudinaryAsset } from './cloudinary'

export const getCertifications = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await db
      .select()
      .from(certifications)
      .where(eq(certifications.isPublished, true))
      .orderBy(asc(certifications.sortOrder), desc(certifications.createdAt))
  } catch (err) {
    console.error('getCertifications error:', err)
    return []
  }
})

export const getAllCertifications = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  return await db
    .select()
    .from(certifications)
    .orderBy(asc(certifications.sortOrder), desc(certifications.createdAt))
})

export const getCertificationById = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const result = await db.select().from(certifications).where(eq(certifications.id, data.id)).limit(1)
    return result[0] || null
  })

export const createCertification = createServerFn({ method: 'POST' })
  .validator((d: Omit<typeof certifications.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const [inserted] = await db
      .insert(certifications)
      .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
      .returning()
    return inserted
  })

export const updateCertification = createServerFn({ method: 'POST' })
  .validator((d: { id: string } & Partial<typeof certifications.$inferInsert>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...updates } = data
    const [updated] = await db
      .update(certifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning()
    return updated
  })

export const deleteCertification = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const result = await db.select().from(certifications).where(eq(certifications.id, data.id)).limit(1)
    if (result.length > 0 && result[0].certificatePublicId) {
      try {
        await deleteCloudinaryAsset({ data: { publicId: result[0].certificatePublicId } })
      } catch (err) {
        console.error('Failed to delete Cloudinary asset for certification:', err)
      }
    }
    await db.delete(certifications).where(eq(certifications.id, data.id))
    return { success: true }
  })
