export const GET_CATEGORIES_PATH = '/categories'

export type EventCategory = {
  id: string
  category: string
  priority: number | string
  created_at?: string
}

export type GetCategoriesResponse = {
  success: boolean
  message: string
  data: EventCategory[]
}
