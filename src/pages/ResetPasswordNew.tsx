/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { usePasswordResetConfirmMutation } from '@/RTK/RegisterUserQuery/registerQuery'

const ResetPasswordNew = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmReset, { isLoading }] = usePasswordResetConfirmMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Missing email. Please start from Forgot Password')
      navigate('/forgot-password')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await confirmReset({ email, password }).unwrap()
      toast.success(res?.message || 'Password updated successfully')
      navigate('/login')
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || 'Failed to update password'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFA500' }}>
      <div className="absolute inset-0 overflow-hidden">
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
        <div className="absolute bottom-20 right-24 w-24 h-24 border-4 border-yellow-600/30 rounded-full"></div>
        <div className="absolute top-1/3 left-8 w-12 h-12 border-4 border-yellow-600/30 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 min-h-screen relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-8">
          <div className="text-black">
            <div className="mb-6">
              <h1 className="text-xl font-bold">Festifa</h1>
            </div>
            <blockquote className="text-[32px] font-medium leading-relaxed">
              "Great events don't just happen—they're created by the people who gather for them."
            </blockquote>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
              <Link to="/reset-password/verify" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mb-6">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create new password</h2>
                <p className="text-gray-500 text-sm">
                  {email ? <>Resetting password for <span className="font-medium text-gray-700">{email}</span></> : <>We need your email to proceed.</>}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={show ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                      required
                    />
                    <button type="button" onClick={() => setShow(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-400"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {isLoading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordNew