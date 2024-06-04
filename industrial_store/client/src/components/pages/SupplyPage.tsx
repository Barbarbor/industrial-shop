import React, {useEffect, useState} from 'react';
import {
  useLazyGetReportQuery,
  useGetCategoriesQuery,
  useGetManufacturersQuery,
  useGetSuppliersQuery,
  useGetProductsQuery,
  useAddSupplyMutation,
  useDeleteSupplyMutation,
  useUpdateSupplyMutation,
  ISuppliesResponse,
  useGetSuppliesQuery
} from '../../services/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import VirtualizedAutocomplete from '../shared/VirtualizedAutocomplete';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import useFilters from '../../hooks/useFilters'; // Adjust the import path as needed
import { ISupply } from '../../types/Supply.types';
import { IProduct } from '../../types/Product.types';

export interface IFormInput {
  productId: number;
  supplierId: number;
  amount: number;
  quantity: number;
  deliveredAt: string;
}

interface IReportFilters {
  startDate?: string;
  endDate?: string;
  productId?: number;
  categoryId?: number;
  manufacturerId?: number;
  supplierId?: number;
}

const SupplyPage: React.FC = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: manufacturers } = useGetManufacturersQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const { data: products,isLoading: loadingProducts } = useGetProductsQuery();
  const {data: suppliesData} = useGetSuppliesQuery()
  const [addSupply] = useAddSupplyMutation();
  const [updateSupply] = useUpdateSupplyMutation();
  const [deleteSupply] = useDeleteSupplyMutation();

  const initialFilters: IReportFilters = {
    startDate: undefined,
    endDate: undefined,
    productId: undefined,
    categoryId: undefined,
    manufacturerId: undefined,
    supplierId: undefined,
  };

  const { filters:reportFilters,reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISuppliesResponse,IReportFilters>(
    useLazyGetReportQuery,
    initialFilters
  );

  const supplies = reportData?.supplies || suppliesData?.supplies;
  const totalQuantity = reportData?.totalQuantity || 0;
  const totalAmount = reportData?.totalAmount || 0;

  const { register, handleSubmit, reset, setValue, getValues } = useForm<IFormInput>();

  const [editSupplyId, setEditSupplyId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editSupplyId !== null) {
      await updateSupply({ id: editSupplyId, ...data }).unwrap();
      setEditSupplyId(null);
    } else {
      await addSupply(data).unwrap();
    }
    reset();
  };

  const handleEdit = (supply: ISupply) => {
    setEditSupplyId(supply.id);
    setValue('productId', supply.productId);
    setValue('supplierId', supply.supplierId);
    setValue('amount', supply.amount);
    setValue('quantity', supply.quantity);
    setValue('deliveredAt', supply.deliveredAt.split('T')[0]);
  };

  const handleDelete = async (id: number) => {
    await deleteSupply(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'productId',
      headerName: 'Product',
      width: 150,
      valueGetter: (params) => {
        const product = products?.find((p) => p.id === params.value);
        return product ? product.name : 'Unknown';
      },
    },
    {
      field: 'supplierId',
      headerName: 'Supplier',
      width: 150,
      valueGetter: (params) => {
        const supplier = suppliers?.find((s) => s.id === params.value);
        return supplier ? supplier.name : 'Unknown';
      },
    },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'deliveredAt',
      headerName: 'Delivered At',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB');
      },
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

  // Async loading for products in AutoComplete
  const [open, setOpen] = useState(false);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loading = open && productOptions.length === 0;

  useEffect(() => {
    let active = true;
    if (!loading) return undefined;

    (async () => {
      if (products && active) {
        setProductOptions(products.slice(0, 100));
      }
    })();

    return () => { active = false; };
  }, [loading, products]);

  useEffect(() => {
    if (!open) {
      setProductOptions([]);
      setPage(1);
    }
  }, [open]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supply Management
      </Typography>
      <Typography variant="h6">
        Total Quantity: {suppliesData?.totalQuantity || 0}
      </Typography>
      <Typography variant="h6">
        Total Amount: {suppliesData?.totalAmount || 0}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 4 }}
      >
         <VirtualizedAutocomplete
          options={products || []}
          loading={loadingProducts}
          label="Product"
          onChange={(event, newValue) => setValue('productId', newValue?.id)}
          value={products?.find((p) => p.id === Number(getValues('productId')))}
          getOptionLabel={(option) => option.name}  // Add this line
        />
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Supplier</InputLabel>
          <Select
            {...register('supplierId', { required: true })}
            defaultValue=""
          >
            {suppliers &&
              suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          {...register('amount', { required: true })}
          label="Amount"
          type="number"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('quantity', { required: true })}
          label="Quantity"
          type="number"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('deliveredAt', { required: true })}
          type="date"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editSupplyId ? 'Update' : 'Add'} Supply
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
        
         <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={reportFilters.startDate || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={reportFilters.endDate || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
      <VirtualizedAutocomplete
  options={products || []}
  loading={loadingProducts}
  label="Product"
  onChange={(event, newValue) => handleFilterChange({
    target: { name: 'productId', value: newValue ? newValue.id : '' }
  } as unknown as React.ChangeEvent<HTMLInputElement>)}
  value={products?.find((p) => p.id === reportFilters.productId) || null}
  getOptionLabel={(option) => option.name}
/>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={reportFilters.categoryId || ''}
            onChange={handleFilterChange}
          >
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
          >
            {manufacturers &&
              manufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Supplier</InputLabel>
          <Select
            name="supplierId"
            value={reportFilters.supplierId || ''}
            onChange={handleFilterChange}
          >
            {suppliers &&
              suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={applyFilters} sx={{ marginRight: 2 }}>
          Apply Filters
        </Button>
        <Button variant="contained" color="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Supply Table
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
          rows={supplies || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SupplyPage;
