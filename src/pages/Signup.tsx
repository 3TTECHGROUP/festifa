import { useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup email:', email)
  }

  const handleGoogleSignup = () => {
    // Handle Google signup
    console.log('Google signup')
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

          {/* Right Column - Signup Form Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
              {/* Back Button */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Signup</h2>
                <p className="text-gray-500 text-sm">Welcome to Festifa. Let's get you started in seconds</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-6"
                >
                  Sign up
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Already have a Festifa account?{' '}
                  <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                    Log in
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

export default Signup
