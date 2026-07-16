import { getEnv } from '@/lib/env'

export const CLOUDINARY_CLOUD_NAME = getEnv('CLOUDINARY_CLOUD_NAME') || 'djykrcyih'
export const CLOUDINARY_UPLOAD_PRESET = getEnv('CLOUDINARY_UPLOAD_PRESET') || 'portfolio'
export const CLOUDINARY_API_KEY = getEnv('CLOUDINARY_API_KEY')
export const CLOUDINARY_API_SECRET = getEnv('CLOUDINARY_API_SECRET')

export function getCloudinaryUrl(publicId: string, transformations: string = ''): string {
  const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`
  if (transformations) {
    return `${base}/${transformations}/${publicId}`
  }
  return `${base}/${publicId}`
}

export function getOptimizedUrl(publicId: string, width: number, height?: number): string {
  const h = height ? `,h_${height}` : ''
  return getCloudinaryUrl(publicId, `w_${width}${h},q_auto,f_auto,c_fill`)
}

export function getThumbnailUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, 'w_400,h_300,q_auto,f_auto,c_fill')
}
