import { api } from '@/service/api'

export const imageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/upload-image',
        method: 'POST',
        body: formData,
        headers: {},
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useUploadImageMutation } = imageApi
