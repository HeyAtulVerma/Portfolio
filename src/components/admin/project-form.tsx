import { useState, useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createProject, updateProject } from '@/server/functions/projects'
import { slugify } from '@/lib/utils'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'
import { Plus, X, Upload, Save } from 'lucide-react'

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    slug: string
    shortDescription: string
    longDescription: string
    howItWasBuilt: string
    techStack: string[]
    tags: string[]
    thumbnailUrl: string | null
    thumbnailPublicId: string | null
    liveUrl: string
    demoUrl: string
    githubUrl: string
    isPublished: boolean
    sortOrder: number
  }
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    shortDescription: project?.shortDescription || '',
    longDescription: project?.longDescription || '',
    howItWasBuilt: project?.howItWasBuilt || '',
    techStack: project?.techStack || [] as string[],
    tags: project?.tags || [] as string[],
    thumbnailUrl: project?.thumbnailUrl || '',
    thumbnailPublicId: project?.thumbnailPublicId || '',
    liveUrl: project?.liveUrl || '',
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    isPublished: project?.isPublished ?? true,
    sortOrder: project?.sortOrder ?? 0,
  })
  const [techInput, setTechInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!project)

  const { openWidget, results, uploading } = useCloudinaryUpload('portfolio/projects')

  // Handle Cloudinary upload results via effect (not during render)
  const processedResults = useRef(new Set<string>())
  useEffect(() => {
    if (results.length > 0 && !form.thumbnailUrl) {
      const lastUpload = results[results.length - 1]
      if (!processedResults.current.has(lastUpload.public_id)) {
        processedResults.current.add(lastUpload.public_id)
        setForm(prev => ({ ...prev, thumbnailUrl: lastUpload.secure_url, thumbnailPublicId: lastUpload.public_id }))
      }
    }
  }, [results, form.thumbnailUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (project) {
        await updateProject({ data: { id: project.id, ...form } })
      } else {
        await createProject({ data: form as any })
      }
      router.navigate({ to: '/admin/projects' })
    } catch (err) {
      console.error(err)
      alert('Failed to save project')
    }
    setSaving(false)
  }

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      setForm({ ...form, techStack: [...form.techStack, techInput.trim()] })
      setTechInput('')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => {
              const newForm = { ...form, title: e.target.value }
              if (autoSlug) newForm.slug = slugify(e.target.value)
              setForm(newForm)
            }}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => { setForm({ ...form, slug: e.target.value }); setAutoSlug(false) }}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Short Description</label>
        <textarea
          rows={2}
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Long Description</label>
        <textarea
          rows={6}
          value={form.longDescription}
          onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">How It Was Built</label>
        <textarea
          rows={6}
          value={form.howItWasBuilt}
          onChange={(e) => setForm({ ...form, howItWasBuilt: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          placeholder="Describe the architecture, tech decisions, and process..."
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tech Stack</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {form.techStack.map((tech) => (
            <span key={tech} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
              {tech}
              <button type="button" onClick={() => setForm({ ...form, techStack: form.techStack.filter(t => t !== tech) })}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
            placeholder="Add technology..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button type="button" onClick={addTech} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {tag}
              <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add tag..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button type="button" onClick={addTag} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Thumbnail</label>
        <div className="mt-2">
          {form.thumbnailUrl && (
            <div className="relative mb-3 inline-block">
              <img src={form.thumbnailUrl} alt="Thumbnail" className="h-40 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, thumbnailUrl: '', thumbnailPublicId: '' })}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={openWidget}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-3 text-sm text-slate-500 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-slate-700"
          >
            <Upload size={16} /> {uploading ? 'Uploading...' : form.thumbnailUrl ? 'Change Image' : 'Upload Image'}
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Live URL</label>
          <input
            type="url"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="https://"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Demo URL</label>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="https://"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sort Order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 dark:text-slate-300">Published</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-50"
      >
        <Save size={16} /> {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  )
}
