import { useState } from 'react'
import { X, Plus, Minus, ArrowRight } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  ticketPrice: number
}

const PaymentModal = ({ isOpen, onClose, ticketPrice }: PaymentModalProps) => {
  const [quantity, setQuantity] = useState(2)
  const [isSelected, setIsSelected] = useState(true)

  if (!isOpen) return null

  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1)
    }
  }

  const price = ticketPrice
  const vat = ticketPrice
  const total = quantity * (price + vat)

  const handleProceed = () => {
    // Handle payment logic here
    console.log('Proceeding to payment with quantity:', quantity)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <p className="text-gray-600 mb-8">select your ticket type</p>

          {/* Ticket Selection Card */}
          <div 
            className={`rounded-2xl mb-8 cursor-pointer transition-all ${
              isSelected 
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 p-[3px]' 
                : ''
            }`}
            onClick={() => setIsSelected(!isSelected)}
          >
            <div className={`bg-white px-6 py-4 ${isSelected ? 'rounded-[13px]' : 'rounded-2xl'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Checkmark - always show */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-500' : 'border-2 border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Ticket Icon and Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎫</span>
                    <span className="font-semibold text-gray-900">Regular ticket</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDecrement()
                    }}
                    className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleIncrement()
                    }}
                    className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-lg">Quantity</span>
              <span className="text-gray-900 font-semibold text-xl">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-lg">Price:</span>
              <span className="text-gray-900 font-semibold text-xl">${price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-lg">VAT:</span>
              <span className="text-gray-900 font-semibold text-xl">${vat}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-gray-900 font-semibold text-lg">Total:</span>
              <span className="text-gray-900 font-bold text-2xl">${total}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <button 
            onClick={handleProceed}
            className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors text-lg"
          >
            Proceed to payment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
