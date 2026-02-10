/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react'
import { MapPin, Users, Tag, Calendar, Clock, Camera, ArrowRight, X, ArrowLeft,  Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetTemplateByIdQuery } from '@/RTK/TemplatesQuery/templatesQuery'
import { getAllTemplatesInCategory, getCategories, getTemplateFile, getTemplatePrice, type TemplateSummary } from '@/service/templateLoader'
import TemplatePreview from '@/components/TemplatePreview'

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    category: undefined as string | undefined,
    startDate: '',
    startTime: '',
    endDate: '',
    isAllDay: false,
    hasEndDate: false,
    createForm: false,
    allowComments: false,
    multimediaSupport: false,
    hasTickets: false
  })

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [selectedLocalTemplate, setSelectedLocalTemplate] = useState<TemplateSummary | null>(null)
  const [LoadedTemplate, setLoadedTemplate] = useState<React.ComponentType<any> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({})
  const [templateDefaults, setTemplateDefaults] = useState<Record<string, string>>({})
  const appliedTemplateProps = useMemo(() => {
    const entries = Object.entries(templateFields).filter(([, v]) => typeof v === 'string' ? v.trim() !== '' : v != null)
    return Object.fromEntries(entries)
  }, [templateFields])
  
  // Fetch selected template details
  const { data: templateData, refetch: refetchTemplate } = useGetTemplateByIdQuery(selectedTemplateId!, {
    skip: !selectedTemplateId,
    refetchOnMountOrArgChange: true,
  })

  // Pre-populate form fields when template is selected
  useEffect(() => {
    if (templateData?.data) {
      const template = templateData.data
      setFormData(prev => ({
        ...prev,
        title: template.title || prev.title,
        description: template.description || prev.description,
        category: template.category?.toLowerCase() || prev.category,
      }))
      // Initialize dynamic template fields for props (merge with any existing defaults)
      if (Array.isArray(template.props)) {
        const init: Record<string, string> = {}
        template.props
          .filter(p => (p?.prop_name || '').toLowerCase() !== 'kidsbirthdaycard')
          .forEach(p => { init[p.prop_name] = init[p.prop_name] ?? '' })
        setTemplateFields(prev => {
          // Prefer non-empty existing values (e.g., from DEFAULT_PROPS) over empty init strings
          const merged: Record<string, string> = { ...init }
          for (const [k, v] of Object.entries(prev || {})) {
            const isEmpty = typeof v === 'string' ? v.trim() === '' : v == null
            if (!isEmpty) merged[k] = v as string
          }
          // Also prefer any defaults we have if current merged key is empty
          for (const [k, v] of Object.entries(templateDefaults)) {
            const curr = merged[k]
            const isEmpty = typeof curr === 'string' ? curr.trim() === '' : curr == null
            if (isEmpty && v?.trim()) merged[k] = v
          }
          return merged
        })
      } else {
        setTemplateFields(prev => prev)
      }
    }
  }, [templateData])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handleTemplateSelect = (template: TemplateSummary) => {
    const id = template.dbId
    console.log('Selected template dbId:', id)
    if (id) {
      if (id === selectedTemplateId) {
        // Force re-fetch when the same template is selected again
        refetchTemplate()
      } else {
        setSelectedTemplateId(id)
      }
    } else {
      setSelectedTemplateId(null)
    }
    // Reset dynamic fields so defaults from the new template can apply
    setTemplateFields({})
    setSelectedLocalTemplate(template)
    setIsTemplateModalOpen(false)
  }

  const handleClearTemplate = () => {
    setSelectedTemplateId(null)
    setSelectedLocalTemplate(null)
    setLoadedTemplate(null)
    setTemplateFields({})
    // Optionally clear pre-populated fields
    setFormData(prev => ({
      ...prev,
      title: '',
      description: '',
      category: undefined,
    }))
  }

  // Dynamically load local template component for preview when selected
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (selectedLocalTemplate) {
          setLoadError(null)
          const id = String(selectedLocalTemplate.localId)
          console.log('[TemplateLoader] Loading local template', selectedLocalTemplate.category, id)
          const mod = await getTemplateFile(selectedLocalTemplate.category as any, id)
          if (!cancelled && mod && (mod as any).default) {
            setLoadedTemplate(() => (mod as any).default as React.ComponentType<any>)
            console.log('[TemplateLoader] Loaded local template module')

            // Prefill template fields from template's DEFAULT_PROPS if available
            const defaults = (mod as any).DEFAULT_PROPS as Record<string, unknown> | undefined
            if (defaults && typeof defaults === 'object') {
              const normalize = (key: string, val: unknown): string => {
                const lname = (key || '').toLowerCase()
                const s = typeof val === 'string' ? val : val != null ? String(val) : ''
                if (!s) return ''
                if (lname.includes('date')) {
                  const d = new Date(s)
                  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
                }
                if (lname.includes('time')) {
                  const ampm = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i
                  const m = s.match(ampm)
                  if (m) {
                    let hh = parseInt(m[1], 10)
                    const mm = m[2] ? parseInt(m[2], 10) : 0
                    const ap = m[3].toUpperCase()
                    if (ap === 'PM' && hh < 12) hh += 12
                    if (ap === 'AM' && hh === 12) hh = 0
                    const hStr = String(hh).padStart(2, '0')
                    const mStr = String(mm).padStart(2, '0')
                    return `${hStr}:${mStr}`
                  }
                  const d = new Date(`1970-01-01T${s}`)
                  if (!isNaN(d.getTime())) {
                    const hStr = String(d.getHours()).padStart(2, '0')
                    const mStr = String(d.getMinutes()).padStart(2, '0')
                    return `${hStr}:${mStr}`
                  }
                }
                return s
              }
              const init: Record<string, string> = {}
              for (const [k, v] of Object.entries(defaults)) {
                if ((k || '').toLowerCase() === 'kidsbirthdaycard') continue
                if (v === null || v === undefined) continue
                init[k] = normalize(k, v)
              }
              if (Object.keys(init).length > 0) {
                setTemplateDefaults(init)
                // Fill only empty or missing keys with defaults; keep any user edits
                setTemplateFields(prev => {
                  const next: Record<string, string> = { ...(prev || {}) }
                  for (const [k, v] of Object.entries(init)) {
                    const curr = (prev || {})[k]
                    const isEmpty = typeof curr === 'string' ? curr.trim() === '' : curr == null
                    if (isEmpty) next[k] = v
                  }
                  return next
                })
              }
            }
          }
        } else {
          setLoadedTemplate(null)
        }
      } catch (e) {
        console.error('Failed to load local template module:', e)
        setLoadError('Failed to load template')
        if (!cancelled) setLoadedTemplate(null)
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedLocalTemplate])

  // Mobile Template Modal Component
  const TemplateModal = () => {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<string>('All')
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [templates, setTemplates] = useState<TemplateSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      const id = setTimeout(() => setDebouncedSearch(search), 300)
      return () => clearTimeout(id)
    }, [search])

    // Load templates from local registry
    useEffect(() => {
      setIsLoading(true)
      try {
        const allCategories = getCategories()
        let allTemplates: TemplateSummary[] = []

        if (category === 'All') {
          // Load templates from all categories
          allCategories.forEach(cat => {
            const categoryTemplates = getAllTemplatesInCategory(cat as any)
            allTemplates = [...allTemplates, ...categoryTemplates]
          })
        } else {
          // Load templates from selected category
          allTemplates = getAllTemplatesInCategory(category as any)
        }

        // Filter by search
        if (debouncedSearch) {
          allTemplates = allTemplates.filter(t => 
            t.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        }

        setTemplates(allTemplates)
      } catch (error) {
        console.error('Error loading templates:', error)
        setTemplates([])
      } finally {
        setIsLoading(false)
      }
    }, [category, debouncedSearch])

    const categories = useMemo(() => {
      return ['All', ...getCategories()]
    }, [])
    return (
    <div className="fixed inset-0 bg-white z-50 md:bg-black md:bg-opacity-50 md:flex md:items-center md:justify-center md:p-4">
      <div className="h-full w-full overflow-y-auto md:bg-white md:rounded-3xl md:p-4 md:max-w-6xl md:w-full md:max-h-[90vh] md:overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-none md:mb-6 sticky top-0 bg-white z-10 md:static">
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 text-center md:text-left md:flex-none">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl md:mb-1">Choose any template</h2>
            <p className="text-sm text-gray-600 md:text-base hidden md:block">Select any template and we would customize it to your needs</p>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-4 pb-8 md:p-0" style={{paddingBottom:'100px'}}>
          {/* Search */}
          <div className="mb-4 md:mb-6">
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="flex items-center px-3 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search templates"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                onKeyDown={(e) => { if (e.key === 'Escape') setSearch('') }}
              />
              <button
                className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800"
                onClick={() => {/* query auto-updates via state */}}
              >
                Search
              </button>
            </div>
          </div>
          {/* Category Tabs */}
          {/* <div className="flex gap-2 mb-4 md:gap-3 md:mb-6">
            <button
              onClick={() => { setSelectedTemplateCategory('Birthday'); setCategory('Birthday') }}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Birthday'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Birthday
            </button>
            <button
              onClick={() => { setSelectedTemplateCategory('Anniversary'); setCategory('Anniversary') }}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Anniversary'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Anniversary
            </button>
          </div> */}
          {/* Dynamic Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            {isLoading && (
              <>
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="relative aspect-[2/3] md:aspect-[3/4] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 bg-[length:200%_100%] animate-shimmer">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slide"></div>
                        {/* Price badge skeleton */}
                        <div className="absolute top-2 right-2 w-16 h-6 bg-gray-300 rounded"></div>
                        {/* Title overlay skeleton */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-300/70 to-transparent p-3">
                          <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && templates.length === 0 && (
              <div className="col-span-2 md:col-span-4 text-center text-gray-500 py-6">No templates found.</div>
            )}
            {!isLoading && templates.length > 0 && (
              <>
                {templates.map((t) => (
                    <div
                      key={t.id}
                      className="cursor-pointer group"
                      onClick={() => handleTemplateSelect(t)}
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[2/3] md:aspect-[3/4]">
                          <>
                          {t.media_url ? (
                            <img
                              src={t.media_url}
                              alt={t.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // if media fails, hide the broken image so the overlay still looks clean
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <TemplatePreview tpl={t} />
                          )}
                          </>
                          {/* Title overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <p className="text-white text-xs font-medium truncate">{t.title}</p>
                            {t.category && (
                              <p className="text-white/70 text-[10px] truncate">{t.category}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      {/* Mobile Header */}
      <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-[#eeeeee] px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-3 mb-2 md:gap-2">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          {/* <div className="flex items-center gap-2 text-sm text-gray-400 md:text-sm">
            <span className="hidden md:inline">Events</span>
            <span className="hidden md:inline">/</span>
            <span className="text-gray-600 md:text-gray-600">Create Events</span>
          </div> */}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 md:text-3xl md:mb-2">Create Event</h1>
        <p className="text-gray-500 text-sm md:text-base">Gathering people for your event is more stylish with festifa</p>
      </div>

      <div className="p-4 md:flex md:gap-8 md:p-4 md:max-w-[1400px] md:mx-auto">
        {/* Image Upload Section */}
        <div className="mb-6 md:w-[550px] md:flex-shrink-0 md:mb-0">
          {LoadedTemplate && selectedLocalTemplate ? (
            // Display locally-registered template preview (e.g., kidsbirthdaycard)
            <div className="bg-white rounded-[10px] overflow-hidden h-64 md:h-[550px] relative group">
              <div className="w-full h-full overflow-auto">
                <LoadedTemplate {...appliedTemplateProps} />
              </div>
              <button
                onClick={handleClearTemplate}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm mb-1">{selectedLocalTemplate.title}</p>
                <p className="text-white/70 text-xs">{selectedLocalTemplate.category}</p>
                {loadError && <p className="text-red-300 text-xs mt-1">{loadError}</p>}
                {templateData?.data?.prices && templateData.data.prices.length > 0 && (
                  <div className="mt-2 inline-block px-2 py-1 bg-orange-500 rounded text-white text-xs font-medium">
                    {getTemplatePrice(templateData.data).displayPrice}
                  </div>
                )}
              </div>
            </div>
          ) : selectedTemplateId && templateData?.data ? (
            // Display selected template
            <div className="bg-white rounded-[10px] overflow-hidden h-64 md:h-[550px] relative group">
              <img
                src={templateData.data.media_url}
                alt={templateData.data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/350x350/f3f4f6/9ca3af?text=Template'
                }}
              />
              {/* Cancel button */}
              <button
                onClick={handleClearTemplate}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {/* Template info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium text-sm mb-1">{templateData.data.title}</p>
                <p className="text-white/70 text-xs">{templateData.data.category}</p>
                {templateData.data.prices && templateData.data.prices.length > 0 && (
                  <div className="mt-2 inline-block px-2 py-1 bg-orange-500 rounded text-white text-xs font-medium">
                    {getTemplatePrice(templateData.data).displayPrice}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Default upload section
            <div className="bg-white rounded-[10px] p-6 h-64 flex flex-col items-center justify-center border-gray-300 md:h-[350px] md:p-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:w-16 md:h-16 md:mb-6">
                <Camera className="w-6 h-6 text-gray-400 md:w-8 md:h-8" />
              </div>
              <p className="text-gray-600 mb-6 text-center text-base md:text-lg md:mb-8">Add image or use template</p>
              
              <div className="space-y-3 w-full max-w-[240px] md:max-w-[280px] md:space-y-4">
                <button 
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors text-sm md:text-base md:px-6"
                >
                  Choose from Templates
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm md:text-base md:px-6">
                  Upload from device
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-1">
          <div className="rounded-2xl p-6 md:p-8" style={{paddingTop:'0px'}}>
            <div className="space-y-3 md:space-y-3 custom-box-main">
              {/* Event Title */}
              <div>
                <Input
                  type="text"
                  placeholder="Event title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Event Description */}
              <div>
                <textarea
                  placeholder="Event Description"
                  value={formData.description}
                  rows={3}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-base placeholder-gray-400 md:rows-4 md:py-4"
                ></textarea>
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Capacity */}
              <div className="relative">
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}

                >
                  <SelectTrigger className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base md:h-14 custom-button-dropdown">
                    <SelectValue placeholder="Category" className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="food">Food & Drinks</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time Section */}
              <div className="pt-2 md:pt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider md:mb-6">DATE AND TIME</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:mb-8">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      placeholder="Event starting date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="time"
                      placeholder="Event starting time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                    />
                  </div>
                </div>

                {/* Dynamic Template Fields */}
                {templateData?.data?.props && templateData.data.props.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Template Fields</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templateData.data.props
                        .filter((prop) => (prop?.prop_name || '').toLowerCase() !== 'kidsbirthdaycard')
                        .map((prop) => {
                          const key = prop.prop_name
                          const lname = (key || '').toLowerCase()
                          const isDate = lname.includes('date')
                          const isTime = lname.includes('time')
                          const isNumber = ['age','count','number','qty','quantity'].some(h => lname.includes(h))
                          const type = isDate ? 'date' : isTime ? 'time' : isNumber ? 'number' : 'text'
                          return (
                            <div key={prop.id} className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">
                                {prop.prop_name}{prop.is_required && <span className="text-red-500"> *</span>}
                              </label>
                              <Input
                                type={type as any}
                                placeholder={type === 'text' ? prop.prop_name : undefined}
                                value={templateFields[key] ?? templateDefaults[key] ?? ''}
                                onChange={(e) => setTemplateFields(prev => ({ ...prev, [key]: e.target.value }))}
                                className="h-10"
                              />
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* Toggle Options */}
                <div className="space-y-3 md:space-y-3">
                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">All the day event</span>
                    <button
                      onClick={() => handleToggle('isAllDay')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.isAllDay ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.isAllDay ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Add End Date</span>
                    <button
                      onClick={() => handleToggle('hasEndDate')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.hasEndDate ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.hasEndDate ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="pt-4 md:pt-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider md:mb-6">ADVANCED SETTINGS</h3>
                
                <div className="space-y-3 md:space-y-3">
                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Create form for event attendees</span>
                    <button
                      onClick={() => handleToggle('createForm')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.createForm ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.createForm ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Add likes and comments for this event</span>
                    <button
                      onClick={() => handleToggle('allowComments')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.allowComments ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.allowComments ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Multimedia support</span>
                    <button
                      onClick={() => handleToggle('multimediaSupport')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.multimediaSupport ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.multimediaSupport ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Tickets</span>
                    <button
                      onClick={() => handleToggle('hasTickets')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.hasTickets ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.hasTickets ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-6 md:pt-8">
                <button className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base">
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && <TemplateModal />}
    </div>
  )
}

export default CreateEvent
