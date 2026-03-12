import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const token =
    window.localStorage.getItem('token') ?? window.sessionStorage.getItem('token')

  return token
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://dummyjson.com',
  prepareHeaders: (headers) => {
    const token = getToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')

    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  // Здесь можно добавить логику обновления токена при 401, если появится рефреш-эндпоинт.

  return result
}

