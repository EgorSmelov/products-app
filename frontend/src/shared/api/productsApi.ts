import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQueryWithReauth'

export type SortOrder = 'asc' | 'desc'

export interface GetProductsParams {
  limit?: number
  skip?: number
  search?: string
  sortBy?: string
  order?: SortOrder
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  category: string
  thumbnail: string
  images: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => {
        const basePath = params?.search ? '/products/search' : '/products'
        const url = new URL(basePath, 'https://dummyjson.com')

        if (params) {
          const { limit, skip, search, sortBy, order } = params

          if (typeof limit === 'number') {
            url.searchParams.set('limit', limit.toString())
          }

          if (typeof skip === 'number') {
            url.searchParams.set('skip', skip.toString())
          }

          if (search) {
            url.searchParams.set('q', search)
          }

          if (sortBy) {
            url.searchParams.set('sortBy', sortBy)
          }

          if (order) {
            url.searchParams.set('order', order)
          }
        }

        return {
          url: `${url.pathname}${url.search}`,
          method: 'GET',
        }
      },
    }),
  }),
})

export const { useGetProductsQuery } = productsApi

