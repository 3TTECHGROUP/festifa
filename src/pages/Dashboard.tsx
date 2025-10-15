import { useState } from 'react'
import { Calendar, MapPin, User, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockEvents } from '../data/mockEvents'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my-events' | 'past'>('upcoming')
  const [clickedCard, setClickedCard] = useState<number | null>(null)

  // Filter events for "My events" tab (events organized by YOU)
  const myEvents = mockEvents.filter(event => event.organizer.startsWith('YOU'))

  const getDisplayEvents = () => {
    if (activeTab === 'my-events') {
      return myEvents
    }
    // For now, show all events for upcoming and past
    return mockEvents.slice(0, 3)
  }

  const displayEvents = getDisplayEvents()

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
      {displayEvents.length === 0 ? (
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
