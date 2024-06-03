import React, { useState} from 'react';
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetManufacturersQuery,
 
  useLazyGetProductsFilteredQuery,
} from '../../services/api';

import { IProduct, IProductFilters } from '../../types/Product.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  
} from '@mui/material';
import useFilters from '../../hooks/useFilters';

interface IFormInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturerId: number;
}

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
    name: undefined,
  };
  const { filters: reportFilters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<IProduct[], IProductFilters>(
    useLazyGetProductsFilteredQuery,
    initialFilters
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<number>(0);
  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editProductId, setEditProductId] = useState<number | null>(null);

 
  const products = reportData || productsData;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editProductId !== null) {
      await updateProduct({ id: editProductId, ...data }).unwrap();
      setEditProductId(null);
    } else {
      await addProduct(data).unwrap();
    }
    reset();
  };

  const handleEdit = (product: IProduct) => {
    setEditProductId(product.id);
    setSelectedCategoryId(product.categoryId);
    setSelectedManufacturerId(product.manufacturerId);

    setValue('name', product.name);
    setValue('price', product.price);
    setValue('stock', product.stock);
    setValue('categoryId', product.categoryId);
    setValue('manufacturerId', product.manufacturerId);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id).unwrap();
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCategoryId(event.target.value as number);
  };

  const handleManufacturerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedManufacturerId(event.target.value as number);
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Management

      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          variant="outlined"
          placeholder='Название товара'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('price', { required: true })}
          type="number"
          variant="outlined"
          placeholder='Цена'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('stock', { required: true })}
          type="number"
          variant="outlined"
          placeholder='Запас'
          sx={{ marginRight: 2 }}
        />

        <FormControl  variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
         
          <Select
            {...register('categoryId', { required: true, onChange: (e) =>  handleCategoryChange(e) })}
            value={selectedCategoryId}
            defaultValue={0}
          >
            <MenuItem value={0} disabled>
                Категория
            </MenuItem>
            {categories &&
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 160 }}>
          <Select
            {...register('manufacturerId', { required: true, onChange: (e) => handleManufacturerChange(e) })}
            value={selectedManufacturerId }
            defaultValue={0}
          >
            <MenuItem value={0} disabled>
                Производитель
            </MenuItem>
            {manufacturers &&
              manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {editProductId ? 'Update' : 'Add'} Product
        </Button>
      </Box>
     
      <Typography variant="h5" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          value={reportFilters.name || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={reportFilters.categoryId || ''}
            onChange={handleFilterChange}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories &&
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Manufacturer</InputLabel>
          <Select
            name="manufacturerId"
            value={reportFilters.manufacturerId || ''}
            onChange={handleFilterChange}
            label="Manufacturer"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {manufacturers &&
              manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
          sx={{ marginRight: 2 }}
        >
          Apply Filters
        </Button>
        <Button variant="contained" color="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={products || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
                paginationModel: {
                    pageSize: 9,
                },
            },
        }}
        />
      </Box>
    </Box>
  );
};

export default ProductPage;