

const Accounts = () => {
  const wallets = [
    {
      currency: 'USD',
      flag: '🇺🇸',
      balance: '$170000',
      color: 'bg-white'
    },
    {
      currency: 'GBP', 
      flag: '🇬🇧',
      balance: '$170000',
      color: 'bg-white'
    },
    {
      currency: 'EUR',
      flag: '🇪🇺', 
      balance: '$170000',
      color: 'bg-white'
    },
    {
      currency: 'NGN',
      flag: '🇳🇬',
      balance: '$170000',
      color: 'bg-white'
    }
  ]

  const transactions = [
    {
      id: 1,
      message: 'You received $15 from Victor for a VIP ticket',
      icon: '💰',
      time: '2 hours ago'
    },
    {
      id: 2,
      message: 'You received $15 from Victor for a VIP ticket',
      icon: '💰',
      time: '5 hours ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Events / Create Event</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accounts</h1>
        <p className="text-gray-600">Manage your payments and wallets</p>
      </div>

      {/* Currency Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">{wallet.flag}</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">{wallet.currency}</span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-3xl font-bold text-gray-900">{wallet.balance}</span>
              </div>
            </div>
            
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Withdraw</span>
            </button>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        
        <div className="p-6">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">{transaction.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{transaction.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Accounts
