export const TICKETS_BASE = '/tickets'

export type TicketAvailabilityParams = {
  ticket_id: string
}

export type TicketAvailability = {
  id: string
  event_id: string
  name: string
  description?: string
  price?: number
  quantity?: number
  currency?: string
  is_free?: boolean
  is_predefined?: boolean
  sold_out: boolean
}

export type TicketAvailabilityResponse = {
  success: boolean
  message?: string
  data: TicketAvailability
}

export type PurchaseTicketPaymentMethod = 'wallet' | 'stripe'

export type PurchaseTicketRequest = {
  ticket_id: string
  quantity: number
  payment_method: PurchaseTicketPaymentMethod
  auto_renew: boolean
  success_url?: string
  cancel_url?: string
  wallet_id?: string
  wallet_pin?: string
}

export type TicketInstance = {
  id: string
  event_id: string
  ticket_id: string
  ticket_purchase_id: string
  ticket_code: string
  qr_code: string
  status: 'used' | 'active' | 'cancelled' | 'expired'
  created_at: string
  updated_at: string
}

// The purchase response shape differs by payment_method (wallet settles
// immediately; stripe may hand back a hosted checkout URL to redirect to) —
// fields from both variants are modeled as optional here rather than as a
// discriminated union, since the backend doesn't tag which variant it sent.
export type PurchaseTicketResponseData = {
  id?: string
  payment_status?: string
  transaction_id?: string
  quantity?: number
  unit_price?: number
  total_amount?: number
  ticket_instances: TicketInstance[]
  checkout_url?: string
  url?: string
}

export type PurchaseTicketResponse = {
  success: boolean
  message?: string
  data: PurchaseTicketResponseData
}
