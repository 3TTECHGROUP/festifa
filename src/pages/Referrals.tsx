import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Referrals = () => {
  const [referralLink] = useState('davidikperi/festifa.com/referral')
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const navigate = useNavigate()

  const referrals = [
    {
      id: 1,
      name: 'Ikperi David',
      email: 'davidikperi@gmail.com'
    },
    {
      id: 2,
      name: 'Ikperi David',
      email: 'davidikperi@gmail.com'
    }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    // You could add a toast notification here
  }

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  const handleDetailsClick = () => {
    navigate('/dashboard/user-details/1')
    setOpenDropdown(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Referrals</h1>
        <p className="text-gray-600">Gathering people for your event is more stylish with festifa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Friends Invited Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Friends invited</div>
          <div className="text-3xl font-bold text-gray-900">2</div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-3">Referral link</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded flex-1 mr-3">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
            >
              Copy link
            </button>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Referrals</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {referrals.map((referral) => (
            <div key={referral.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Name</div>
                    <div className="font-medium text-gray-900">{referral.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-medium text-gray-900">{referral.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="ml-4 relative">
                <button 
                  onClick={() => toggleDropdown(referral.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === referral.id && (
                  <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleDetailsClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {referrals.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
            <p className="text-gray-500">Share your referral link to start earning rewards.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Referrals
