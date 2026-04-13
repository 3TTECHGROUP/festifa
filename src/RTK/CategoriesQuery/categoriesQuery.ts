import { api } from '@/service/api'
import { GET_CATEGORIES_PATH, type GetCategoriesResponse } from './endpoint'

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<GetCategoriesResponse, void>({
      query: () => ({
        url: GET_CATEGORIES_PATH,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetCategoriesQuery } = categoriesApi
