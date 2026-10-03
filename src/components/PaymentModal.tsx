/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { CheckCircle2, Minus, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useGetTicketAvailabilityQuery, usePurchaseTicketMutation } from '@/RTK/TicketsQuery/ticketsQuery'
import type { TicketInstance } from '@/RTK/TicketsQuery/endpoint'
import type { EventTicket } from '@/RTK/EventsQuery/endpoint'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: EventTicket | null
}

const PaymentModal = ({ isOpen, onClose, ticket }: PaymentModalProps) => {
  const [quantity, setQuantity] = useState(1)
  const [purchasedInstances, setPurchasedInstances] = useState<TicketInstance[] | null>(null)

  const { data: availabilityData, isFetching: isCheckingAvailability } = useGetTicketAvailabilityQuery(
    { ticket_id: ticket?.id || '' },
    { skip: !isOpen || !ticket?.id },
  )
  const [purchaseTicket, { isLoading: isPurchasing }] = usePurchaseTicketMutation()

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setPurchasedInstances(null)
    }
  }, [isOpen, ticket?.id])

  if (!isOpen || !ticket) return null

  const availability = availabilityData?.data
  const soldOut = availability?.sold_out ?? ticket.sold_out ?? false
  const isFree = availability?.is_free ?? ticket.is_free ?? false
  const price = Number(availability?.price ?? ticket.price ?? 0)
  const currency = availability?.currency ?? ticket.currency ?? ''
  const maxQuantity = Math.max(1, availability?.quantity ?? ticket.quantity ?? 10)
  const total = isFree ? 0 : quantity * price

  const handleIncrement = () => setQuantity((prev) => Math.min(prev + 1, maxQuantity))
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleProceed = async () => {
    try {
      const redirectUrl = window.location.href
      const result = await purchaseTicket({
        ticket_id: ticket.id,
        quantity,
        payment_method: 'stripe',
        auto_renew: false,
        success_url: redirectUrl,
        cancel_url: redirectUrl,
      }).unwrap()

      const redirect = result.data.checkout_url || result.data.url
      if (redirect) {
        window.location.href = redirect
        return
      }

      toast.success(result.message || 'Ticket purchased successfully')
      setPurchasedInstances(result.data.ticket_instances || [])
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.error?.reason || err?.error || 'Purchase failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">{purchasedInstances ? 'Purchased' : 'Payments'}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {purchasedInstances ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h3>
              <p className="text-gray-600 mb-6">
                {purchasedInstances.length} ticket{purchasedInstances.length === 1 ? '' : 's'} purchased for {ticket.name}.
              </p>
              <div className="w-full space-y-4 mb-6">
                {purchasedInstances.map((instance) => (
                  <div key={instance.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                    {instance.qr_code && (
                      <img src={instance.qr_code} alt={`QR code for ${instance.ticket_code}`} className="w-16 h-16 object-contain flex-shrink-0" />
                    )}
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Ticket code</p>
                      <p className="font-mono text-gray-900">{instance.ticket_code}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onClose}
                className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8">select your ticket quantity</p>

              {/* Ticket Selection Card */}
              <div className="rounded-2xl mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 p-[3px]">
                <div className="bg-white px-6 py-4 rounded-[13px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎫</span>
                        <span className="font-semibold text-gray-900">{ticket.name}</span>
                      </div>
                    </div>

                    {!soldOut && (
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors disabled:opacity-40"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
                        <button
                          onClick={handleIncrement}
                          disabled={quantity >= maxQuantity}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                  {soldOut && <p className="text-sm text-red-600 mt-3">This ticket is sold out.</p>}
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
                  <span className="text-gray-900 font-semibold text-xl">{isFree ? 'Free' : `${price} ${currency}`}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-900 font-semibold text-lg">Total:</span>
                  <span className="text-gray-900 font-bold text-2xl">{isFree ? 'Free' : `${total} ${currency}`}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={soldOut || isPurchasing || isCheckingAvailability}
                className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPurchasing ? 'Processing…' : soldOut ? 'Sold out' : 'Proceed to payment'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
