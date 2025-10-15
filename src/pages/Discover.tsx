import { useState } from "react"

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const events = [
    {
      id: 1,
      name: 'Name of event',
      organizer: 'YOU (Ikperi David)',
      date: 'November 20, 2023',
      time: '9:00 AM',
      location: 'Downtown Convention Center',
      image: '/api/placeholder/300/200',
      category: 'tech'
    },
    {
      id: 2,
      name: 'Name of event',
      organizer: 'YOU (Ikperi David)',
      date: 'November 20, 2023',
      time: '9:00 AM',
      location: 'Downtown Convention Center',
      image: '/api/placeholder/300/200',
      category: 'business'
    },
    {
      id: 3,
      name: 'Annual Tech Innovation Summit',
      organizer: 'Alex Morgan',
      date: 'December 15, 2023',
      time: '10:30 AM',
      location: 'City Hall Conference Room',
      image: '/api/placeholder/300/200',
      category: 'tech'
    },
    {
      id: 4,
      name: 'Name of event',
      organizer: 'YOU (Ikperi David)',
      date: 'November 20, 2023',
      time: '9:00 AM',
      location: 'Downtown Convention Center',
      image: '/api/placeholder/300/200',
      category: 'entertainment'
    },
    {
      id: 5,
      name: 'Name of event',
      organizer: 'YOU (Ikperi David)',
      date: 'November 20, 2023',
      time: '9:00 AM',
      location: 'Downtown Convention Center',
      image: '/api/placeholder/300/200',
      category: 'tech'
    },
    {
      id: 6,
      name: 'Name of event',
      organizer: 'YOU (Ikperi David)',
      date: 'November 20, 2023',
      time: '9:00 AM',
      location: 'Downtown Convention Center',
      image: '/api/placeholder/300/200',
      category: 'business'
    },
    {
      id: 7,
      name: 'Tech Innovations Summit 2023',
      organizer: 'Alex Johnson',
      date: 'December 15, 2023',
      time: '10:30 AM',
      location: 'City Hall Auditorium',
      image: '/api/placeholder/300/200',
      category: 'tech'
    },
    {
      id: 8,
      name: 'Tech Innovations Conference 2023',
      organizer: 'YOU (Alex Morgan)',
      date: 'December 15, 2023',
      time: '10:30 AM',
      location: 'City Center Exhibition Hall',
      image: '/api/placeholder/300/200',
      category: 'tech'
    }
  ]

  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Events / Create event</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p className="text-gray-600">Search for events around you</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 max-w-2xl">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            {/* Event Image */}
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-700 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs opacity-80">Event</div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">{event.organizer}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date} • {event.time}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no events found) */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Discover
