import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { skills } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from './auth-check'

export const getSkills = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(skills).orderBy(asc(skills.sortOrder))
})

export const createSkill = createServerFn({ method: 'POST' })
  .validator((d: Omit<typeof skills.$inferInsert, 'id'>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const [inserted] = await db.insert(skills).values(data).returning()
    return inserted
  })

export const updateSkill = createServerFn({ method: 'POST' })
  .validator((d: { id: string } & Partial<typeof skills.$inferInsert>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...rest } = data
    const [updated] = await db.update(skills).set(rest).where(eq(skills.id, id)).returning()
    return updated
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    await db.delete(skills).where(eq(skills.id, data.id))
    return { success: true }
  })
