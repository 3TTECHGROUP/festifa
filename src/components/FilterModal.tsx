import { useState } from 'react'
import { X, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

interface FilterData {
//   location: string
  dateType: string
  distance: string
  eventCategories: string[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filters: FilterData) => void
}

const FilterModal = ({ isOpen, onClose, onApplyFilter }: FilterModalProps) => {
//   const [location, setLocation] = useState('')
  const [selectedDateType, setSelectedDateType] = useState('Any Date')
  const [selectedDistance, setSelectedDistance] = useState('Any Distance')
  const [selectedEventCategory, setSelectedEventCategory] = useState<string[]>([])

  const dateTypes = ['Any Date', 'This Week', 'This Month', 'This Year']
  const distances = ['Any Distance', '5 Miles', '10 Miles', '25 Miles', '50 Miles', '100 Miles']
  const eventCategories = [
    'All', 'Conferences', 'Seminars', 'Business', 'Webinar', 
    'Concerts', 'Night', 'Food & Drinks', 'Sports', 'Arts', 
    'Music', 'Networking', 'Workshop'
  ]

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      setSelectedEventCategory(selectedEventCategory.includes('All') ? [] : ['All'])
    } else {
      const newCategories = selectedEventCategory.includes(category)
        ? selectedEventCategory.filter(c => c !== category && c !== 'All')
        : [...selectedEventCategory.filter(c => c !== 'All'), category]
      setSelectedEventCategory(newCategories)
    }
  }

  const handleApplyFilter = () => {
    const filters: FilterData = {
    //   location,
      dateType: selectedDateType,
      distance: selectedDistance,
      eventCategories: selectedEventCategory
    }
    onApplyFilter(filters)
    onClose()
  }

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  )

  const FilterButton = ({ 
    label, 
    isSelected, 
    onClick 
  }: { 
    label: string; 
    isSelected: boolean; 
    onClick: () => void 
  }) => (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 mr-2 mb-2
        ${isSelected 
          ? 'bg-black text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-0 max-h-[100vh] overflow-hidden border-0">
        <DialogTitle className="sr-only">Filter Search</DialogTitle>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filter Search</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-140px)] bg-white">
          {/* Location */}
          <FilterSection title="Location">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Location"
                // value={location}
                // onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </FilterSection>

          {/* Date Type */}
          <FilterSection title="Date Type">
            <div className="flex flex-wrap">
              {dateTypes.map((type) => (
                <FilterButton
                  key={type}
                  label={type}
                  isSelected={selectedDateType === type}
                  onClick={() => setSelectedDateType(type)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Distance */}
          <FilterSection title="Distance">
            <div className="flex flex-wrap">
              {distances.map((distance) => (
                <FilterButton
                  key={distance}
                  label={distance}
                  isSelected={selectedDistance === distance}
                  onClick={() => setSelectedDistance(distance)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Event Category */}
          <FilterSection title="Event Category">
            <div className="flex flex-wrap">
              {eventCategories.map((category) => (
                <FilterButton
                  key={category}
                  label={category}
                  isSelected={selectedEventCategory.includes(category)}
                  onClick={() => handleCategoryToggle(category)}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleApplyFilter}
            className="w-full bg-[#FFA500] hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Apply Filter
          </button>
        </div>

        {/* Hidden DialogDescription for accessibility */}
        <DialogDescription className="sr-only">
          Use the filters below to narrow down your search results.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default FilterModal
