import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { experiences } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from './auth-check'

export const getExperiences = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(experiences).orderBy(asc(experiences.sortOrder))
})

export const createExperience = createServerFn({ method: 'POST' })
  .validator((d: Omit<typeof experiences.$inferInsert, 'id'>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const [inserted] = await db.insert(experiences).values(data).returning()
    return inserted
  })

export const updateExperience = createServerFn({ method: 'POST' })
  .validator((d: { id: string } & Partial<typeof experiences.$inferInsert>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...rest } = data
    const [updated] = await db.update(experiences).set(rest).where(eq(experiences.id, id)).returning()
    return updated
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    await db.delete(experiences).where(eq(experiences.id, data.id))
    return { success: true }
  })
