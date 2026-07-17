import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { profile, skills, experiences, projects, projectImages, resumeContent } from '@/db/schema'
import { eq, asc, inArray } from 'drizzle-orm'
import { getEnv } from '@/lib/env'

async function getResumePdfDataHelper() {
  try {
    const result = await db.select({
      resumeUrl: profile.resumeUrl,
    }).from(profile).limit(1)

    const row = result[0]
    if (!row?.resumeUrl) return null

    const apiKey = getEnv('CLOUDINARY_API_KEY')
    const apiSecret = getEnv('CLOUDINARY_API_SECRET')
    const credentials = btoa(`${apiKey}:${apiSecret}`)

    // Fetch the actual PDF file directly using the public resumeUrl with credentials
    const pdfRes = await fetch(row.resumeUrl, {
      headers: { 'Authorization': `Basic ${credentials}` },
    })
    if (!pdfRes.ok) {
      console.error('Failed to fetch PDF directly from resumeUrl:', pdfRes.status)
      return null
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
}

export const getPublicSiteData = createServerFn({ method: 'GET' }).handler(async () => {
  const [
    profileData,
    skillsData,
    experiencesData,
    projectsData,
    resumeContentData,
    resumePdfData
  ] = await Promise.all([
    db.select().from(profile).limit(1).then(res => res[0] || null),
    db.select().from(skills).orderBy(asc(skills.sortOrder)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder)),
    db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(asc(projects.sortOrder)),
    db.select().from(resumeContent).orderBy(asc(resumeContent.sortOrder)),
    getResumePdfDataHelper()
  ])

  // Fetch related images for all published projects in parallel
  const images = projectsData.length > 0
    ? await db
        .select()
        .from(projectImages)
        .where(inArray(projectImages.projectId, projectsData.map(p => p.id)))
        .orderBy(asc(projectImages.sortOrder))
    : []

  const projectsWithImages = projectsData.map(p => ({
    ...p,
    images: images.filter(img => img.projectId === p.id)
  }))

  return {
    profile: profileData,
    skills: skillsData,
    experiences: experiencesData,
    projects: projectsWithImages,
    resumeContent: resumeContentData,
    resumePdf: resumePdfData
  }
})
