import { api } from '@/service/api'
import {
  TICKETS_BASE,
  type TicketAvailabilityParams,
  type TicketAvailabilityResponse,
  type PurchaseTicketRequest,
  type PurchaseTicketResponse,
} from './endpoint'

export const ticketsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicketAvailability: builder.query<TicketAvailabilityResponse, TicketAvailabilityParams>({
      query: ({ ticket_id }) => ({
        url: `${TICKETS_BASE}/${ticket_id}/availability`,
        method: 'GET',
      }),
      providesTags: ['Tickets'],
    }),
    purchaseTicket: builder.mutation<PurchaseTicketResponse, PurchaseTicketRequest>({
      query: ({ ticket_id, ...body }) => ({
        url: `${TICKETS_BASE}/${ticket_id}/purchase`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tickets', 'Events'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTicketAvailabilityQuery,
  useLazyGetTicketAvailabilityQuery,
  usePurchaseTicketMutation,
} = ticketsApi
