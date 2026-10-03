import { api } from '@/service/api'
import {
  REGISTRATIONS_BASE,
  type CanEnterParams,
  type CanEnterResponse,
  type CompleteFormRequest,
  type CompleteFormResponse,
} from './endpoint'

export const registrationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkEventAccess: builder.query<CanEnterResponse, CanEnterParams>({
      query: ({ event_id }) => ({
        url: `${REGISTRATIONS_BASE}/events/${event_id}/can-enter`,
        method: 'GET',
      }),
      providesTags: ['Registrations'],
    }),
    completeRegistrationForm: builder.mutation<CompleteFormResponse, CompleteFormRequest>({
      query: ({ registration_id }) => ({
        url: `${REGISTRATIONS_BASE}/${registration_id}/complete-form`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Registrations'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCheckEventAccessQuery,
  useLazyCheckEventAccessQuery,
  useCompleteRegistrationFormMutation,
} = registrationsApi
