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
