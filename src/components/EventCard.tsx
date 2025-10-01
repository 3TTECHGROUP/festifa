import { Calendar, MapPin, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type Event } from '@/data/mockEvents'

interface EventCardProps {
  event: Event
  onClick?: (id: number) => void
  className?: string
}

const EventCard = ({
  event,
  onClick,
  className = ''
}: EventCardProps) => {
  const handleClick = () => {
    onClick?.(event.id)
  }

  return (
    <Link 
      to={`/events/${event.id}`}
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer block ${className}`}
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.organizer}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
