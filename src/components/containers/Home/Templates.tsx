import { Link } from 'react-router-dom'

export const Templates = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Templates</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Do you want to Host an event or attend an event around you? Festifa makes that really easy. Don't just take our word for it, Try it out yourself
        </p>
        
        {/* Templates Grid - Masonry Layout (same as Templates page) */}
        <div className="columns-2 md:columns-3 lg:columns-6 gap-4 space-y-4 mb-8 text-left">
          {[
            { id: 1,  title: 'Birthday Party Invitation', image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=600&fit=crop&crop=center', height: 'h-64' },
            { id: 2,  title: 'Wedding Anniversary',       image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=700&fit=crop&crop=center', height: 'h-80' },
            { id: 3,  title: 'Corporate Event',           image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=500&fit=crop&crop=center', height: 'h-48' },
            { id: 4,  title: 'Music Concert',             image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop&crop=center', height: 'h-76' },
            { id: 5,  title: 'Baby Shower',               image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=550&fit=crop&crop=center', height: 'h-40' },
            { id: 6,  title: 'Graduation Party',          image: 'https://images.unsplash.com/photo-1523050854058-379afb476865?w=400&h=500&fit=crop&crop=center', height: 'h-44' },
            { id: 7,  title: 'Sunday Worship',            image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=700&fit=crop&crop=center', height: 'h-80' },
            { id: 8,  title: 'Christmas Party',           image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=600&fit=crop&crop=center', height: 'h-72' },
            { id: 9,  title: 'New Year Celebration',      image: 'https://images.unsplash.com/photo-1467810563316-b7bbc0679853?w=400&h=500&fit=crop&crop=center', height: 'h-48' },
            { id: 10, title: 'Art Gallery Opening',       image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=650&fit=crop&crop=center', height: 'h-76' },
            { id: 11, title: 'Business Conference',       image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=550&fit=crop&crop=center', height: 'h-44' },
            { id: 12, title: 'Wedding Invitation',        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=650&fit=crop&crop=center', height: 'h-80' }
          ].map((template) => (
            <div key={template.id} className="break-inside-avoid mb-4">
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
        
        <p className="text-gray-700 mb-6">There are templates that fit every type of occasion</p>
        
        <Link to="/templates" className="inline-flex items-center gap-2">
          <span className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black px-8 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center gap-2">
            See all templates
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  )
}
