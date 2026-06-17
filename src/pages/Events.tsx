/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {SettingsIcon, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import SearchFilter from '@/components/SearchFilter'
import EventCard from '@/components/EventCard'
import FilterModal from '@/components/FilterModal'
import eventPageBg from '@/assets/images/event-page-bg.png'
import { useGetEventsListQuery } from '@/RTK/EventsQuery/eventsQuery'
import { useGetCategoriesQuery } from '@/RTK/CategoriesQuery/categoriesQuery'

const Events = () => {
  // Top-row category chips driven by API
  const { data: categoriesData } = useGetCategoriesQuery()
  const categoryChips = useMemo(() => {
    const api = categoriesData?.data || []
    return [{ id: 'all', label: 'All' }, ...api.map((c) => ({ id: c.id, label: c.category }))]
  }, [categoriesData])

  // Horizontal scroll ref for category chips
  const chipsScrollRef = useRef<HTMLDivElement | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketType, setTicketType] = useState<'Tickets' | 'Free' | 'Paid'>('Tickets')
  const [filters, setFilters] = useState<{
    category_id?: string
    q?: string
    date_range?: string
    distance?: number
    latitude?: number
    longitude?: number
    event_type?: string
  }>({})

  const params = useMemo(() => ({
    page: 1,
    limit: 10,
    ...filters,
  }), [filters])

  const { data, isFetching, isError, refetch } = useGetEventsListQuery(params)

  const apiEvents = useMemo(() => {
    const items = data?.data || []
    return items.map((e) => {
      const start = e.start_date ? new Date(e.start_date) : null
      return {
        id: e.id,
        title: e.title,
        organizer: e.user?.name || e.host || 'Unknown',
        date: start ? start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        time: start ? start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '',
        location: e.location || '',
        image: e.media_url || 'https://via.placeholder.com/600x400?text=Event',
        isFree: !!e.is_free_event,
      }
    })
  }, [data])

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
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
  )

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load events</h3>
      <p className="text-gray-600 text-sm mb-4">Please try again.</p>
      <Button onClick={() => refetch()} className="bg-black text-white hover:bg-gray-800 rounded-full">Try again</Button>
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
      <p className="text-gray-600 text-center mb-2 max-w-md">Try adjusting your search or check back later.</p>
    </div>
  )

  const applySearch = () => {
    setFilters((prev) => ({ ...prev, q: searchQuery || undefined, event_type: ticketType === 'Tickets' ? undefined : ticketType.toLowerCase() }))
  }

  const mapDateRange = (label: string): string | undefined => {
    switch (label) {
      case 'This Week':
        return 'week'
      case 'This Month':
        return 'month'
      case 'This Year':
        return 'year'
      default:
        return undefined
    }
  }

  const parseDistance = (label: string): number | undefined => {
    const n = parseInt(label)
    return Number.isFinite(n) ? n : undefined
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* Additional decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute top-20 right-20 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45" />
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-14 h-14 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Best search for all events
          </h1>
          <p className="text-black/80 text-lg mb-8">
            Discover over 100,000 events happening near you!
          </p>

          {/* Search Bar */}
          <SearchFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            ticketType={ticketType}
            onTicketTypeChange={(t) => setTicketType(t as any)}
            onSearch={applySearch}
          />
        </div>
      </div>

      {/* Search Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing search results
          </h2>
          <Button variant="outline" className="text-gray-600 border-gray-100 hover:bg-gray-50" onClick={() => setIsFilterModalOpen(true)}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            filter search
          </Button>
        </div>

        {/* Category Filters - single line, horizontally scrollable with controls */}
        <div className="mb-8 -mx-4 group relative">
          <div
            ref={chipsScrollRef}
            className="px-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-2 md:gap-3 whitespace-nowrap">
              {categoryChips.map((c) => (
                <Button
                  key={c.id}
                  variant={selectedCategory === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(c.id)
                    setFilters((prev) => ({
                      ...prev,
                      category_id: c.id === 'all' ? undefined : c.id,
                    }))
                  }}
                  className={`
                    shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-in-out
                    ${selectedCategory === c.id
                      ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                      : "text-gray-700 bg-gray-100 border-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Prev / Next controls (show on hover) */}
          <button
            type="button"
            aria-label="Scroll left"
            className="hidden md:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-gray-700 shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              const el = chipsScrollRef.current
              if (!el) return
              el.scrollBy({ left: -Math.max(200, el.clientWidth * 0.8), behavior: 'smooth' })
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="hidden md:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-gray-700 shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              const el = chipsScrollRef.current
              if (!el) return
              el.scrollBy({ left: Math.max(200, el.clientWidth * 0.8), behavior: 'smooth' })
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Events Grid */}
        {isFetching ? (
          <SkeletonGrid />
        ) : isError ? (
          <ErrorState />
        ) : (apiEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        onApplyFilter={(f) => {
          setFilters((prev) => ({
            ...prev,
            category_id: f.categoryId || undefined,
            date_range: mapDateRange(f.dateType),
            distance: parseDistance(f.distance),
            latitude: f.latitude ?? prev.latitude,
            longitude: f.longitude ?? prev.longitude,
            // keep existing q and event_type set via the top search bar
          }))
          setIsFilterModalOpen(false)
        }} 
      />
    </div>
  )
}

export default Events
