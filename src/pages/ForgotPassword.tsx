import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password recovery logic here
    console.log('Recovery email:', email)
    // Navigate to OTP verification page
    navigate('/verify-otp')
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFA500' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        <div className="absolute top-16 left-16 w-20 h-20 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-600">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="absolute top-20 right-20 w-16 h-16 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-600">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-20 w-24 h-24 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-600">
            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
          </svg>
        </div>
        
        {/* Circles */}
        <div className="absolute bottom-20 right-24 w-24 h-24 border-4 border-yellow-600/30 rounded-full"></div>
        <div className="absolute top-1/3 left-8 w-12 h-12 border-4 border-yellow-600/30 rounded-full"></div>
      </div>

      {/* Container with Grid Layout */}
      <div className="container mx-auto px-4 min-h-screen relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-8">
          {/* Left Column - Branding */}
          <div className="text-black">
            <div className="mb-6">
              <h1 className="text-xl font-bold">Festifa</h1>
            </div>
            <blockquote className="text-[32px] font-medium leading-relaxed">
              "Great events don't just happen—they're created by the people who gather for them."
            </blockquote>
          </div>

          {/* Right Column - Forgot Password Form Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
              {/* Back Button */}
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Forgot your Password</h2>
                <p className="text-gray-500 text-sm">
                  Let's help you get your account back, kindly submit the email address of your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Recover Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Recover my account
                </button>
              </form>

              {/* Signup Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  Don't have a Festifa account?{' '}
                  <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
