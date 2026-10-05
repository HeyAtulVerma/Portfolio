import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getResumeContent, updateResumeSection, deleteResumeSection, getResumeUrl, updateResumeUrl, deleteResumePdf } from '@/server/functions/resume'
import { useState, useEffect, useRef } from 'react'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'
import { Plus, Trash2, Upload, Save, FileText } from 'lucide-react'
import { clearPublicDataCache } from '@/lib/public-data-cache'

export const Route = createFileRoute('/admin/resume')({
  loader: async () => {
    const [content, resumeUrl] = await Promise.all([getResumeContent(), getResumeUrl()])
    return { content, resumeUrl }
  },
  component: AdminResume,
})

function AdminResume() {
  const { content, resumeUrl } = Route.useLoaderData()
  const router = useRouter()
  const [newSection, setNewSection] = useState({ title: '', content: '' })
  const [deletingPdf, setDeletingPdf] = useState(false)
  const { openWidget, results, uploading } = useCloudinaryUpload('portfolio/resume', {
    allowedFormats: ['pdf'],
    maxFiles: 1,
    resourceType: 'raw',
  })

  const handleDeletePdf = async () => {
    if (!confirm('Are you sure you want to remove the current resume PDF?')) return
    try {
      setDeletingPdf(true)
      await deleteResumePdf()
      clearPublicDataCache()
      router.invalidate()
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingPdf(false)
    }
  }

  // Handle resume PDF upload via effect (not during render)
  const processedResults = useRef(new Set<string>())
  useEffect(() => {
    if (results.length > 0) {
      const lastUpload = results[results.length - 1]
      if (!processedResults.current.has(lastUpload.public_id)) {
        processedResults.current.add(lastUpload.public_id)
        updateResumeUrl({ data: { resumeUrl: lastUpload.secure_url, resumePublicId: lastUpload.public_id } }).then(() => {
          clearPublicDataCache()
          router.invalidate()
        })
      }
    }
  }, [results, router])

  const handleAddSection = async () => {
    if (!newSection.title.trim()) return
    await updateResumeSection({
      data: { sectionTitle: newSection.title, content: newSection.content, sortOrder: content.length },
    })
    clearPublicDataCache()
    setNewSection({ title: '', content: '' })
    router.invalidate()
  }

  const handleUpdateSection = async (id: string, title: string, sectionContent: string) => {
    await updateResumeSection({ data: { id, sectionTitle: title, content: sectionContent } })
    clearPublicDataCache()
    router.invalidate()
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return
    await deleteResumeSection({ data: { id } })
    clearPublicDataCache()
    router.invalidate()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resume</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your resume PDF and content sections</p>

      {/* PDF Upload */}
      <div className="mt-8 glass-card rounded-2xl p-7 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resume PDF</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {resumeUrl?.resumeUrl && (
            <a href="/resume/pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              <FileText size={16} /> View current PDF
            </a>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={openWidget}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-50"
            >
              <Upload size={16} /> {uploading ? 'Uploading...' : resumeUrl?.resumeUrl ? 'Replace PDF' : 'Upload PDF'}
            </button>
            {resumeUrl?.resumeUrl && (
              <button
                onClick={handleDeletePdf}
                disabled={uploading || deletingPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 dark:border-red-950/40 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/20 disabled:opacity-50"
              >
                <Trash2 size={16} /> Remove PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resume Content Sections */}
      <div className="mt-8 glass-card rounded-2xl p-7 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resume Sections</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">These appear on the formatted resume page</p>

        <div className="mt-6 space-y-4">
          {content.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onSave={(title, content) => handleUpdateSection(section.id, title, content)}
              onDelete={() => handleDeleteSection(section.id)}
            />
          ))}
        </div>

        {/* Add New Section */}
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Add New Section</h3>
          <input
            value={newSection.title}
            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
            placeholder="Section title (e.g., Education, Certifications)"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            rows={4}
            value={newSection.content}
            onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
            placeholder="Section content..."
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            onClick={handleAddSection}
            disabled={!newSection.title.trim()}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 disabled:opacity-50"
          >
            <Plus size={16} /> Add Section
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionEditor({ section, onSave, onDelete }: {
  section: { id: string; sectionTitle: string; content: string }
  onSave: (title: string, content: string) => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(section.sectionTitle)
  const [content, setContent] = useState(section.content)
  const [editing, setEditing] = useState(false)

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      {editing ? (
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { onSave(title, content); setEditing(false) }}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
            >
              <Save size={14} /> Save
            </button>
            <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{section.sectionTitle}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{section.content}</p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditing(true)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Save size={16} />
            </button>
            <button onClick={onDelete} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
