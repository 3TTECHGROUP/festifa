import { Calendar, MapPin, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import TemplatePreview from '@/components/TemplatePreview'
import type { TemplateSummary } from '@/service/templateLoader'

type BasicEvent = {
  id: string | number
  title: string
  organizer: string
  date: string
  time: string
  location: string
  image: string
  isFree?: boolean
}

interface EventCardProps {
  event: BasicEvent
  onClick?: (id: string | number) => void
  className?: string
  templateTpl?: TemplateSummary
  propOverrides?: Record<string, string>
}

const EventCard = ({
  event,
  onClick,
  className = '',
  templateTpl,
  propOverrides
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
      <div className={templateTpl ? "relative overflow-hidden aspect-[3/4]" : "aspect-video relative overflow-hidden"}>
        {templateTpl ? (
          <TemplatePreview tpl={templateTpl} propOverrides={propOverrides} />
        ) : (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
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
