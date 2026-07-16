import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info?: CloudinaryUploadResult }) => void
      ) => { open: () => void; close: () => void }
    }
  }
}

export function useCloudinaryUpload(
  folder: string = 'portfolio',
  options?: {
    allowedFormats?: string[]
    maxFiles?: number
    resourceType?: 'image' | 'raw' | 'auto'
  }
) {
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<CloudinaryUploadResult[]>([])
  const [widget, setWidget] = useState<ReturnType<typeof window.cloudinary.createUploadWidget> | null>(null)
  const widgetRef = useRef(widget)
  widgetRef.current = widget

  // Stabilize options with useMemo to prevent infinite re-renders
  const allowedFormats = useMemo(
    () => options?.allowedFormats ?? ['png', 'jpg', 'jpeg', 'webp', 'gif'],
    [options?.allowedFormats?.join(',')]
  )
  const maxFiles = options?.maxFiles ?? 10
  const resourceType = options?.resourceType ?? 'image'

  useEffect(() => {
    if (typeof window === 'undefined') return

    let cancelled = false

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if (window.cloudinary) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = 'https://upload-widget.cloudinary.com/global/all.js'
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    loadScript().then(() => {
      if (cancelled) return
      // Destroy previous widget if exists
      widgetRef.current?.close()
      const w = window.cloudinary.createUploadWidget(
        {
          cloudName: 'djykrcyih',
          uploadPreset: 'portfolio',
          folder,
          sources: ['local', 'url'],
          multiple: maxFiles > 1,
          maxFiles,
          cropping: false,
          resourceType,
          clientAllowedFormats: allowedFormats,
          maxFileSize: 10000000, // 10MB
        },
        (error, result) => {
          if (result.event === 'upload-added') {
            setUploading(true)
          }
          if (result.event === 'success' && result.info) {
            setResults((prev) => [...prev, result.info!])
          }
          if (result.event === 'queues-end') {
            setUploading(false)
          }
        }
      )
      if (!cancelled) {
        setWidget(w)
        widgetRef.current = w
      }
    })

    return () => {
      cancelled = true
    }
  }, [folder, allowedFormats, maxFiles, resourceType])

  const openWidget = useCallback(() => {
    widget?.open()
  }, [widget])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return { openWidget, uploading, results, clearResults }
}
