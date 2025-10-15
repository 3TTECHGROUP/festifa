const Tickets = () => {
  const tickets = [
    {
      id: 1,
      eventName: 'The Great Adventure Festival',
      organizer: 'John Smith',
      date: 'October 15, 2023',
      time: '3:00 PM',
      ticketId: '123456ghtr',
      ticketType: 'Regular ticket',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      eventName: 'The Great Adventure Festival',
      organizer: 'John Smith',
      date: 'October 15, 2023',
      time: '3:00 PM',
      ticketId: '123456ghtr',
      ticketType: '2x VIP ticket, 1 regular ticket',
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      eventName: 'The Great Adventure Festival',
      organizer: 'John Smith',
      date: 'October 15, 2023',
      time: '3:00 PM',
      ticketId: '123456ghtr',
      ticketType: '2x VIP ticket, 1 regular ticket',
      image: '/api/placeholder/80/80'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Events / Create event</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket</h1>
        <p className="text-gray-600">Manage your payments and wallets</p>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center p-4">
              {/* Event Image */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <div className="text-white text-xs text-center">
                    <div className="mb-1">🎵</div>
                    <div>Festival</div>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="flex-1 min-w-0">
                {/* Ticket Type Badge */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    🎫 {ticket.ticketType}
                  </span>
                </div>

                {/* Event Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {ticket.eventName}
                </h3>

                {/* Event Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{ticket.organizer}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{ticket.date} • {ticket.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>Ticket ID: {ticket.ticketId}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 ml-4">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no tickets) */}
      {tickets.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
          <p className="text-gray-500">Your purchased tickets will appear here.</p>
        </div>
      )}
    </div>
  )
}

export default Tickets
