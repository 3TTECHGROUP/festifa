import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import qrCode from '@/assets/images/qr.png'

export const HowItWorks = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Festifa is really easy to use, Get started without any kyc!",
      description: "Download the app or continue using on the web here",
      buttonText: "Download the App",
      showQR: false
    },
    {
      id: 2,
      title: "Host Events with Ease",
      description: "Create and manage your events effortlessly with our intuitive tools",
      buttonText: "Start Hosting",
      showQR: false
    },
    {
      id: 3,
      title: "Find Events Around You",
      description: "Discover amazing events happening in your area and connect with others",
      buttonText: "Browse Events",
      showQR: false
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 10000) 

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">How it works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Do you want to Host an event or attend an event around you? Festifa makes that really easy. Don't just 
            take our word for it, Try it out yourself
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative custom-boxed-slider-main">
          {/* Main Content Section - Carousel with Fade Effect */}
          <div className="relative min-h-[400px]">
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                  {/* Left Section */}
                  <div className="flex-1 lg:max-w-md">
                    <div className="mb-8">
                      {/* Dot Indicators - Moved to text area */}
                      <div className="flex mb-6 space-x-2">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`rounded-full transition-all duration-300 ${
                              index === currentSlide 
                                ? 'bg-orange-400 w-8 h-3' 
                                : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                      {/* <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-500 mb-6"></div> */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight custom-text-class">
                        {slide.title}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {slide.description}
                      </p>
                      <Button className="bg-[#FFA500] hover:bg-orange-500 text-black px-6 py-3 rounded-full font-medium ">
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex-1 flex justify-center lg:justify-end">
                    {!slide.showQR ? (
                      <div className="relative">
                        {/* Decorative Background */}
                        <div className="img-box">
                            <img src={qrCode} alt="" width='100%' />
                        </div>
                       
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-12 max-w-sm">
                          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl flex items-center justify-center">
                            <div className="text-white text-6xl font-bold">
                              {slide.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
