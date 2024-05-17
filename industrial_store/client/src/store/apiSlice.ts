import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Base URL of your API
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => '/products', // Endpoint for fetching products
    }),
  }),
});

export const { useFetchProductsQuery } = productApi;