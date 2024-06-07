import React, { useState } from 'react';
import { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetCategoriesQuery, useGetManufacturersQuery, useLazyGetProductsFilteredQuery } from '../../services/api';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import CustomFilters from '../shared/CustomFiltersForm';
import { GridColDef } from '@mui/x-data-grid';
import { IProduct, IProductFilters } from '../../types/Product.types';
import { Box, Typography } from '@mui/material';
import useFilters from '../../hooks/useFilters';

const ProductPage: React.FC = () => {
  const { data: productsData, isLoading, isError, error } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: manufacturers } = useGetManufacturersQuery();

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const initialFilters: IProductFilters = { 
    categoryId: undefined, 
    manufacturerId: undefined, 
    name: undefined 
  };
  const { filters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<IProduct[], IProductFilters>(useLazyGetProductsFilteredQuery, initialFilters);
  
  const textFields=[
    { name: 'name', required: true, inputLabel: 'Name', placeholder:'Name' },
    { name: 'price', required: true, inputLabel: 'Price', placeholder:'Price', type: 'number' },
    { name: 'stock', required: true, inputLabel: 'Stock', placeholder:'Stock', type: 'number' }, 
  ]

  const selectFields=[
    {name:'categoryId', inputLabel:'Category', required:true, data:categories || []},
    {name: 'manufacturerId', inputLabel: 'Manufacturer', required: true, data: manufacturers || []}
  ]

  const filterTextFields=[
    { name: 'name', inputLabel: 'Name', placeholder:'Name' },
  ]

  const filterSelectFields=[
    {name:'categoryId', inputLabel:'Category', data:categories || []},
    {name: 'manufacturerId', inputLabel:'Manufacturer', data:manufacturers || []}
  ]

  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<IProduct | null>(null);

  const onSubmit = async (data) => {
    if (editProductId !== null) {
      await updateProduct({ id: editProductId, ...data });
      setEditProductId(null);
      setEditProductData(null);
    } else {
      await addProduct(data);
      setEditProductData(null)
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditProductId(product.id);
    setEditProductData(product);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    if ('status' in error) {
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
      return (
        <div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      );
    }
    return <div>{error.message}</div>;
  }


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
        field: 'categoryId',
        headerName: 'Category',
        width: 150,
        valueGetter: (params) => categories?.find((category) => category.id === params.value)?.name || '',
      },
      {
        field: 'manufacturerId',
        headerName: 'Manufacturer',
        width: 150,
        valueGetter: (params) => manufacturers?.find((manufacturer) => manufacturer.id === params.value)?.name || '',
      },
    ]

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Product Management</Typography>
      <CustomForm<IProduct>
       formName='product'
       onSubmit={onSubmit}
       textFields={textFields}
       selectFields={selectFields}
       editId={editProductId}
       initialData={editProductData}
      />
      <CustomFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        filterTextFields={filterTextFields} 
        filterSelectFields={filterSelectFields }
      />
      <CustomTable<IProduct>
      rows={reportData || productsData || []}
      columns={columns}
      onEdit={handleEdit}
      onDelete={handleDelete}
      />
    </Box>
  );
};

export default ProductPage;
