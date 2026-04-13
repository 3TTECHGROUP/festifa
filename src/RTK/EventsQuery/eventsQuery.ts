import { api } from '@/service/api'
import { CREATE_EVENT_PATH, type CreateEventRequest, type CreateEventResponse } from './endpoint'

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<CreateEventResponse, CreateEventRequest>({
      query: (body) => ({
        url: CREATE_EVENT_PATH,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateEventMutation } = eventsApi
