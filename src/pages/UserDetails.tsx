// import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const UserDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock user data - in real app this would come from API based on id
  const user = {
    id: id || '1',
    name: 'Ikperi David',
    email: 'davidikperi@gmail.com',
    phone: '+234 801 234 5678',
    joinDate: 'December 5, 2023',
    status: 'Active',
    totalEvents: 5,
    totalTickets: 12,
    referralCode: 'IKPERI2023',
    location: 'Lagos, Nigeria',
    avatar: null
  }

  const stats = [
    {
      label: 'Events Created',
      value: user.totalEvents,
      icon: '📅'
    },
    {
      label: 'Tickets Purchased',
      value: user.totalTickets,
      icon: '🎫'
    },
    {
      label: 'Referral Code',
      value: user.referralCode,
      icon: '🔗'
    },
    {
      label: 'Status',
      value: user.status,
      icon: '✅'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Purchased VIP ticket for Tech Summit 2023',
      date: 'December 10, 2023',
      time: '2:30 PM'
    },
    {
      id: 2,
      action: 'Created event: Artists Showcase Night',
      date: 'December 8, 2023',
      time: '10:15 AM'
    },
    {
      id: 3,
      action: 'Referred new user: John Smith',
      date: 'December 5, 2023',
      time: '4:45 PM'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl text-gray-600">👤</span>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date} at {activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {recentActivity.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-500">This user hasn't performed any actions recently.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetails
