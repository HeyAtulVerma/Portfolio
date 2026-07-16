import { createServerFn } from '@tanstack/react-start'
import { requireAdmin } from './auth-check'
import { getEnv } from '@/lib/env'

export const deleteCloudinaryAsset = createServerFn({ method: 'POST' })
  .validator((d: { publicId: string; resourceType?: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin()

    const cloudName = getEnv('CLOUDINARY_CLOUD_NAME')
    const apiKey = getEnv('CLOUDINARY_API_KEY')
    const apiSecret = getEnv('CLOUDINARY_API_SECRET')
    const resourceType = data.resourceType || 'image'
    const timestamp = Math.round(Date.now() / 1000)

    // Generate signature
    const signString = `public_id=${data.publicId}&timestamp=${timestamp}${apiSecret}`
    const encoder = new TextEncoder()
    const data8 = encoder.encode(signString)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const formData = new FormData()
    formData.append('public_id', data.publicId)
    formData.append('signature', signature)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
      { method: 'POST', body: formData }
    )

    const result = await response.json()
    return result
  })
