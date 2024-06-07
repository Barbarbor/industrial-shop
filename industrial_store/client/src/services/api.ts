import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategory, ICreateCategory, IUpdateCategory } from '../types/Category.types';
import { IProduct, ICreateProduct, IUpdateProduct, IProductFilters } from '../types/Product.types';
import { ISupply, ICreateSupply, IUpdateSupply, ISupplyFilters, ISuppliesResponse } from '../types/Supply.types';
import { ISupplier, ICreateSupplier, IUpdateSupplier } from '../types/Supplier.types';
import { IManufacturer, ICreateManufacturer, IUpdateManufacturer } from '../types/Manufacturer.types';
import { IBuyer,  ICreateBuyer, IUpdateBuyer } from '../types/Buyer.types';
import { ICreateSeller, ISeller, IUpdateSeller } from '../types/Seller.types';
import {ISale, ICreateSale,IUpdateSale, ISaleResponse, ISaleFilters} from '../types/Sale.types'
import { ICreateSchedule, ISchedule, IScheduleFilters, IUpdateSchedule } from '../types/Schedule.types';
import { ISalary } from '../types/Salary.types';


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/' }),
  tagTypes: ['Product', 'Category', 'Manufacturer', 'Supplier', 'Supply','Buyer','Seller', 'Sale', 'Schedule','Salary'],
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => 'category',
      providesTags: ['Category'],
    }),

    addCategory: builder.mutation<ICategory, ICreateCategory>({
      query: (newCategory) => ({
        url: 'category',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<ICategory, IUpdateCategory>({
      query: ({ id, ...updatedCategory }) => ({
        url: `category/${id}`,
        method: 'PUT',
        body: updatedCategory,
      }),
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
 


    getProducts: builder.query<IProduct[], void>({
      query: () => 'product',
      providesTags: ['Product'],
    }),

    getProductsFiltered: builder.query<IProduct[],IProductFilters >({
        query: (filters) => ({
            url: 'product/filters',
            method: 'POST',
            body: filters,
          }),
        }),
    
    addProduct: builder.mutation<IProduct, ICreateProduct>({
      query: (newProduct) => ({
        url: 'product',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<IProduct, IUpdateProduct>({
      query: ({ id, ...updatedProduct }) => ({
        url: `product/${id}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    


    getSuppliers: builder.query<ISupplier[], void>({
        query: () => 'supplier',
        providesTags: ['Supplier'],
      }),

    addSupplier: builder.mutation<ISupplier, ICreateSupplier>({
      query: (newSupplier) => ({
        url: 'supplier',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),

    updateSupplier: builder.mutation<ISupplier, IUpdateSupplier>({
      query: ({ id, ...updatedSupplier }) => ({
        url: `supplier/${id}`,
        method: 'PUT',
        body: updatedSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),

    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `supplier/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
      


    getSupplies: builder.query<ISuppliesResponse, void>({
      query: () => 'supply',
      providesTags: ['Supply'],
    }),

    addSupply: builder.mutation<ISupply, ICreateSupply>({
      query: (newSupply) => ({
        url: 'supply',
        method: 'POST',
        body: newSupply,
      }),
      invalidatesTags: ['Supply'],
    }),

    updateSupply: builder.mutation<ISupply, IUpdateSupply>({
      query: ({ id, ...updatedSupply }) => ({
        url: `supply/${id}`,
        method: 'PUT',
        body: updatedSupply,
      }),
      invalidatesTags: ['Supply'],
    }),

    deleteSupply: builder.mutation<void, number>({
      query: (id) => ({
        url: `supply/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supply'],
    }),
  
    getReport: builder.query<ISuppliesResponse, ISupplyFilters>({
      query: (filters) => ({
        url: 'supply/report',
        method: 'POST',
        body: filters,
      }),
    }),



    getManufacturers: builder.query<IManufacturer[], void>({
      query: () => 'manufacturer',
      providesTags: ['Manufacturer'],
    }),

    addManufacturer: builder.mutation<IManufacturer,ICreateManufacturer>({
      query: (body) => ({
        url: 'manufacturer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Manufacturer'],
    }),

    updateManufacturer: builder.mutation<IManufacturer, IUpdateManufacturer>({
      query: ({ id, ...updatedManufacturer }) => ({
        url: `manufacturer/${id}`,
        method: 'PUT',
        body: updatedManufacturer,
      }),
      invalidatesTags: ['Manufacturer'],
    }),

    deleteManufacturer: builder.mutation<void, number>({
      query: (id) => ({
        url: `manufacturer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manufacturer'],
    }),



    getBuyers: builder.query<IBuyer[], void>({
      query: () => 'buyer',
      providesTags: ['Buyer'],
    }),

    addBuyer: builder.mutation<IBuyer, ICreateBuyer >({
      query: (buyer) => ({
        url: 'buyer',
        method: 'POST',
        body: buyer,
      }),
      invalidatesTags: ['Buyer'],
    }),

    updateBuyer: builder.mutation<IBuyer,IUpdateBuyer >({
      query: ({ id, ...data }) => ({
        url: `buyer/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Buyer'],
    }),

    deleteBuyer: builder.mutation<void, number>({
      query: (id) => ({
        url: `buyer/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Buyer'],
  }),



    getSellers: builder.query<ISeller[], void>({
      query: () => 'seller',
      providesTags: ['Seller'],
    }),

    addSeller: builder.mutation<ISeller, ICreateSeller>({
      query: (newSeller) => ({
        url: 'seller',
        method: 'POST',
        body: newSeller,
      }),
      invalidatesTags: ['Seller'],
    }),

    updateSeller: builder.mutation<ISeller, IUpdateSeller>({
      query: ({ id, ...updatedSeller }) => ({
        url: `seller/${id}`,
        method: 'PUT',
        body: updatedSeller,
      }),
      invalidatesTags: ['Seller'],
    }),

    deleteSeller: builder.mutation<void, number>({
      query: (id) => ({
        url: `seller/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Seller'],
    }),



    getSales: builder.query<ISaleResponse,void>({
        query: () => '/sale',
        providesTags: ['Sale'],
      }),

    getSalesReport: builder.query<ISaleResponse,ISaleFilters>({
        query: (filters) =>({
            url:'sale/report',
            method: 'POST',
            body: filters,
        })
    }),

    addSale: builder.mutation<ISale,ICreateSale>({
      query: (newSale) => ({
        url: '/sale',
        method: 'POST',
        body: newSale,
      }),
      invalidatesTags: ['Sale'],
    }),

    updateSale: builder.mutation<ISale,IUpdateSale>({
      query: ({ id, ...updatedSale }) => ({
        url: `/sale/${id}`,
        method: 'PUT',
        body: updatedSale,
      }),
      invalidatesTags: ['Sale'],
    }),
    
    deleteSale: builder.mutation<void,number>({
      query: (id) => ({
        url: `/sale/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sale'],
    }),



    getSchedules: builder.query<ISchedule[],void>({
        query: () => '/schedule',
        providesTags: ['Schedule'],
      }),
    getSchedulesFiltered: builder.query<ISchedule[],IScheduleFilters>({
        query: (filters) =>({
            url:'schedule/filters',
            method: 'POST',
            body: filters,
        })
    }),

    addSchedule: builder.mutation<ISchedule,ICreateSchedule>({
      query: (newSchedule) => ({
        url: '/schedule',
        method: 'POST',
        body: newSchedule,
      }),
      invalidatesTags: ['Schedule'],
    }),

    updateSchedule: builder.mutation<ISchedule,IUpdateSchedule>({
      query: ({ id, ...updatedSchedule }) => ({
        url: `/schedule/${id}`,
        method: 'PUT',
        body: updatedSchedule,
      }),
      invalidatesTags: ['Schedule'],
    }),

    deleteSchedule: builder.mutation<void,number>({
      query: (id) => ({
        url: `/schedule/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),

    getSalaries: builder.query<ISalary[],string>({
        query: (month) =>({
            url: '/salary',
            params: { month },
            
        }),
        providesTags:['Salary']
    })
}),



});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetProductsQuery,
  useLazyGetProductsFilteredQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,

  useGetSuppliesQuery,
  useAddSupplyMutation,
  useUpdateSupplyMutation,
  useDeleteSupplyMutation,
  useLazyGetReportQuery,
  
  useGetManufacturersQuery,
  useAddManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,

  useGetBuyersQuery,
  useAddBuyerMutation,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,

  useGetSellersQuery,
  useAddSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,

  useGetSalesQuery,
  useLazyGetSalesReportQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,

  useGetSchedulesQuery,
  useLazyGetSchedulesFilteredQuery,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,

  useGetSalariesQuery,
} = api;
