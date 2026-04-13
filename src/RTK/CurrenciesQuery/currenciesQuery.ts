import { api } from '@/service/api'
import { GET_CURRENCIES_PATH, type GetCurrenciesResponse } from './endpoint'

export const currenciesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query<GetCurrenciesResponse, void>({
      query: () => ({
        url: GET_CURRENCIES_PATH,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetCurrenciesQuery } = currenciesApi
