import React, { useState, lazy, Suspense } from 'react';
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetManufacturersQuery,
  useLazyGetProductsFilteredQuery,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import useFilters from '@/hooks/useFilters';
import { IProduct, IProductFilters } from '@/types/Product.types';
import { getName } from '@/utils/utils';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));
const CustomFilters = lazy(() => import('@/components/shared/CustomFilters'));

const ProductPage: React.FC = () => {
  const { data: productsData, isLoading,  } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: manufacturers } = useGetManufacturersQuery();

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const initialFilters: IProductFilters = {
    categoryId: undefined,
    manufacturerId: undefined,
    name: undefined,
  };

  const { filters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<IProduct[], IProductFilters>(
    useLazyGetProductsFilteredQuery,
    initialFilters
  );

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Название', placeholder: 'Название' },
    { name: 'price', required: true, inputLabel: 'Цена', placeholder: 'Цена', type: 'number' },
    { name: 'stock', required: true, inputLabel: 'Запас', placeholder: 'Запас', type: 'number' },
  ];

  const selectFields = [
    { name: 'categoryId', inputLabel: 'Категория', required: true, data: categories || [] },
    { name: 'manufacturerId', inputLabel: 'Производитель', required: true, data: manufacturers || [] },
  ];

  const filterTextFields = [
    { name: 'name', inputLabel: 'Название', placeholder: 'Название' },
  ];

  const filterSelectFields = [
    { name: 'categoryId', inputLabel: 'Категория', data: categories || [] },
    { name: 'manufacturerId', inputLabel: 'Производитель', data: manufacturers || [] },
  ];

  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<IProduct | null>(null);

  const onSubmit = async (data) => {
    if (editProductId !== null) {
      await updateProduct({ id: editProductId, ...data });
      setEditProductId(null);
      setEditProductData(null);
    } else {
      await addProduct(data);
      setEditProductData(null);
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditProductId(product.id);
    setEditProductData(product);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 300 },
    { field: 'price', headerName: 'Цена', width: 200, valueFormatter: (params) => `${params.value}₽` },
    { field: 'stock', headerName: 'Количество товара на складе', width: 250 },
    {
      field: 'categoryId',
      headerName: 'Категория',
      width: 250,
      valueGetter: getName(categories),
    },
    {
      field: 'manufacturerId',
      headerName: 'Производитель',
      width: 150,
      valueGetter: getName(manufacturers),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление товарами
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Товар"
            onSubmit={onSubmit}
            textFields={textFields}
            selectFields={selectFields}
            editId={editProductId}
            initialData={editProductData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка фильтров...</div>}>
          <CustomFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            filterTextFields={filterTextFields}
            filterSelectFields={filterSelectFields}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={reportData || productsData || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default ProductPage;
