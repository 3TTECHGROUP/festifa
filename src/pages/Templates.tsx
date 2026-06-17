import { useEffect, useMemo, useState } from 'react'
import { Search, FileText } from 'lucide-react'
import eventPageBg from '@/assets/images/event-page-bg.png'
import { getAllTemplatesInCategory, getCategories } from '@/service/templateLoader'
import type { TemplateSummary } from '@/service/templateLoader'
import TemplatePreview from '@/components/TemplatePreview'

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FileText className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
    <p className="text-gray-600 text-sm">Try a different search or category.</p>
  </div>
)

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [allTemplates, setAllTemplates] = useState<TemplateSummary[]>([])

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(id)
  }, [search])

  // Load from local registry — no API call
  useEffect(() => {
    const cats = getCategories()
    let list: TemplateSummary[] = []
    if (selectedCategory === 'All') {
      cats.forEach((cat) => {
        list = [...list, ...getAllTemplatesInCategory(cat)]
      })
    } else {
      const match = cats.find(
        (c) => c.toLowerCase() === selectedCategory.toLowerCase()
      )
      if (match) list = getAllTemplatesInCategory(match)
    }
    setAllTemplates(list)
  }, [selectedCategory])

  const categories = useMemo(() => ['All', ...getCategories()], [])

  const templates = useMemo(() => {
    if (!debouncedSearch) return allTemplates
    return allTemplates.filter((t) =>
      t.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [allTemplates, debouncedSearch])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ 
        backgroundColor: '#ffa503',
        backgroundImage: `url(${eventPageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Orange Color Overlay */}
        <div className="absolute inset-0 bg-[#FFA500]/30"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute top-20 right-20 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45" />
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-14 h-14 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
          
          {/* Additional decorative shapes */}
          <div className="absolute top-16 left-1/3 w-6 h-6 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-1/4 w-12 h-12 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-32 right-16 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-16 left-1/2 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Templates for all types of events
          </h1>
          <p className="text-black/80 text-lg mb-8">
            Discover over 1,000 customizable event template available to you!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center px-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search templates"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearch('')}
                className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <button
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing search results
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-in-out
                ${selectedCategory === category
                  ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                  : "text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="cursor-pointer group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[2/3] md:aspect-[3/4]">
                    {t.media_url ? (
                      <img
                        src={t.media_url}
                        alt={t.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <TemplatePreview tpl={t} />
                    )}
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white font-medium text-sm mb-1">{t.title}</p>
                      <p className="text-white/70 text-xs">{t.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Templates
