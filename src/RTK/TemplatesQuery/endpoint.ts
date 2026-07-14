export const GET_TEMPLATES_PATH = '/templates'
export const GET_TEMPLATE_BY_ID_PATH = (id: string) => `/templates/${id}`
export const GET_TEMPLATE_PROPS_PATH = (id: string) => `/templates/${id}/props`

export type TemplatePrice = {
  id: string
  template_id: string
  currency_id?: string
  currency: string
  amount?: number | string
  price?: number | string
  value?: number | string
  template?: string
}

export type TemplateProps = {
  id: string
  template_id: string
  prop_name: string
  is_required: boolean
  template?: string
}

export type Template = {
  host: string
  id: string
  category_id?: string
  category?: string
  title: string
  description?: string
  media_url: string
  priority?: number
  type?: string
  prices: TemplatePrice[]
  props?: TemplateProps[]
}

export type GetTemplatesParams = {
  q?: string
  category?: string
  page?: number
  limit?: number
}

export type GetTemplatesResponse = {
  success: boolean
  message: string
  data: Template[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type GetTemplateByIdResponse = {
  success: boolean
  message: string
  data: Template
}

// Template props mapping for event-specific values
export type TemplatePropResponse = {
  id: string
  template_prop_id: string
  event_id: string
  prop_response: string
}

export type GetTemplatePropsResponse = {
  success: boolean
  message: string
  data: TemplateProps[]
}
