import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export const Newsletter = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="bg-[#FFA500] py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Section - Text */}
          <div className="flex-1 text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-2">
              Don't miss out on events near you.
            </h2>
            <p className="text-black text-sm lg:text-base">
              sign up to get notifications about events and offerings!
            </p>
          </div>

          {/* Right Section - Email Form */}
          <div className="flex-shrink-0 w-full lg:w-auto" style={{ width: '40%' }}>
            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
              <div className="relative bg-white rounded-full p-2 flex items-center w-full">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none px-8 py-3 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-0 min-w-0 text-base shadow-none outline-none"
                  required
                />
                <Button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0"
                >
                  Get Listed
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
