import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, MessageCircle, Eye, Share2, Calendar, Clock, MapPin, Ticket, User, ArrowRight, MoreHorizontal } from 'lucide-react'
import { findEventById, mockEvents } from '@/data/mockEvents'
import RegistrationModal from '@/components/RegistrationModal'
import PaymentModal from '@/components/PaymentModal'

const EventDetail = () => {
  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [newComment, setNewComment] = useState('')

  // Find the event by ID from URL params
  const eventId = id ? parseInt(id, 10) : 1
  const event = findEventById(eventId)

  // If event not found, show error or redirect
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link 
            to="/events" 
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  // Get similar events (exclude current event)
  const similarEvents = mockEvents.filter(e => e.id !== event.id).slice(0, 4)

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
    }
  }

  const handleAddComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newComment.trim()) {
      // TODO: Replace with API call to add comment
      console.log('Adding comment:', newComment)
      setNewComment('')
    }
  }

  return (
    <div className="min-h-screen">
        <div className='container custom-hero-section-main'>
          <div className='mt-6'>
              <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover rounded-lg banner-img-main" 
            />
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              {/* Likes */}
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 transition-all ${
                    isLiked 
                      ? 'fill-red-500 text-red-500' 
                      : 'fill-none text-gray-700'
                  }`} 
                />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              
              {/* Comments */}
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">10</span>
              </button>
              
              {/* Views */}
              <div className="flex items-center gap-2 text-gray-700">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">240</span>
              </div>
              
              {/* User Icon */}
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </button>
            </div>
            
            {/* Share Button */}
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share event</span>
            </button>
          </div>

          {/* Event Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
            {/* Left Column - Event Information */}
            <div>
              {/* Event Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-gray-700 text-sm">{event.organizer}</span>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Date */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">Date</span>
                </div>

                {/* Time */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{event.time}</span>
                </div>

                {/* Location */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{event.location}</span>
                </div>

                {/* Event Type */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">
                    {event.isFree ? 'Free event' : 'Paid event'}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Details</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.description || 'This is going to be the description of the event given by the host'}
                </p>
              </div>
            </div>

            {/* Right Column - Tickets & Tags */}
            <div>
              {/* Tickets Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tickets</h2>
                
                {/* Ticket Card 1 - Available */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🎫</span>
                        <span className="font-semibold text-gray-900 text-sm">Regular ticket</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span>Price: ${event.ticketPrice || 50}</span>
                        <span>Quantity available: 50</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium text-sm whitespace-nowrap ml-4"
                  >
                    Get Ticket
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Ticket Card 2 - Sold Out */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">🎫</span>
                        <span className="font-semibold text-gray-900 text-sm">Regular ticket</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span>Price: ${event.ticketPrice || 50}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-500 font-medium flex items-center gap-2 text-sm whitespace-nowrap ml-4">
                    Sold out
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags && event.tags.length > 0 ? (
                    event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    // Default tags if none exist
                    ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'].map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="py-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
            >
              Register
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            
            {/* Add Comment - One-liner input with submit */}
            <form onSubmit={handleAddComment} className="flex items-center gap-3 mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 h-11 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Submit
              </button>
            </form>

            <div className="space-y-6">
              {/* Comment 1 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Ikperi David</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur. Turpis nec malesuada facilisi sed arcu at lacinia. Nisl bibendum nulla eu egestas. Id in enim sit tellus egestas tempus. Nisl interdum eget nunc pellentesque ornare ultrices.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        <span>10</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Ikperi David</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur. Turpis nec malesuada facilisi sed arcu at lacinia. Nisl bibendum nulla eu egestas. Id in enim sit tellus egestas tempus. Nisl interdum eget nunc pellentesque ornare ultrices.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        <span>10</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment 3 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Ikperi David</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur. Turpis nec malesuada facilisi sed arcu at lacinia. Nisl bibendum nulla eu egestas. Id in enim sit tellus egestas tempus. Nisl interdum eget nunc pellentesque ornare ultrices.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        <span>10</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment 4 */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Ikperi David</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      Lorem ipsum dolor sit amet consectetur. Turpis nec malesuada facilisi sed arcu at lacinia. Nisl bibendum nulla eu egestas. Id in enim sit tellus egestas tempus. Nisl interdum eget nunc pellentesque ornare ultrices.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        <span>10</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Similar Events Section */}
      <div className="px-8 py-8 container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Similar events</h3>
          <Link to="/events" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
            See all events →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarEvents.map((similarEvent) => (
            <Link 
              key={similarEvent.id}
              to={`/events/${similarEvent.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video">
                  <img 
                    src={similarEvent.image} 
                    alt={similarEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                    Name of event
                  </h4>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">YOU (Rupert David)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">November 20, 2023 • 9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Downtown Convention Center</span>
                  </div>
                  <div className="text-sm">
                    {similarEvent.isFree ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Free</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">Paid</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={event.title}
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        ticketPrice={event.ticketPrice || 50}
      />
    </div>
  )
}

export default EventDetail
