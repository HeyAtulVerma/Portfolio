import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { profile } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from './auth-check'

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await db.select().from(profile).limit(1)
    return result[0] || null
  } catch (err) {
    console.error('getProfile error:', err)
    return null
  }
})

export const updateProfile = createServerFn({ method: 'POST' })
  .validator((d: Partial<typeof profile.$inferInsert>) => d)
  .handler(async ({ data }) => {
    const user = await requireAdmin()
    const existing = await db.select().from(profile).limit(1)

    if (existing.length === 0) {
      const [inserted] = await db.insert(profile).values({
        userId: user.id,
        ...data,
        updatedAt: new Date(),
      }).returning()
      return inserted
    }

    const [updated] = await db
      .update(profile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profile.userId, user.id))
      .returning()

    return updated
  })
