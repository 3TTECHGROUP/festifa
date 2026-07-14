import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Tag, X } from 'lucide-react'
import { uploadImageToS3, deleteS3Object } from '@/utils/s3Upload'
import { useGetTemplateByIdQuery } from '@/RTK/TemplatesQuery/templatesQuery'
import {
  getTemplatePrice,
  getAllTemplatesInCategory,
  getCategories,
  getTemplateFile,
} from '@/service/templateLoader'
import type { TemplateSummary } from '@/service/templateLoader'
import { Button } from '@/components/ui/button'

const findLocalTemplate = (
  id: string,
  category?: string,
): TemplateSummary | undefined => {
  const cats = getCategories()
  const search = category
    ? cats.filter((c) => c.toLowerCase() === category.toLowerCase())
    : cats
  for (const cat of search) {
    const found = getAllTemplatesInCategory(cat).find((t) => t.dbId === id)
    if (found) return found
  }
  return undefined
}

const isAuthed = () => {
  try {
    const raw = localStorage.getItem('isAuthenticated')
    if (raw === 'true') return true
    if (raw) {
      try {
        return JSON.parse(raw) === true
      } catch {
        return false
      }
    }
  } catch {
    return false
  }
  return false
}

const DetailSkeleton = () => (
  <div className="container mx-auto px-4 py-10 animate-pulse">
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-24 w-full bg-gray-200 rounded" />
        <div className="h-10 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
)

const TemplateDetail = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [imageS3Keys, setImageS3Keys] = useState<Record<string, string>>({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [LoadedComp, setLoadedComp] = useState<any>(null)
  const [previewKey, setPreviewKey] = useState(0)

  const authed = isAuthed()

  const { data, isFetching, isError, refetch } = useGetTemplateByIdQuery(id, {
    skip: !id,
  })

  // Load the local template component and prefill fields from its DEFAULT_PROPS
  useEffect(() => {
    const tpl = data?.data
    if (!tpl) return
    const local = findLocalTemplate(tpl.id, tpl.category)
    if (!local) {
      setLoadedComp(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod: any = await getTemplateFile(
          local.category as never,
          String(local.localId),
        )
        if (cancelled) return
        if (mod?.default) setLoadedComp(() => mod.default)
        const defaults = mod?.DEFAULT_PROPS
        if (defaults && typeof defaults === 'object') {
          setFieldValues((prev) => {
            const next = { ...prev }
            for (const [k, v] of Object.entries(defaults)) {
              if (v == null) continue
              // DEFAULT_PROPS uses image_url; inputs are keyed by prop_name (image)
              const key = k === 'image_url' ? 'image' : k
              if (!next[key] || next[key].trim() === '') next[key] = String(v)
            }
            return next
          })
        }
      } catch {
        if (!cancelled) setLoadedComp(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [data])

  if (isFetching) return <DetailSkeleton />

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Template not found</h3>
        <p className="text-gray-600 text-sm mb-4">We couldn't load this template.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/templates')}>Back to templates</Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    )
  }

  const template = data.data
  const priceInfo = template.prices && template.prices.length > 0 ? getTemplatePrice(template) : null
  const hasValidMedia =
    !!template.media_url && !template.media_url.includes('example.com')

  // Build props for the live preview (map image -> image_url, drop empties)
  const entries = Object.entries(fieldValues).filter(([, v]) => typeof v === 'string' && v.trim() !== '')

  // Remove original image_url if image exists (to avoid conflicts)
  const hasImage = entries.some(([k]) => k === 'image' || k === '')
  const filteredEntries = hasImage
    ? entries.filter(([k]) => k !== 'image_url')
    : entries

  // Map image key to image_url for template compatibility
  const appliedProps = Object.fromEntries(
    filteredEntries.map(([k, v]) => (k === 'image' || k === '' ? ['image_url', v] : [k, v])),
  )

  const handleUseTemplate = () => {
    // Check if user is authenticated
    if (!authed) {
      navigate('/login', { replace: true, state: { from: `/templates/${id}` } })
      return
    }

    // Merge S3 keys into field values for CreateEvent (it expects { key_s3_key })
    const merged = { ...fieldValues }
    for (const [k, s3Key] of Object.entries(imageS3Keys)) {
      merged[`${k}_s3_key`] = s3Key
    }
    navigate('/dashboard/create-event', {
      state: {
        templateId: template.id,
        templateCategory: template.category,
        templateFieldValues: merged,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/templates')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to templates
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-[3/4] bg-gray-100 overflow-auto">
              {LoadedComp ? (
                <LoadedComp key={`${previewKey}-${JSON.stringify(appliedProps)}`} {...appliedProps} />
              ) : hasValidMedia ? (
                <img
                  src={template.media_url}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No preview available
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {template.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {template.category}
                </span>
              )}
              {template.type && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                  {template.type}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>

            {template.description && (
              <p className="text-gray-600 mb-4">{template.description}</p>
            )}

            {priceInfo && (
              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-900">{priceInfo.displayPrice}</span>
              </div>
            )}


            {/* Template Fields */}
            {template.props && template.props.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Fields</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {template.props.map((prop) => {
                    const key = prop.prop_name || ''
                    const lname = key.toLowerCase()
                    const isMessage = lname.includes('message')
                    const isImage = lname.includes('image') || lname.includes('photo') || lname.includes('picture') || key === ''
                    return (
                      <div key={prop.id} className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">
                          {prop.prop_name || 'Image'}
                          {prop.is_required && <span className="text-red-500"> *</span>}
                        </label>
                        {isImage ? (
                          <div className="space-y-2">
                            {fieldValues[key] ? (
                              <div className="relative">
                                <img
                                  src={fieldValues[key]}
                                  alt="Uploaded"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const s3Key = imageS3Keys[key]
                                    if (s3Key) {
                                      try {
                                        await deleteS3Object(s3Key)
                                      } catch {
                                        // ignore delete errors
                                      }
                                    }
                                    setFieldValues((prev) => {
                                      const next = { ...prev }
                                      delete next[key]
                                      return next
                                    })
                                    setImageS3Keys((prev) => {
                                      const next = { ...prev }
                                      delete next[key]
                                      return next
                                    })
                                  }}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    try {
                                      const { url, key: s3Key } = await uploadImageToS3(file)
                                      setFieldValues((prev) => ({ ...prev, [key]: url }))
                                      setImageS3Keys((prev) => ({ ...prev, [key]: s3Key }))
                                      // Force re-render of preview
                                      setPreviewKey((prev) => prev + 1)
                                    } catch {
                                      // ignore upload errors
                                    }
                                  }
                                }}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                              />
                            )}
                          </div>
                        ) : isMessage ? (
                          <textarea
                            rows={3}
                            placeholder={prop.prop_name}
                            value={fieldValues[key] ?? ''}
                            onChange={(e) =>
                              setFieldValues((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm bg-white"
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={prop.prop_name}
                            value={fieldValues[key] ?? ''}
                            onChange={(e) =>
                              setFieldValues((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm bg-white"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

             <Button
              onClick={handleUseTemplate}
              className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base font-semibold mt-6"
            >
              Use this event
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateDetail
