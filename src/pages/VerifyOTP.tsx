/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useProfileMutation,
} from '@/RTK/RegisterUserQuery/registerQuery'

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(180)
  const [canResend, setCanResend] = useState(false)
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const navigate = useNavigate()
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation()
  const [triggerProfile] = useProfileMutation()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = async () => {
    if (!email) return
    try {
      await resendVerification({ email }).unwrap()
      toast.success('Verification code sent to your email')
      setTimeLeft(180)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || 'Failed to resend code')
    }
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (!email) {
      toast.error('Missing email. Please sign up again.')
      navigate('/signup')
      return
    }
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }
    try {
      const res = await verifyEmail({ email, code }).unwrap()
      localStorage.setItem('user', JSON.stringify(res.data))
      localStorage.setItem('email_verified', String(res.data.email_verified))
      toast.success(res.message || 'Email verified successfully')
      // Attempt direct login by fetching profile (assuming session/cookie set on verify)
      try {
        const profileRes = await triggerProfile().unwrap()
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(profileRes.data))
        navigate('/dashboard')
      } catch (profileErr: any) {
        // Fallback if profile isn't available yet
        toast.error(profileErr?.data?.message || profileErr?.error || 'Could not complete login, please login manually')
        navigate('/login')
      }
    } catch (err: any) {
      const details = err?.data?.error?.details as Array<{ field?: string; message?: string }> | undefined
      const codeMsg = details?.find?.(d => d.field === 'code')?.message
      if (codeMsg) {
        toast.error(codeMsg)
      } else {
        toast.error(err?.data?.message || err?.error || 'Verification failed')
      }
    }
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

          {/* Right Column - OTP Form Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
              {/* Back Button */}
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify your email</h2>
                <p className="text-gray-500 text-sm">
                  {email ? (
                    <>We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>. Enter it below.</>
                  ) : (
                    <>We need your email to verify. Please go back to sign up.</>
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* OTP Input Boxes */}
                <div className="flex gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="mb-4">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!email || isResending}
                      className="text-orange-500 hover:text-orange-600 font-medium disabled:opacity-60"
                    >
                      {isResending ? 'Sending…' : 'Resend code'}
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Resend code in {formatTime(timeLeft)}
                    </span>
                  )}
                </div>

                {/* Recover Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-black text-white py-3.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {isVerifying ? 'Verifying…' : 'Verify email'}
                </button>
              </form>

              {/* Signup Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  Don't have a Festifa account?{' '}
                  <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                    Signup
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

export default VerifyOTP
