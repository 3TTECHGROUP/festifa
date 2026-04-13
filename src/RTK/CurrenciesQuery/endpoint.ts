export const GET_CURRENCIES_PATH = '/currencies'

export type Currency = {
  id: string
  currency: string
  symbol: string
}

export type GetCurrenciesResponse = {
  success: boolean
  message: string
  data: Currency[]
}
