import template from '@/assets/images/templates.png'

export const Templates = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Templates</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Do you want to Host an event or attend an event around you? Festifa makes that really easy. Don't just take our word for it, Try it out yourself
        </p>
        
        {/* Template grid will go here */}
        <div className="gap-4 mb-8">
          {/* Template cards will be added here */}
          <img src={template} alt="Template" width="100%" />
        </div>
        
        <p className="text-gray-700 mb-6">There are templates that fit every type of occasion</p>
        
        <button className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black px-8 py-3 rounded-full font-semibold transition-colors duration-200 inline-flex items-center gap-2">
          See all templates
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
