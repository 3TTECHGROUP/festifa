export const GET_CATEGORIES_PATH = '/categories'

export type EventCategory = {
  id: string
  category: string
  priority: number
}

export type GetCategoriesResponse = {
  success: boolean
  message: string
  data: EventCategory[]
}
