/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '@/service/api'
import {
  GET_TEMPLATES_PATH,
  GET_TEMPLATE_BY_ID_PATH,
  GET_TEMPLATE_PROPS_PATH,
  type GetTemplatesParams,
  type GetTemplatesResponse,
  type GetTemplateByIdResponse,
  type GetTemplatePropsResponse
} from './endpoint'

export const templatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<GetTemplatesResponse, GetTemplatesParams | undefined>({
      query: (params) => ({
        url: GET_TEMPLATES_PATH,
        method: 'GET',
        params: (params ?? undefined) as Record<string, unknown> | undefined,
      }),
      providesTags: ['Templates'],
    }),
    getTemplateById: builder.query<GetTemplateByIdResponse, string>({
      query: (id) => ({ url: GET_TEMPLATE_BY_ID_PATH(id) }),
    }),
    getTemplateProps: builder.query<GetTemplatePropsResponse, string>({
      query: (id) => ({ url: GET_TEMPLATE_PROPS_PATH(id) }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetTemplatesQuery, useGetTemplateByIdQuery, useGetTemplatePropsQuery } = templatesApi
