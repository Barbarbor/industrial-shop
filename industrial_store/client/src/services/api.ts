import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategory, ICreateCategory, IUpdateCategory } from '../types/Category.types';
import { IProduct, ICreateProduct, IUpdateProduct, IProductFilters } from '../types/Product.types';
import { ISupply, ICreateSupply, IUpdateSupply } from '../types/Supply.types';
import { ISupplier, ICreateSupplier, IUpdateSupplier } from '../types/Supplier.types';
import { ISupplyItem, ICreateSupplyItem, IUpdateSupplyItem } from '../types/SupplyItem.types';
import { IManufacturer } from '../types/Manufacturer.types';
import { IBuyer,  ICreateBuyer } from '../types/Buyer.types';
import { ICreateSeller, ISeller, IUpdateSeller } from '../types/Seller.types';
import {ISale, ICreateSale,IUpdateSale, ISaleResponse, ISaleFilters} from '../types/Sale.types'
import { ICreateSchedule, ISchedule, IScheduleFilters, IUpdateSchedule } from '../types/Schedule.types';
import { ISalary } from '../types/Salary.types';
interface IReportFilters {
    startDate?: string;
    endDate?: string;
    productId?: number;
    categoryId?: number;
    manufacturerId?: number;
    supplierId?: number;
  }
export interface ISuppliesResponse {
    supplies: ISupply[];
    totalQuantity: number;
    totalAmount: number;
  }
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
      query: ({ id, name }) => ({
        url: `category/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    // Product endpoints
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
    getProductsByCategory: builder.query<IProduct[], number>({
        query: (categoryId) => `product/category/${categoryId}`,
        providesTags: ['Product'],
      }),
      getProductsByName: builder.query<IProduct[], string>({
        query: (name) => `product/search?name=${name}`,
        providesTags: ['Product'],
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
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    // Supplier endpoints
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
        query: ({ id, name }) => ({
          url: `supplier/${id}`,
          method: 'PUT',
          body: { name },
        }),
        invalidatesTags: ['Supplier'],
      }),
      deleteSupplier: builder.mutation<{ success: boolean }, number>({
        query: (id) => ({
          url: `supplier/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Supplier'],
      }),
      // Supply endpoints
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
      deleteSupply: builder.mutation<{ success: boolean }, number>({
        query: (id) => ({
          url: `supply/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Supply'],
      }),
      getReport: builder.query<ISuppliesResponse, IReportFilters>({
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
    addManufacturer: builder.mutation<IManufacturer, Partial<IManufacturer>>({
      query: (body) => ({
        url: 'manufacturer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Manufacturer'],
    }),
    updateManufacturer: builder.mutation<void, { id: number; name: string }>({
      query: ({ id, ...patch }) => ({
        url: `manufacturer/${id}`,
        method: 'PUT',
        body: patch,
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
      updateBuyer: builder.mutation<IBuyer,IBuyer >({
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
  deleteSeller: builder.mutation<{ message: string }, number>({
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
    query: (newSale) => ({
      url: '/schedule',
      method: 'POST',
      body: newSale,
    }),
    invalidatesTags: ['Schedule'],
  }),
  updateSchedule: builder.mutation<ISchedule,IUpdateSchedule>({
    query: ({ id, ...updatedSale }) => ({
      url: `/schedule/${id}`,
      method: 'PUT',
      body: updatedSale,
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
  useGetProductsByCategoryQuery,
  useGetProductsByNameQuery,
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
