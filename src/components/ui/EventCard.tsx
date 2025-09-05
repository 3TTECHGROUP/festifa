import React from 'react'

interface EventCardProps {
  id: number
  name: string
  organizer: string
  date: string
  time: string
  location: string
  status: 'Free' | 'Paid'
  image?: string
}

export const EventCard: React.FC<EventCardProps> = ({
  name,
  organizer,
  date,
  time,
  location,
  status
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Event Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">{name}</h3>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {organizer}
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {date} • {time}
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {location}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status === 'Free' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}
