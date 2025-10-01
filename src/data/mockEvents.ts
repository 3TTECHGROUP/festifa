export interface Event {
  id: number
  title: string
  organizer: string
  date: string
  time: string
  location: string
  image: string
  description?: string
  tags?: string[]
  ticketPrice?: number
  isFree?: boolean
  likes?: number
  shares?: number
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "NOIRE LOUNGE DUO",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    description: "This is going to be the description of the event given by the host. Join us for an amazing evening of music and entertainment.",
    tags: ["music", "nightlife", "entertainment", "lounge", "duo", "live"],
    ticketPrice: 5000,
    isFree: false,
    likes: 10,
    shares: 240
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop",
    description: "Discover the latest in technology and innovation. Network with industry leaders and learn about cutting-edge developments.",
    tags: ["technology", "innovation", "networking", "business", "summit", "tech"],
    ticketPrice: 0,
    isFree: true,
    likes: 45,
    shares: 120
  },
  {
    id: 3,
    title: "Annual Tech Innovation Summit",
    organizer: "Alex Morgan",
    date: "December 15, 2023",
    time: "10:30 AM",
    location: "City Hall Conference Room",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop",
    description: "Join us for the annual tech innovation summit featuring keynote speakers, workshops, and networking opportunities.",
    tags: ["technology", "innovation", "conference", "networking", "annual", "summit"],
    ticketPrice: 2500,
    isFree: false,
    likes: 78,
    shares: 156
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
    description: "Experience the finest food and wine from local and international vendors. A culinary journey awaits!",
    tags: ["food", "wine", "festival", "culinary", "tasting", "local"],
    ticketPrice: 3500,
    isFree: false,
    likes: 92,
    shares: 203
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop",
    description: "Celebrate the opening of our new contemporary art gallery featuring works from emerging local artists.",
    tags: ["art", "gallery", "opening", "contemporary", "local", "artists"],
    ticketPrice: 0,
    isFree: true,
    likes: 34,
    shares: 67
  },
  {
    id: 6,
    title: "Music Concert Under Stars",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
    description: "An enchanting evening of live music performed under the stars in our beautiful outdoor venue.",
    tags: ["music", "concert", "outdoor", "stars", "live", "evening"],
    ticketPrice: 4000,
    isFree: false,
    likes: 156,
    shares: 289
  },
  {
    id: 7,
    title: "Tech Innovations Summit 2023",
    organizer: "Alex Johnson",
    date: "December 15, 2023",
    time: "10:30 AM",
    location: "City Hall Auditorium",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop",
    description: "Explore the future of technology with industry experts and thought leaders in this comprehensive summit.",
    tags: ["technology", "summit", "innovation", "future", "experts", "2023"],
    ticketPrice: 7500,
    isFree: false,
    likes: 203,
    shares: 445
  },
  {
    id: 8,
    title: "Tech Innovations Conference 2023",
    organizer: "YOU (Alex Morgan)",
    date: "December 15, 2023",
    time: "10:30 AM",
    location: "City Center Exhibition Hall",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    description: "A comprehensive conference covering the latest trends and innovations in technology and digital transformation.",
    tags: ["technology", "conference", "innovation", "digital", "trends", "2023"],
    ticketPrice: 6000,
    isFree: false,
    likes: 167,
    shares: 334
  },
  {
    id: 9,
    title: "Startup Networking Event",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop",
    description: "Connect with fellow entrepreneurs, investors, and startup enthusiasts in this dynamic networking event.",
    tags: ["startup", "networking", "entrepreneurs", "investors", "business", "connect"],
    ticketPrice: 1500,
    isFree: false,
    likes: 89,
    shares: 178
  },
  {
    id: 10,
    title: "Photography Workshop",
    organizer: "YOU (Rupert David)",
    date: "November 20, 2023",
    time: "9:00 AM",
    location: "Downtown Convention Center",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
    description: "Learn professional photography techniques from award-winning photographers in this hands-on workshop.",
    tags: ["photography", "workshop", "professional", "techniques", "hands-on", "learning"],
    ticketPrice: 2000,
    isFree: false,
    likes: 67,
    shares: 134
  },
  {
    id: 11,
    title: "Tech Innovations Summit 2023",
    organizer: "Alex Johnson",
    date: "December 15, 2023",
    time: "10:30 AM",
    location: "City Hall Auditorium",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop",
    description: "Join industry leaders for insights into the future of technology and innovation in this premier summit.",
    tags: ["technology", "summit", "innovation", "leaders", "future", "premier"],
    ticketPrice: 8000,
    isFree: false,
    likes: 234,
    shares: 567
  },
  {
    id: 12,
    title: "Tech Innovations Conference 2023",
    organizer: "YOU (Alex Morgan)",
    date: "December 15, 2023",
    time: "10:30 AM",
    location: "City Center Exhibition Hall",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    description: "The ultimate conference for tech professionals featuring workshops, panels, and networking opportunities.",
    tags: ["technology", "conference", "professional", "workshops", "panels", "networking"],
    ticketPrice: 5500,
    isFree: false,
    likes: 145,
    shares: 298
  }
]

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    content: 'This looks amazing! Can\'t wait to attend.',
    timestamp: '2 hours ago',
    likes: 5
  },
  {
    id: '2',
    author: 'Mike Chen',
    content: 'Great event, looking forward to it!',
    timestamp: '4 hours ago',
    likes: 3
  },
  {
    id: '3',
    author: 'Emily Davis',
    content: 'Will there be parking available?',
    timestamp: '6 hours ago',
    likes: 1
  }
]

export const findEventById = (id: number): Event | undefined => {
  return mockEvents.find(event => event.id === id)
}
