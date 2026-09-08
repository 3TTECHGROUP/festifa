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

export type TemplatePropResponse = {
  id?: string
  template_prop_id: string
  event_id?: string
  prop_response: string
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
  is_multi_day_event?: boolean
  is_ticketing_enabled?: boolean
  is_free_event?: boolean
  is_multimedia_enabled?: boolean
  is_engagement_enabled?: boolean
  is_form_enabled?: boolean
  template_id?: string
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
  template_prop_responses?: TemplatePropResponse[]
  similar_events?: RegisteredEventItem[]
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

// Update Event endpoint and types
export const UPDATE_EVENT_PATH = '/events'

export type UpdateEventRequest = {
  id: string
  body: {
    title?: string
    description?: string
    host?: string
    category_id?: string
    location?: string
    start_date?: string
    end_date?: string
    is_virtual?: boolean
    is_all_day_event?: boolean
    is_multi_day_event?: boolean
    is_free_event?: boolean
    is_ticketing_enabled?: boolean
    is_multimedia_enabled?: boolean
    is_engagement_enabled?: boolean
    is_form_enabled?: boolean
    template_id?: string
    template_prop_responses?: Array<{ prop_name: string; prop_response: string }>
    tickets?: any[]
    sessions?: any[]
  }
}

export type UpdateEventResponse = {
  success: boolean
  message: string
  data?: any
}

// Event Comments endpoint and types
export type EventCommentsParams = {
  event_id: string
  page?: number
  limit?: number
}

export type EventCommentItem = {
  id: string
  event_id?: string
  user_id?: string
  content: string
  like_count?: number
  view_count?: number
  has_liked?: boolean
  created_at?: string
  user?: { name?: string; profile_image?: string }
}

export type EventCommentsPagination = {
  current_page: number | string
  limit: number | string
  has_next_page: boolean
  has_prev_page: boolean
}

export type EventCommentsResponse = {
  success: boolean
  data: EventCommentItem[]
  pagination: EventCommentsPagination
}

export type CreateCommentRequest = {
  event_id: string
  content: string
}

export type CreateCommentResponse = {
  success: boolean
  message?: string
  data?: EventCommentItem
}

export type UpdateCommentRequest = {
  comment_id: string
  content: string
}

export type UpdateCommentResponse = {
  success: boolean
  message?: string
  data?: EventCommentItem
}

export type DeleteCommentRequest = {
  comment_id: string
}

export type DeleteCommentResponse = {
  success: boolean
  message?: string
}

// Engagement (like/unlike) endpoints and types
export type EngagementActionType = 'like' | 'unlike'

export type EventEngagementRequest = {
  event_id: string
  action_type: EngagementActionType
}

export type CommentEngagementRequest = {
  comment_id: string
  action_type: EngagementActionType
}

export type EngagementResponse = {
  success: boolean
  message?: string
  data?: {
    id: string
    event_id?: string
    comment_id?: string
    user_id: string
    type: string
  }
}

// Event Gallery endpoint and types
export const EVENT_GALLERY_BASE = '/events'

export type EventGalleryParams = {
  event_id: string
}

// The gallery API currently returns an empty `data` array for every event, so the
// item fields below are typed permissively: `media_url` follows the naming used by
// the rest of the events API, and the `url`/`media_type` aliases keep the UI working
// if the backend serves a different key once real items exist.
export type EventGalleryItem = {
  id: string
  event_id?: string
  user_id?: string
  media_url?: string
  url?: string
  media_type?: string
  type?: string
  caption?: string
  label?: string
  status?: string
  created_at?: string
  user?: { name?: string; profile_image?: string }
}

export type EventGalleryResponse = {
  success: boolean
  message?: string
  data: EventGalleryItem[]
}

export type CreateGalleryFile = {
  label?: string
  media_type: string
  media_url: string
}

export type CreateGalleryItemRequest = {
  event_id: string
  user_id: string
  files: CreateGalleryFile[]
}

export type CreateGalleryItemResponse = {
  success: boolean
  message?: string
  data?: EventGalleryItem[]
}

// Host-facing gallery moderation: lists every submitted item (any status) for
// review, and lets the host approve/reject each one individually.
export type EventGalleryModerationParams = {
  event_id: string
}

export type EventGalleryModerationResponse = {
  success: boolean
  message?: string
  data: EventGalleryItem[]
}

export type GalleryItemModerationRequest = {
  event_gallery_item_id: string
}

export type GalleryItemModerationResponse = {
  success: boolean
  message?: string
  data?: EventGalleryItem
}

// Trending Events endpoint and types
export const TRENDING_EVENTS_PATH = '/events/trending'

export type TrendingEventsParams = {
  latitude: number
  longitude: number
}

export type TrendingEventsResponse = {
  success: boolean
  message: string
  data: RegisteredEventItem[]
}
