import { api } from '@/service/api'
import {
  CREATE_EVENT_PATH,
  type CreateEventRequest,
  type CreateEventResponse,
  REGISTERED_EVENTS_PATH,
  type RegisteredEventsParams,
  type RegisteredEventsResponse,
  USER_EVENTS_PATH,
  type UserEventsParams,
  type UserEventsResponse,
  EVENTS_LIST_PATH,
  type EventsListParams,
  type EventsListResponse,
  EVENT_DETAIL_BASE,
  type EventDetailParams,
  type EventDetailResponse,
} from './endpoint'

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
    getRegisteredEvents: builder.query<RegisteredEventsResponse, RegisteredEventsParams>({
      query: (params) => ({
        url: REGISTERED_EVENTS_PATH,
        method: 'GET',
        params,
      }),
      providesTags: ['Events'],
    }),
    getUserEvents: builder.query<UserEventsResponse, UserEventsParams>({
      query: (params) => ({
        url: USER_EVENTS_PATH,
        method: 'GET',
        params,
      }),
      providesTags: ['Events'],
    }),
    getEventsList: builder.query<EventsListResponse, EventsListParams | undefined>({
      query: (params) => ({
        url: EVENTS_LIST_PATH,
        method: 'GET',
        params: (params ?? undefined) as Record<string, any> | undefined,
      }),
      providesTags: ['Events'],
    }),
    getEventDetail: builder.query<EventDetailResponse, EventDetailParams>({
      query: ({ id }) => ({
        url: `${EVENT_DETAIL_BASE}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Events'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateEventMutation, useGetRegisteredEventsQuery, useGetUserEventsQuery, useGetEventsListQuery, useGetEventDetailQuery } = eventsApi
