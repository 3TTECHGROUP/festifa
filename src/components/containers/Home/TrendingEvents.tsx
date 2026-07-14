/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGetTrendingEventsQuery } from '@/RTK/EventsQuery/eventsQuery'
import { useGetTemplateByIdQuery } from '@/RTK/TemplatesQuery/templatesQuery'
import EventCard from '@/components/EventCard'
import { getCategories, getAllTemplatesInCategory } from '@/service/templateLoader'
import type { TemplateSummary } from '@/service/templateLoader'

export const TrendingEvents = () => {
  // Default coordinates (Lagos, Nigeria) - can be replaced with user's actual location
  const { data, isFetching, isError } = useGetTrendingEventsQuery({
    latitude: 6.5244,
    longitude: 3.3792,
  })

  // Map API events to EventCard format
  const apiEvents = useMemo(() => {
    const items = data?.data || []
    return items.slice(0, 4).map((e) => {
      const start = e.start_date ? new Date(e.start_date) : null
      const dateStr = start ? start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      const timeStr = start ? start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
      return {
        id: e.id,
        title: e.title,
        organizer: e.user?.name || e.host || 'Unknown',
        date: dateStr,
        time: timeStr,
        location: e.location || '',
        image: e.media_url || 'https://via.placeholder.com/600x400?text=Event',
        isFree: !!e.is_free_event,
        template_id: (e as any)?.template_id,
        template_prop_responses: (e as any)?.template_prop_responses || [],
      }
    })
  }, [data])

  // Build template lookup for preview rendering
  const templateByEventId = useMemo(() => {
    const map = new Map<string, TemplateSummary>()
    const items = data?.data || []
    if (!items.length) return map
    const cats = getCategories()
    for (const ev of items.slice(0, 4)) {
      const dbId = (ev as any)?.template_id as string | undefined
      if (!dbId) continue
      for (const cat of cats) {
        const found = getAllTemplatesInCategory(cat).find((t) => t.dbId === dbId)
        if (found) {
          map.set(ev.id, found)
          break
        }
      }
    }
    return map
  }, [data])

  // Get unique template_ids from events
  const uniqueTemplateIds = useMemo(() => {
    const ids = new Set<string>()
    data?.data?.slice(0, 4).forEach((ev) => {
      const dbId = (ev as any)?.template_id
      if (dbId) ids.add(dbId)
    })
    return Array.from(ids)
  }, [data])

  // Fetch template details for up to 3 unique template_ids (includes props)
  // Using fixed number of hooks to avoid React hooks rule violation
  const templateQuery1 = useGetTemplateByIdQuery(uniqueTemplateIds[0] || '', { skip: !uniqueTemplateIds[0] })
  const templateQuery2 = useGetTemplateByIdQuery(uniqueTemplateIds[1] || '', { skip: !uniqueTemplateIds[1] })
  const templateQuery3 = useGetTemplateByIdQuery(uniqueTemplateIds[2] || '', { skip: !uniqueTemplateIds[2] })

  // Build combined prop_id -> prop_name mapping from API
  const propIdToName = useMemo(() => {
    const map = new Map<string, string>()
    const queries = [templateQuery1, templateQuery2, templateQuery3]
    queries.forEach((query) => {
      const props = query.data?.data?.props || []
      props.forEach((prop) => {
        // Map 'image' to 'image_url' for template compatibility
        const propName = prop.prop_name === 'image' ? 'image_url' : prop.prop_name
        map.set(prop.id, propName)
      })
    })
    return map
  }, [templateQuery1, templateQuery2, templateQuery3])

  // Map template_prop_responses to prop names using API data
  const propOverridesByEventId = useMemo(() => {
    const map = new Map<string, Record<string, string>>()
    const items = data?.data || []

    for (const ev of items.slice(0, 4)) {
      const responses = (ev as any)?.template_prop_responses || []
      const overrides: Record<string, string> = {}
      responses.forEach((r: any) => {
        const propName = propIdToName.get(r.template_prop_id)
        if (propName) {
          overrides[propName] = r.prop_response
        }
      })
      map.set(ev.id, overrides)
    }
    return map
  }, [data, propIdToName])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">Trending events</h2>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <Link to="/events">
            <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
              See all events
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>

        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-gray-500">Failed to load trending events</div>
        ) : apiEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No trending events available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                templateTpl={templateByEventId.get(String(event.id))}
                propOverrides={propOverridesByEventId.get(String(event.id))}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
