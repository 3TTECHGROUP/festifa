import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {SettingsIcon } from 'lucide-react'
import SearchFilter from '@/components/SearchFilter'
import EventCard from '@/components/EventCard'
import FilterModal from '@/components/FilterModal'
import { mockEvents } from '@/data/mockEvents'
import eventPageBg from '@/assets/images/event-page-bg.png'

// Mock categories data
const categories = [
  "Upcoming Events",
  "Events Near Me", 
  "Night Life",
  "Music",
  "Careers",
  "Food and Drinks",
  "Arts"
]

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('Upcoming Events')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ 
        backgroundColor: '#ffa503',
        backgroundImage: `url(${eventPageBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Orange Color Overlay */}
        <div className="absolute inset-0 bg-[#FFA500]/30"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Additional decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute top-20 right-20 w-12 h-12 border-2 border-white/20 rounded-lg rotate-45" />
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-14 h-14 border-2 border-white/20 rounded-lg rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-white/20 rounded-lg rotate-45" />
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Best search for all events
          </h1>
          <p className="text-black/80 text-lg mb-8">
            Discover over 100,000 events happening near you!
          </p>

          {/* Search Bar */}
          <SearchFilter />
        </div>
      </div>

      {/* Search Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing search results
          </h2>
          <Button variant="outline" className="text-gray-600 border-gray-100 hover:bg-gray-50" onClick={() => setIsFilterModalOpen(true)}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            filter search
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-in-out
                ${selectedCategory === category
                  ? "bg-black text-white hover:bg-gray-800 shadow-sm"
                  : "text-gray-700 bg-gray-100 border-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApplyFilter={() => setIsFilterModalOpen(false)} />
    </div>
  )
}

export default Events
