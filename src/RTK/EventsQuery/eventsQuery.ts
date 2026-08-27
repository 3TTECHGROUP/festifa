/* eslint-disable @typescript-eslint/no-explicit-any */
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
  type EventCommentsParams,
  type EventCommentsResponse,
  type CreateCommentRequest,
  type CreateCommentResponse,
  type UpdateCommentRequest,
  type UpdateCommentResponse,
  type EventEngagementRequest,
  type CommentEngagementRequest,
  type EngagementResponse,
  UPDATE_EVENT_PATH,
  type UpdateEventRequest,
  type UpdateEventResponse,
  TRENDING_EVENTS_PATH,
  type TrendingEventsParams,
  type TrendingEventsResponse,
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
    updateEvent: builder.mutation<UpdateEventResponse, UpdateEventRequest>({
      query: ({ id, body }) => ({
        url: `${UPDATE_EVENT_PATH}/${id}`,
        method: 'PATCH',
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
    getEventComments: builder.query<EventCommentsResponse, EventCommentsParams>({
      query: ({ event_id, page, limit }) => ({
        url: `/${event_id}/comments`,
        method: 'GET',
        params: { event_id, page, limit },
      }),
      providesTags: ['Comments'],
    }),
    createComment: builder.mutation<CreateCommentResponse, CreateCommentRequest>({
      query: ({ event_id, content }) => ({
        url: `/comments/${event_id}`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Comments'],
    }),
    updateComment: builder.mutation<UpdateCommentResponse, UpdateCommentRequest>({
      query: ({ comment_id, content }) => ({
        url: `/comments/${comment_id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['Comments'],
    }),
    engageWithEvent: builder.mutation<EngagementResponse, EventEngagementRequest>({
      query: ({ event_id, action_type }) => ({
        url: `/events/${event_id}/engagements`,
        method: 'POST',
        params: { action_type },
      }),
    }),
    engageWithComment: builder.mutation<EngagementResponse, CommentEngagementRequest>({
      query: ({ comment_id, action_type }) => ({
        url: `/comments/${comment_id}/engagements`,
        method: 'POST',
        params: { action_type },
      }),
    }),
    getTrendingEvents: builder.query<TrendingEventsResponse, TrendingEventsParams>({
      query: (params) => ({
        url: TRENDING_EVENTS_PATH,
        method: 'GET',
        params,
      }),
      providesTags: ['Events'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateEventMutation, useUpdateEventMutation, useGetRegisteredEventsQuery, useGetUserEventsQuery, useGetEventsListQuery, useGetEventDetailQuery, useGetEventCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useEngageWithEventMutation, useEngageWithCommentMutation, useGetTrendingEventsQuery } = eventsApi
