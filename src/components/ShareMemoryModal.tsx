/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, type ChangeEvent } from 'react'
import { AlertCircle, ImagePlus, Loader2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateGalleryItemMutation } from '@/RTK/EventsQuery/eventsQuery'
import { uploadImageToS3, deleteS3Object } from '@/utils/s3Upload'

interface ShareMemoryModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  userId: string
}

type StagedFile = {
  id: string
  file: File
  previewUrl: string
  type: 'image' | 'video'
  status: 'uploading' | 'uploaded' | 'error'
  s3Url?: string
  s3Key?: string
}

const ShareMemoryModal = ({ isOpen, onClose, eventId, userId }: ShareMemoryModalProps) => {
  const [staged, setStaged] = useState<StagedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Ids removed from the list while their upload was still in flight — once
  // that upload resolves we delete the now-orphaned S3 object instead of
  // adding it back to the staged list.
  const removedIdsRef = useRef<Set<string>>(new Set())
  const [createGalleryItem] = useCreateGalleryItemMutation()

  // Clears local UI state only — used after a successful submit, where the
  // uploaded files are now attached to the gallery and must NOT be deleted.
  const clearLocalState = () => {
    staged.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    setStaged([])
    setSubmitError(null)
  }

  const handleClose = () => {
    if (isSubmitting) return
    // Anything already uploaded to S3 but never submitted is an orphan — clean it up.
    staged.forEach((item) => {
      if (item.status === 'uploaded' && item.s3Key) deleteS3Object(item.s3Key)
      if (item.status === 'uploading') removedIdsRef.current.add(item.id)
    })
    clearLocalState()
    onClose()
  }

  if (!isOpen) return null

  const handleFilesSelected = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(ev.target.files ?? [])
    ev.target.value = ''
    if (files.length === 0) return

    setSubmitError(null)
    const entries: StagedFile[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      status: 'uploading',
    }))
    setStaged((prev) => [...prev, ...entries])

    entries.forEach((entry) => {
      uploadImageToS3(entry.file)
        .then(({ url, key }) => {
          if (removedIdsRef.current.has(entry.id)) {
            removedIdsRef.current.delete(entry.id)
            deleteS3Object(key)
            return
          }
          setStaged((prev) => prev.map((it) => (it.id === entry.id ? { ...it, status: 'uploaded', s3Url: url, s3Key: key } : it)))
        })
        .catch(() => {
          removedIdsRef.current.delete(entry.id)
          setStaged((prev) => prev.map((it) => (it.id === entry.id ? { ...it, status: 'error' } : it)))
        })
    })
  }

  const removeStaged = (id: string) => {
    setStaged((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        if (target.status === 'uploaded' && target.s3Key) {
          deleteS3Object(target.s3Key)
        } else if (target.status === 'uploading') {
          removedIdsRef.current.add(id)
        }
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const hasPendingUploads = staged.some((item) => item.status === 'uploading')
  const readyFiles = staged.filter((item) => item.status === 'uploaded')

  const handleSubmit = async () => {
    if (readyFiles.length === 0 || hasPendingUploads) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const files = readyFiles.map((item) => ({
        label: item.file.name,
        media_type: item.type,
        media_url: item.s3Url as string,
      }))
      await createGalleryItem({ event_id: eventId, user_id: userId, files }).unwrap()
      toast.success(readyFiles.length > 1 ? 'Memories shared!' : 'Memory shared!')
      clearLocalState()
      onClose()
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || err?.message || 'Failed to share memory. Please try again.'
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-semibold text-gray-900">Share a memory</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-6">Add photos or videos from this event for everyone to see.</p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors disabled:opacity-60"
          >
            <ImagePlus className="w-7 h-7" />
            <span className="text-sm font-medium">Click to select photos or videos</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />

          {staged.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {staged.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  {item.type === 'video' ? (
                    <video src={item.previewUrl} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  ) : (
                    <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                  )}

                  {item.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="absolute inset-0 bg-red-900/50 flex flex-col items-center justify-center gap-1 text-center px-1">
                      <AlertCircle className="w-5 h-5 text-white" />
                      <span className="text-[10px] text-white leading-tight">Upload failed</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeStaged(item.id)}
                    disabled={isSubmitting}
                    aria-label={`Remove ${item.file.name}`}
                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {submitError && (
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || hasPendingUploads || readyFiles.length === 0}
              className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sharing...' : hasPendingUploads ? 'Uploading...' : `Share ${readyFiles.length || ''}`.trim()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareMemoryModal
