/* eslint-disable @typescript-eslint/no-explicit-any */
export const CREATE_EVENT_PATH = '/events'

export type CreateEventSessionRequest = {
  name: string
  date?: string
  timezone: string
  start_time: string
  end_time: string
}

export type CreateEventTicketRequest = {
  currency_id: string
  name: string
  description: string
  price: number
  quantity: number
  is_free: boolean
  is_predefined: boolean
}

export type CreateEventTemplatePropResponseRequest = {
  template_prop_id: string
  prop_response: string
}

export type CreateEventFormFieldRequest = {
  field_label: string
  field_type: string
  is_required: boolean
  options: string[]
}

export type CreateEventFormRequest = {
  form_fields: CreateEventFormFieldRequest[]
}

export type CreateEventRequest = {
  title: string
  description: string
  host: string
  category_id?: string
  location: string
  city: string
  country: string
  latitude?: number
  longitude?: number
  media_url?: string
  template_id?: string
  start_date?: string
  end_date?: string
  is_all_day_event: boolean
  is_ticketing_enabled: boolean
  is_free_event: boolean
  is_multimedia_enabled: boolean
  is_engagement_enabled: boolean
  is_multi_day_event: boolean
  is_form_enabled: boolean
  is_virtual: boolean
  sessions: CreateEventSessionRequest[]
  tickets: CreateEventTicketRequest[]
  template_props_responses: CreateEventTemplatePropResponseRequest[]
  form?: CreateEventFormRequest
}

export type CreateEventResponse = {
  success?: boolean
  message?: string
  data?: any
}

// Registered Events (Upcoming/Past) endpoint and types
export const REGISTERED_EVENTS_PATH = '/events/registered-events'

export type RegisteredEventsFilter = 'upcoming' | 'past'

export type RegisteredEventsParams = {
  page?: number
  limit?: number
  filter: RegisteredEventsFilter
}

export type RegisteredEventsPagination = {
  current_page: number
  limit: number
  has_next_page: boolean
  has_prev_page: boolean
}

export type RegisteredEventItem = {
  id: string
  user_id?: string
  category_id?: string
  host?: string
  title: string
  description?: string
  location?: string
  media_url?: string
  start_date?: string
  end_date?: string
  is_virtual?: boolean
  has_liked?: boolean
  is_all_day_event?: boolean
  is_ticketing_enabled?: boolean
  is_free_event?: boolean
  is_multimedia_enabled?: boolean
  is_engagement_enabled?: boolean
  is_form_enabled?: boolean
  comment_count?: number
  view_count?: number
  like_count?: number
  created_at?: string
  user?: { name?: string }
  category?: { id: string; category: string; priority?: number }
  sessions?: Array<{
    id: string
    name: string
    date?: string
    timezone?: string
    start_time?: string
    end_time?: string
  }>
  tickets?: Array<{
    id: string
    event_id: string
    currency_id: string
    currency?: string
    event?: string
    name: string
    description?: string
    price?: number
    quantity?: number
    is_free?: boolean
    is_predefined?: boolean
  }>
  registrations?: any[]
  form?: any
}

export type RegisteredEventsResponse = {
  success: boolean
  message: string
  pagination: RegisteredEventsPagination
  data: RegisteredEventItem[]
}

// User Events ("My events") endpoint and types
export const USER_EVENTS_PATH = '/events/user-events'

export type UserEventsParams = {
  page?: number
  limit?: number
}

export type UserEventsResponse = RegisteredEventsResponse

// Public Events list endpoint and types
export const EVENTS_LIST_PATH = '/events'

export type EventsListParams = {
  page?: number
  limit?: number
  category_id?: string
  q?: string
  date_range?: string
  distance?: number
  latitude?: number
  longitude?: number
  event_type?: string
}

export type EventsListResponse = {
  success: boolean
  message: string
  pagination?: RegisteredEventsPagination
  data: RegisteredEventItem[]
}

// Event detail endpoint and types
export const EVENT_DETAIL_BASE = '/events'

export type EventDetailParams = {
  id: string | number
}

export type EventDetailResponse = {
  success: boolean
  message: string
  data: RegisteredEventItem
}
