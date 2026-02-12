import { api } from '@/service/api'
import { 
  GET_TEMPLATES_PATH, 
  GET_TEMPLATE_BY_ID_PATH,
  type GetTemplatesParams, 
  type GetTemplatesResponse,
  type GetTemplateByIdResponse
} from './endpoint'

export const templatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<GetTemplatesResponse, GetTemplatesParams | void>({
      query: (params: GetTemplatesParams | void) => ({
        url: GET_TEMPLATES_PATH,
        // ensure params is never `void` to satisfy FetchArgs typing
        params: (params ?? undefined) as GetTemplatesParams | undefined,
      }),
    }),
    getTemplateById: builder.query<GetTemplateByIdResponse, string>({
      query: (id) => ({ url: GET_TEMPLATE_BY_ID_PATH(id) }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTemplatesQuery, useGetTemplateByIdQuery } = templatesApi
