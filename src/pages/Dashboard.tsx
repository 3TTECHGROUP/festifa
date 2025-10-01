import { useState } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import { mockEvents } from '../data/mockEvents'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my-events' | 'past'>('upcoming')

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

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Gathering people for your event is more stylish with festifa</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <span className="text-lg">+</span>
            Create Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'upcoming'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('my-events')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'my-events'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My events
          {activeTab === 'my-events' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'past'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {displayEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Event Image */}
              <div className="flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      event.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {event.isFree ? 'Free' : 'Paid'}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
