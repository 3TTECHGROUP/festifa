import { useState } from 'react'
import { Search } from 'lucide-react'

// interface Template {
//   id: number
//   title: string
//   image: string
//   category: string
//   height: string
// }

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'All',
    'Birthday', 
    'Anniversary',
    'Party Events'
  ]

  // Template data with real images and random heights
  const templates = [
    {
      id: 1,
      title: 'Birthday Party Invitation',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=600&fit=crop&crop=center',
      category: 'Birthday',
      height: 'h-64'
    },
    {
      id: 2,
      title: 'Wedding Anniversary',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=700&fit=crop&crop=center',
      category: 'Anniversary',
      height: 'h-80'
    },
    {
      id: 3,
      title: 'Corporate Event',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=500&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-48'
    },
    {
      id: 4,
      title: 'Music Concert',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-76'
    },
    {
      id: 5,
      title: 'Baby Shower',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=550&fit=crop&crop=center',
      category: 'Birthday',
      height: 'h-40'
    },
    {
      id: 6,
      title: 'Graduation Party',
      image: 'https://images.unsplash.com/photo-1523050854058-379afb476865?w=400&h=500&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-44'
    },
    {
      id: 7,
      title: 'Sunday Worship',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=700&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-80'
    },
    {
      id: 8,
      title: 'Christmas Party',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=600&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-72'
    },
    {
      id: 9,
      title: 'New Year Celebration',
      image: 'https://images.unsplash.com/photo-1467810563316-b7bbc0679853?w=400&h=500&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-48'
    },
    {
      id: 10,
      title: 'Art Gallery Opening',
      image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=650&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-76'
    },
    {
      id: 11,
      title: 'Business Conference',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=550&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-44'
    },
    {
      id: 12,
      title: 'Wedding Invitation',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=650&fit=crop&crop=center',
      category: 'Anniversary',
      height: 'h-80'
    },
    {
      id: 13,
      title: 'Sports Event',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=550&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-72'
    },
    {
      id: 14,
      title: 'Food Festival',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-76'
    },
    {
      id: 15,
      title: 'Fashion Show',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-40'
    },
    {
      id: 16,
      title: 'Charity Gala',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=650&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-80'
    },
    {
      id: 17,
      title: 'Tech Meetup',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=550&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-68'
    },
    {
      id: 18,
      title: 'Book Launch',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
      category: 'Party Events',
      height: 'h-72'
    }
  ]

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#FFA500' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute top-20 right-20 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45" />
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-14 h-14 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
          
          {/* Additional decorative shapes */}
          <div className="absolute top-16 left-1/3 w-6 h-6 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-1/4 w-12 h-12 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-32 right-16 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-16 left-1/2 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Templates for all types of events
          </h1>
          <p className="text-black/80 text-lg mb-8">
            Discover over 1,000 customizable event template available to you!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center px-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing search results
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-in-out
                ${selectedCategory === category
                  ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                  : "text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid - Masonry Layout */}
        <div className="columns-2 md:columns-3 lg:columns-6 gap-4 space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="break-inside-avoid mb-4"
            >
              <div className={`bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group`}>
                <div className={`relative overflow-hidden ${template.height}`}>
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Template'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Templates
