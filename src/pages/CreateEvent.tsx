import { useState } from 'react'
import { MapPin, Users, Tag, Calendar, Clock, Camera, ArrowRight, X, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    category: undefined as string | undefined,
    startDate: '',
    startTime: '',
    endDate: '',
    isAllDay: false,
    hasEndDate: false,
    createForm: false,
    allowComments: false,
    multimediaSupport: false,
    hasTickets: false
  })

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<'Birthday' | 'Anniversary'>('Birthday')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handleTemplateSelect = (templateId: string) => {
    console.log('Selected template:', templateId)
    setIsTemplateModalOpen(false)
  }

  // Mobile Template Modal Component
  const TemplateModal = () => (
    <div className="fixed inset-0 bg-white z-50 md:bg-black md:bg-opacity-50 md:flex md:items-center md:justify-center md:p-4">
      <div className="h-full w-full overflow-y-auto md:bg-white md:rounded-3xl md:p-4 md:max-w-6xl md:w-full md:max-h-[90vh] md:overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-none md:mb-6 sticky top-0 bg-white z-10 md:static">
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 text-center md:text-left md:flex-none">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl md:mb-1">Choose any template</h2>
            <p className="text-sm text-gray-600 md:text-base hidden md:block">Select any template and we would customize it to your needs</p>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-4 pb-8 md:p-0" style={{paddingBottom:'100px'}}>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 md:gap-3 md:mb-6">
            <button
              onClick={() => setSelectedTemplateCategory('Birthday')}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Birthday'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Birthday
            </button>
            <button
              onClick={() => setSelectedTemplateCategory('Anniversary')}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors text-sm md:text-base md:px-6 md:py-2 ${
                selectedTemplateCategory === 'Anniversary'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Anniversary
            </button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            {/* Template 1 - DED A-4 Poster Style */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-1')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 aspect-[2/3] p-2 flex flex-col md:aspect-[3/4] md:p-3">
                  {/* Poster clips at top */}
                  <div className="absolute -top-1 left-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:left-3 md:w-3 md:h-2"></div>
                  <div className="absolute -top-1 right-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:right-3 md:w-3 md:h-2"></div>
                  
                  {/* Main content */}
                  <div className="flex-1 flex flex-col justify-center items-center text-white">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mb-1 md:w-8 md:h-8 md:mb-2">
                      <span className="text-white font-bold text-xs md:text-sm">A</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold mb-0.5 md:text-sm md:mb-1">DED A-4</div>
                      <div className="text-xs opacity-90 mb-0.5 md:mb-1">Creative Design</div>
                      <div className="w-4 h-0.5 bg-orange-400 rounded-full mx-auto md:w-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template 2 - Rich & Famous Red */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-2')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-red-600 aspect-[2/3] p-2 flex flex-col text-white md:aspect-[3/4] md:p-3">
                  {/* Crown icon */}
                  <div className="absolute top-1 right-1 md:top-2 md:right-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded flex items-center justify-center md:w-5 md:h-5">
                      <span className="text-red-600 font-bold text-xs">👑</span>
                    </div>
                  </div>
                  
                  {/* Event details */}
                  <div className="mt-1 md:mt-2">
                    <div className="text-xs opacity-90 mb-0.5">NOIRE LOUNGE</div>
                    <div className="text-xs opacity-75 mb-1">MUSIC POLICY</div>
                  </div>
                  
                  {/* Main title */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm font-bold mb-0.5 md:text-lg md:mb-1">Rich & Famous</div>
                    <div className="text-xs mb-1 md:mb-2">28TH JUNE</div>
                  </div>
                  
                  {/* Payment badges */}
                  <div className="flex gap-1 mt-auto">
                    <div className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded font-bold md:px-1.5">VISA</div>
                    <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold md:px-1.5">MASTER</div>
                  </div>
                  
                  <div className="text-xs mt-0.5 opacity-75">TABLE RESERVATIONS</div>
                </div>
              </div>
            </div>

            {/* Template 3 - Rich & Famous Dark */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-3')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-gray-900 aspect-[2/3] p-2 flex flex-col text-white md:aspect-[3/4] md:p-3">
                  {/* Crown icon */}
                  <div className="absolute top-1 right-1 md:top-2 md:right-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded flex items-center justify-center md:w-5 md:h-5">
                      <span className="text-gray-900 font-bold text-xs">👑</span>
                    </div>
                  </div>
                  
                  {/* Event details */}
                  <div className="mt-1 md:mt-2">
                    <div className="text-xs opacity-90 mb-0.5">NOIRE LOUNGE</div>
                    <div className="text-xs opacity-75 mb-1">MUSIC POLICY</div>
                  </div>
                  
                  {/* Main title */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm font-bold mb-0.5 md:text-lg md:mb-1">Rich & Famous</div>
                    <div className="text-xs mb-1 md:mb-2">28TH JUNE</div>
                  </div>
                  
                  {/* Payment badges */}
                  <div className="flex gap-1 mt-auto">
                    <div className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded font-bold md:px-1.5">VISA</div>
                    <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold md:px-1.5">MASTER</div>
                  </div>
                  
                  <div className="text-xs mt-0.5 opacity-75">TABLE RESERVATIONS</div>
                </div>
              </div>
            </div>

            {/* Template 4 - Another DED A-4 */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-4')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 aspect-[2/3] p-2 flex flex-col md:aspect-[3/4] md:p-3">
                  {/* Poster clips at top */}
                  <div className="absolute -top-1 left-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:left-3 md:w-3 md:h-2"></div>
                  <div className="absolute -top-1 right-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:right-3 md:w-3 md:h-2"></div>
                  
                  {/* Main content */}
                  <div className="flex-1 flex flex-col justify-center items-center text-white">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mb-1 md:w-8 md:h-8 md:mb-2">
                      <span className="text-white font-bold text-xs md:text-sm">A</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold mb-0.5 md:text-sm md:mb-1">DED A-4</div>
                      <div className="text-xs opacity-90 mb-0.5 md:mb-1">Modern Design</div>
                      <div className="w-4 h-0.5 bg-blue-400 rounded-full mx-auto md:w-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template 5 - Additional template */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-5')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 aspect-[2/3] p-2 flex flex-col md:aspect-[3/4] md:p-3">
                  <div className="absolute -top-1 left-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:left-3 md:w-3 md:h-2"></div>
                  <div className="absolute -top-1 right-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:right-3 md:w-3 md:h-2"></div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center text-white">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mb-1 md:w-8 md:h-8 md:mb-2">
                      <span className="text-white font-bold text-xs md:text-sm">B</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold mb-0.5 md:text-sm md:mb-1">DED B-5</div>
                      <div className="text-xs opacity-90 mb-0.5 md:mb-1">Elegant Design</div>
                      <div className="w-4 h-0.5 bg-green-400 rounded-full mx-auto md:w-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template 6 - Additional template */}
            <div 
              className="cursor-pointer group"
              onClick={() => handleTemplateSelect('template-6')}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
                <div className="relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 aspect-[2/3] p-2 flex flex-col md:aspect-[3/4] md:p-3">
                  <div className="absolute -top-1 left-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:left-3 md:w-3 md:h-2"></div>
                  <div className="absolute -top-1 right-2 w-2 h-1.5 bg-gray-400 rounded-sm shadow-md md:right-3 md:w-3 md:h-2"></div>
                  
                  <div className="flex-1 flex flex-col justify-center items-center text-white">
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mb-1 md:w-8 md:h-8 md:mb-2">
                      <span className="text-white font-bold text-xs md:text-sm">C</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold mb-0.5 md:text-sm md:mb-1">DED C-6</div>
                      <div className="text-xs opacity-90 mb-0.5 md:mb-1">Premium Design</div>
                      <div className="w-4 h-0.5 bg-purple-400 rounded-full mx-auto md:w-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty slots for more templates */}
            <div className="bg-gray-50 rounded-lg aspect-[2/3] flex items-center justify-center border-2 border-dashed border-gray-300 md:aspect-[3/4]">
              <span className="text-gray-400 text-center px-1 text-xs">More templates coming soon</span>
            </div>
            <div className="bg-gray-50 rounded-lg aspect-[2/3] flex items-center justify-center border-2 border-dashed border-gray-300 md:aspect-[3/4]">
              <span className="text-gray-400 text-center px-1 text-xs">More templates coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#eeeeee]">
      {/* Mobile Header */}
      <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-[#eeeeee] px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-3 mb-2 md:gap-2">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          {/* <div className="flex items-center gap-2 text-sm text-gray-400 md:text-sm">
            <span className="hidden md:inline">Events</span>
            <span className="hidden md:inline">/</span>
            <span className="text-gray-600 md:text-gray-600">Create Events</span>
          </div> */}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 md:text-3xl md:mb-2">Create Event</h1>
        <p className="text-gray-500 text-sm md:text-base">Gathering people for your event is more stylish with festifa</p>
      </div>

      <div className="p-4 md:flex md:gap-8 md:p-4 md:max-w-[1400px] md:mx-auto">
        {/* Image Upload Section */}
        <div className="mb-6 md:w-[350px] md:flex-shrink-0 md:mb-0">
          <div className="bg-white rounded-[10px] p-6 h-64 flex flex-col items-center justify-center border-gray-300 md:h-[350px] md:p-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:w-16 md:h-16 md:mb-6">
              <Camera className="w-6 h-6 text-gray-400 md:w-8 md:h-8" />
            </div>
            <p className="text-gray-600 mb-6 text-center text-base md:text-lg md:mb-8">Add image or use template</p>
            
            <div className="space-y-3 w-full max-w-[240px] md:max-w-[280px] md:space-y-4">
              <button 
                onClick={() => setIsTemplateModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors text-sm md:text-base md:px-6"
              >
                Choose from Templates
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm md:text-base md:px-6">
                Upload from device
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1">
          <div className="rounded-2xl p-6 md:p-8" style={{paddingTop:'0px'}}>
            <div className="space-y-3 md:space-y-3 custom-box-main">
              {/* Event Title */}
              <div>
                <Input
                  type="text"
                  placeholder="Event title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Event Description */}
              <div>
                <textarea
                  placeholder="Event Description"
                  value={formData.description}
                  rows={3}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-base placeholder-gray-400 md:rows-4 md:py-4"
                ></textarea>
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Capacity */}
              <div className="relative">
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base placeholder-gray-400 md:h-14"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}

                >
                  <SelectTrigger className="w-full h-12 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-base md:h-14 custom-button-dropdown">
                    <SelectValue placeholder="Category" className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="food">Food & Drinks</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time Section */}
              <div className="pt-2 md:pt-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider md:mb-6">DATE AND TIME</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:mb-8">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      placeholder="Event starting date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="time"
                      placeholder="Event starting time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-base text-gray-400 md:h-14"
                    />
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3 md:space-y-3">
                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">All the day event</span>
                    <button
                      onClick={() => handleToggle('isAllDay')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.isAllDay ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.isAllDay ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Add End Date</span>
                    <button
                      onClick={() => handleToggle('hasEndDate')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.hasEndDate ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.hasEndDate ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="pt-4 md:pt-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider md:mb-6">ADVANCED SETTINGS</h3>
                
                <div className="space-y-3 md:space-y-3">
                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Create form for event attendees</span>
                    <button
                      onClick={() => handleToggle('createForm')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.createForm ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.createForm ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Add likes and comments for this event</span>
                    <button
                      onClick={() => handleToggle('allowComments')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.allowComments ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.allowComments ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Multimedia support</span>
                    <button
                      onClick={() => handleToggle('multimediaSupport')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.multimediaSupport ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.multimediaSupport ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between comman-box-main-grid">
                    <span className="text-gray-700 text-base">Tickets</span>
                    <button
                      onClick={() => handleToggle('hasTickets')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors md:h-7 md:w-12 ${
                        formData.hasTickets ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm md:h-5 md:w-5 ${
                          formData.hasTickets ? 'translate-x-6 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-6 md:pt-8">
                <button className="w-full bg-[#FFA500] hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 text-base">
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && <TemplateModal />}
    </div>
  )
}

export default CreateEvent
