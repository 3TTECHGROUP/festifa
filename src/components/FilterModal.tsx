/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { X, Search } from 'lucide-react'
import { useGetCategoriesQuery } from '@/RTK/CategoriesQuery/categoriesQuery'

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
)

const FilterButton = ({
  label,
  isSelected,
  onClick,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 mr-2 mb-2
      ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
    `}
  >
    {label}
  </button>
)

interface FilterData {
  location?: string
  dateType: string
  distance: string
  categoryId?: string
  latitude?: number
  longitude?: number
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilter: (filters: FilterData) => void
}

const FilterModal = ({ isOpen, onClose, onApplyFilter }: FilterModalProps) => {
  const [location, setLocation] = useState('')
  const [selectedDateType, setSelectedDateType] = useState('Any Date')
  const [selectedDistance, setSelectedDistance] = useState('Any Distance')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isFetchingCoords, setIsFetchingCoords] = useState(false)
  const [coordsError, setCoordsError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Load categories from API
  const { data: categoriesData } = useGetCategoriesQuery()

  const dateTypes = ['Any Date', 'This Week', 'This Month', 'This Year']
  const distances = ['Any Distance', '5 Miles', '10 Miles', '25 Miles', '50 Miles', '100 Miles']
  const eventCategories = [{ id: undefined as unknown as string, label: 'All' }, ...(categoriesData?.data || []).map(c => ({ id: c.id, label: c.category }))]

  // Debounced geocoding — fires 600ms after typing stops, min 3 chars
  useEffect(() => {
    if (!isOpen) return
    const query = location.trim()
    if (query.length < 3) {
      setCoordsError(null)
      return
    }
    const timer = window.setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        setIsFetchingCoords(true)
        setCoordsError(null)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
          { headers: { Accept: 'application/json' }, signal: controller.signal }
        )
        if (!res.ok) throw new Error('Unable to fetch coordinates')
        const data = (await res.json()) as Array<{ lat: string; lon: string }>
        if (data.length) {
          setCoords({ latitude: Number(data[0].lat), longitude: Number(data[0].lon) })
        } else {
          setCoordsError('Location not found')
          setCoords(null)
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setCoordsError('Unable to fetch coordinates')
        setCoords(null)
      } finally {
        setIsFetchingCoords(false)
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [location, isOpen])

  const triggerGeocode = async () => {
    const query = location.trim()
    if (!query) return
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      setIsFetchingCoords(true)
      setCoordsError(null)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
        { headers: { Accept: 'application/json' }, signal: controller.signal }
      )
      if (!res.ok) throw new Error('Unable to fetch coordinates')
      const data = (await res.json()) as Array<{ lat: string; lon: string }>
      if (data.length) {
        setCoords({ latitude: Number(data[0].lat), longitude: Number(data[0].lon) })
      } else {
        setCoordsError('Location not found')
        setCoords(null)
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return
      setCoordsError('Unable to fetch coordinates')
      setCoords(null)
    } finally {
      setIsFetchingCoords(false)
    }
  }

  const handleCategorySelect = (id?: string) => {
    setSelectedCategoryId((prev) => (prev === id ? undefined : id))
  }

  const handleApplyFilter = async () => {
    const query = location.trim()
    let lat = coords?.latitude
    let lng = coords?.longitude

    // Ensure we have coordinates if location text is provided
    if (query && (lat == null || lng == null)) {
      try {
        setIsFetchingCoords(true)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
          { headers: { Accept: 'application/json' } }
        )
        if (res.ok) {
          const data = (await res.json()) as Array<{ lat: string; lon: string }>
          if (data.length) {
            lat = Number(data[0].lat)
            lng = Number(data[0].lon)
            setCoords({ latitude: lat, longitude: lng })
          }
        }
      } finally {
        setIsFetchingCoords(false)
      }
    }

    const filters: FilterData = {
      location: query || undefined,
      dateType: selectedDateType,
      distance: selectedDistance,
      categoryId: selectedCategoryId,
      latitude: lat,
      longitude: lng,
    }
    onApplyFilter(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl pointer-events-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filter Search</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 180px)' }}>
          {/* Location */}
          <FilterSection title="Location">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && triggerGeocode()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              {/* <button
                type="button"
                onClick={triggerGeocode}
                disabled={isFetchingCoords || location.trim().length < 1}
                className="px-3 py-2 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isFetchingCoords ? '...' : 'Search'}
              </button> */}
            </div>
            {(isFetchingCoords || coordsError || coords) && (
              <div className="mt-1">
                {isFetchingCoords && <p className="text-xs text-gray-500">Fetching coordinates...</p>}
                {coordsError && <p className="text-xs text-red-500">{coordsError}</p>}
                {!isFetchingCoords && !coordsError && coords && (
                  <p className="text-xs text-gray-500">Lat: {coords.latitude.toFixed(4)}, Lng: {coords.longitude.toFixed(4)}</p>
                )}
              </div>
            )}
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
              {eventCategories.map((c) => (
                <FilterButton
                  key={c.id ?? 'all'}
                  label={c.label}
                  isSelected={(c.id ?? undefined) === selectedCategoryId || (!selectedCategoryId && c.label === 'All')}
                  onClick={() => handleCategorySelect(c.id)}
                />
              ))}
            </div>
          </FilterSection>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={handleApplyFilter}
              className="w-full bg-[#FFA500] hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterModal
