/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import { Calendar, MapPin, User, FileText, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockEvents } from '../data/mockEvents'
import { useGetRegisteredEventsQuery, useGetUserEventsQuery } from '@/RTK/EventsQuery/eventsQuery'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my-events' | 'past'>('upcoming')
  const [clickedCard, setClickedCard] = useState<string | number | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const filter = activeTab === 'past' ? 'past' : activeTab === 'upcoming' ? 'upcoming' : undefined
  const { data, isFetching, isError, refetch: refetchRegistered } = useGetRegisteredEventsQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter ? { page, limit, filter } : ({} as any),
    { skip: !filter }
  )

  const { data: userData, isFetching: isFetchingUser, isError: isErrorUser, refetch: refetchUser } = useGetUserEventsQuery(
    { page, limit },
    { skip: activeTab !== 'my-events' }
  )

  // Filter events for "My events" tab (events organized by YOU)
  const myEvents = mockEvents.filter(event => event.organizer.startsWith('YOU'))

  const apiMappedEvents = useMemo(() => {
    const items = data?.data || []
    return items.map((e) => {
      const start = e.start_date ? new Date(e.start_date) : null
      const dateStr = start ? start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      const timeStr = start ? start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
      return {
        id: e.id,
        image: e.media_url || 'https://via.placeholder.com/64x64?text=Event',
        title: e.title,
        organizer: e.user?.name || e.host || 'Unknown',
        date: dateStr,
        time: timeStr,
        location: e.location || '',
        isFree: !!e.is_free_event,
      }
    })
  }, [data])

  const myEventsApi = useMemo(() => {
    const items = userData?.data || []
    return items.map((e) => {
      const start = e.start_date ? new Date(e.start_date) : null
      const dateStr = start ? start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      const timeStr = start ? start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
      return {
        id: e.id,
        image: e.media_url || 'https://via.placeholder.com/64x64?text=Event',
        title: e.title,
        organizer: e.user?.name || e.host || 'Unknown',
        date: dateStr,
        time: timeStr,
        location: e.location || '',
        isFree: !!e.is_free_event,
      }
    })
  }, [userData])

  const displayEvents = activeTab === 'my-events' ? (myEventsApi.length ? myEventsApi : myEvents) : apiMappedEvents
  const loading = activeTab === 'my-events' ? isFetchingUser : isFetching
  const failed = activeTab === 'my-events' ? isErrorUser : isError
  const doRefetch = activeTab === 'my-events' ? refetchUser : refetchRegistered

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">You do not have any event yet</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Gathering people for your event is more stylish with festifa
      </p>
      <Link to="/dashboard/create-event">
        <button className="bg-[#FFA500] hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 text-base shadow-lg">
          <span className="text-xl">+</span>
          Create Event
        </button>
      </Link>
    </div>
  )

  const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load events</h3>
      <p className="text-gray-600 text-sm mb-4">Please try again.</p>
      <button
        onClick={() => onRetry?.()}
        className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  )

  const SkeletonList = () => (
    <div className="space-y-4" style={{ width: '100%', margin: 'auto' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`bg-white rounded-lg p-4`}>
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="h-5 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Events</h1>
            <p className="text-gray-600 text-sm">Gathering people for your event is more stylish with festifa</p>
          </div>
          <Link to="/dashboard/create-event">
            <button className="bg-[#FFA500] hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 text-base shadow-lg">
              <span className="text-xl">+</span>
              Create Event
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-full p-1 mb-6 inline-flex">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
            activeTab === 'upcoming'
              ? 'bg-[#F5F5F5] text-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('my-events')}
          className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
            activeTab === 'my-events'
              ? 'bg-[#F5F5F5] text-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My events
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
            activeTab === 'past'
              ? 'bg-[#F5F5F5] text-black'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Past
        </button>
      </div>

      {/* Events List or Empty State */}
      {loading ? (
        <SkeletonList />
      ) : failed ? (
        <ErrorState onRetry={doRefetch} />
      ) : displayEvents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4" style={{ width: '100%', margin: 'auto' }}>
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-lg p-4 transition-all duration-200 cursor-pointer `}
              onClick={() => setClickedCard(clickedCard === event.id ? null : event.id)}
            >
              <div className="bg-white rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            event.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {event.isFree ? 'Free' : 'Paid'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{event.title}</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{event.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{event.date} · {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
