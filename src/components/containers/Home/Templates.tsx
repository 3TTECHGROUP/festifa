import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllTemplatesInCategory, getCategories } from '@/service/templateLoader'
import type { TemplateSummary } from '@/service/templateLoader'
import TemplatePreview from '@/components/TemplatePreview'

const isAuthed = () => {
  try {
    const raw = localStorage.getItem('isAuthenticated')
    if (raw === 'true') return true
    if (raw) {
      try { return JSON.parse(raw) === true } catch { return false }
    }
  } catch { return false }
  return false
}

export const Templates = () => {
  const navigate = useNavigate()
  const [allTemplates, setAllTemplates] = useState<TemplateSummary[]>([])

  useEffect(() => {
    const cats = getCategories()
    let list: TemplateSummary[] = []
    cats.forEach((cat) => { list = [...list, ...getAllTemplatesInCategory(cat)] })
    setAllTemplates(list)
  }, [])

  const topTemplates = useMemo(() => allTemplates.slice(0, 4), [allTemplates])

  const handleTemplateClick = (id?: string) => {
    if (!id) return
    const target = `/templates/${id}`
    if (isAuthed()) navigate(target)
    else navigate('/login', { state: { from: target } })
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Templates</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Do you want to Host an event or attend an event around you? Festifa makes that really easy. Don't just take our word for it, Try it out yourself
          </p>
        </div>

        {/* Templates Grid - same card style as /templates */}
        {topTemplates.length === 0 ? (
          <div className="text-center text-gray-500 mb-8">No templates found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {topTemplates.map((t) => (
              <div
                key={t.id}
                className={`group ${t.dbId ? 'cursor-pointer' : 'cursor-default opacity-90'}`}
                onClick={() => handleTemplateClick(t.dbId)}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[2/3] md:aspect-[3/4]">
                    {t.media_url ? (
                      <img
                        src={t.media_url}
                        alt={t.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <TemplatePreview tpl={t} />
                    )}
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

        <div className="text-center">
          <p className="text-gray-700 mb-6">There are templates that fit every type of occasion</p>
          <Link to="/templates" className="inline-flex items-center gap-2">
            <span className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black px-8 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center gap-2">
              See all templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
