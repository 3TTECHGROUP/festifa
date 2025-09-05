
import { EventCard } from '../../ui/EventCard'

interface Event {
  id: number
  name: string
  organizer: string
  date: string
  time: string
  location: string
  status: 'Free' | 'Paid'
  image: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    name: "Name of event",
    organizer: "YOU (Ikperi David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    status: "Free",
    image: "/src/assets/images/event-1.jpg"
  },
  {
    id: 2,
    name: "Name of event",
    organizer: "YOU (Ikperi David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    status: "Paid",
    image: "/src/assets/images/event-2.jpg"
  },
  {
    id: 3,
    name: "Name of event",
    organizer: "YOU (Ikperi David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    status: "Free",
    image: "/src/assets/images/event-3.jpg"
  },
  {
    id: 4,
    name: "Name of event",
    organizer: "YOU (Ikperi David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    status: "Free",
    image: "/src/assets/images/event-4.jpg"
  }
]

export const TrendingEvents = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">Trending events</h2>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <button className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1">
            See all events
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              organizer={event.organizer}
              date={event.date}
              time={event.time}
              location={event.location}
              status={event.status}
              image={event.image}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
