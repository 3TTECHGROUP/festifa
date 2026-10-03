export const REGISTRATIONS_BASE = '/registrations'

export type CanEnterParams = {
  event_id: string
}

export type CanEnterResponse = {
  success: boolean
  message?: string
  data: {
    can_enter: boolean
    reason: string | null
    registration_id: string | null
  }
}

export type CompleteFormRequest = {
  registration_id: string
}

export type CompleteFormResponse = {
  success: boolean
  message?: string
  data: {
    id: string
    status: string
    is_form_incomplete: boolean
    form_completed_at: string | null
    created_at: string
  }
}
