import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SearchFilterProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  ticketType?: string
  onTicketTypeChange?: (type: string) => void
  onSearch?: () => void
  placeholder?: string
  className?: string
}

const SearchFilter = ({
  searchQuery = '',
  onSearchChange,
  ticketType = 'Tickets',
  onTicketTypeChange,
  onSearch,
  placeholder = 'Search',
  className = ''
}: SearchFilterProps) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery)
  const [internalTicketType, setInternalTicketType] = useState(ticketType)

  const handleSearchChange = (value: string) => {
    setInternalSearchQuery(value)
    onSearchChange?.(value)
  }

  const handleTicketTypeChange = (type: string) => {
    setInternalTicketType(type)
    onTicketTypeChange?.(type)
  }

  const handleSearch = () => {
    onSearch?.()
  }

  const ticketOptions = [
    { label: 'Tickets', value: 'Tickets' },
    { label: 'Free', value: 'Free' },
    { label: 'Paid', value: 'Paid' }
  ]

  return (
    <div className={`max-w-lg mx-auto ${className}`}>
      <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={onSearchChange ? searchQuery : internalSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 h-10 bg-transparent border-0 rounded-none text-sm focus:ring-0 focus:outline-none"
          />
        </div>
        
        <div className="border-l border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-10 px-3 bg-transparent border-0 rounded-none hover:bg-gray-50 text-black font-normal text-sm"
              >
                {onTicketTypeChange ? ticketType : internalTicketType}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-1 bg-white border border-gray-200 shadow-lg rounded-lg">
              {ticketOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => handleTicketTypeChange(option.value)}
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer transition-all duration-200 ease-in-out
                    hover:bg-orange-50 hover:text-orange-600 
                    focus:bg-orange-50 focus:text-orange-600 focus:outline-none
                    ${(onTicketTypeChange ? ticketType : internalTicketType) === option.value 
                      ? 'bg-orange-100 text-orange-700 font-medium' 
                      : 'text-gray-700'
                    }
                  `}
                >
                  <span className="flex items-center justify-between w-full">
                    {option.label}
                    {(onTicketTypeChange ? ticketType : internalTicketType) === option.value && (
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button 
          onClick={handleSearch}
          className="h-10 px-4 bg-black hover:bg-black/90 text-white rounded-none font-medium text-sm"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default SearchFilter
