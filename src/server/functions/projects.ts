import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { projects, projectImages } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from './auth-check'

export const getProjects = createServerFn({ method: 'GET' }).handler(async () => {
  return await db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(asc(projects.sortOrder))
})

export const getAllProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  return await db.select().from(projects).orderBy(asc(projects.sortOrder))
})

export const getProjectBySlug = createServerFn({ method: 'GET' })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const result = await db.select().from(projects).where(eq(projects.slug, data.slug)).limit(1)
    if (result.length === 0) return null

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, result[0].id))
      .orderBy(asc(projectImages.sortOrder))

    return { ...result[0], images }
  })

export const getProjectById = createServerFn({ method: 'GET' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const result = await db.select().from(projects).where(eq(projects.id, data.id)).limit(1)
    if (result.length === 0) return null

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, result[0].id))
      .orderBy(asc(projectImages.sortOrder))

    return { ...result[0], images }
  })

export const createProject = createServerFn({ method: 'POST' })
  .validator((d: Omit<typeof projects.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const [inserted] = await db
      .insert(projects)
      .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
      .returning()
    return inserted
  })

export const updateProject = createServerFn({ method: 'POST' })
  .validator((d: { id: string } & Partial<typeof projects.$inferInsert>) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...rest } = data
    const [updated] = await db
      .update(projects)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()
    return updated
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    // Cascading delete handled by DB foreign key
    await db.delete(projects).where(eq(projects.id, data.id))
    return { success: true }
  })

export const addProjectImage = createServerFn({ method: 'POST' })
  .validator((d: { projectId: string; url: string; publicId: string; altText?: string; caption?: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    const [inserted] = await db
      .insert(projectImages)
      .values({
        projectId: data.projectId,
        url: data.url,
        publicId: data.publicId,
        altText: data.altText || '',
        caption: data.caption || '',
        createdAt: new Date(),
      })
      .returning()
    return inserted
  })

export const deleteProjectImage = createServerFn({ method: 'POST' })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()
    await db.delete(projectImages).where(eq(projectImages.id, data.id))
    return { success: true }
  })
