import React, { useState } from 'react';
import {
  useLazyGetSalesReportQuery,
  useGetSalesQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useGetProductsQuery,
  useGetBuyersQuery,
  useGetSellersQuery,
} from '../../services/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import useFilters from '../../hooks/useFilters'; // Adjust the import path as needed
import { ISaleResponse, ISaleFilters } from '../../types/Sale.types';

interface ISaleInput {
  saleDate: string;
  buyerId: number;
  sellerId: number;
  quantity: number;
  productId: number;
}

interface IReportFilters {
  startDate?: string;
  endDate?: string;
  buyerId?: number;
  sellerId?: number;
  productId?: number;
}

const SalePage: React.FC = () => {
  const { data: salesData, isLoading, isError, error } = useGetSalesQuery();
  const { data: products } = useGetProductsQuery();
  const { data: buyers } = useGetBuyersQuery();
  const { data: sellers } = useGetSellersQuery();
  const [addSale] = useAddSaleMutation();
  const [updateSale] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();

  const initialFilters: ISaleFilters = {
    startDate: undefined,
    endDate: undefined,
    buyerId: undefined,
    sellerId: undefined,
    productId: undefined,
  };

  const { filters: reportFilters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISaleResponse, IReportFilters>(
    useLazyGetSalesReportQuery,
    initialFilters
  );

  const sales = reportData?.sales || salesData?.sales || [];
  const totalRevenue = reportData?.totalRevenue || salesData?.totalRevenue || 0;
  const totalQuantity = reportData?.totalQuantity || salesData?.totalQuantity || 0;
  const { register, handleSubmit, reset, setValue, getValues} = useForm<ISaleInput>();
  const [editSaleId, setEditSaleId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<ISaleInput> = async (data) => {
    if (editSaleId !== null) {
      await updateSale({ id: editSaleId, ...data }).unwrap();
      setEditSaleId(null);
    } else {
      await addSale(data).unwrap();
    }
    reset();
  };

  const handleEdit = (sale: any) => {
    setEditSaleId(sale.id);
    setValue('saleDate', sale.saleDate.split('T')[0]); // Assuming date is in ISO format
    setValue('buyerId', sale.buyerId);
    setValue('sellerId', sale.sellerId);
    setValue('productId', sale.productId);
    setValue('quantity', sale.quantity);
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    {
      field: 'saleDate',
      headerName: 'Sale Date',
      width: 200,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB');
      },
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      width: 150,
      valueGetter: (params) => `${params.row.buyer.name} ${params.row.buyer.surname}`,
    },
    {
      field: 'seller',
      headerName: 'Seller',
      width: 150,
      valueGetter: (params) => `${params.row.seller.name} ${params.row.seller.surname}`,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      valueGetter: (params) => params.row.quantity || 0,
    },
    {
      field: 'item',
      headerName: 'Item',
      width: 150,
      valueGetter: (params) => params.row.product.name || '',
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
        Sales Management
      </Typography>
      <Typography variant="h6">
    Total Revenue: { totalRevenue }
  </Typography>
  <Typography variant="h6">
    Total Quantity: {totalQuantity}
  </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('saleDate', { required: true })}
          type="date"
          variant="outlined"
          placeholder="Sale Date"
          sx={{ marginRight: 2 }}
        />
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Buyer</InputLabel>
          <Select
            {...register('buyerId', { required: true })}
            label="Buyer"
          >
            {buyers?.map((buyer) => (
              <MenuItem key={buyer.id} value={buyer.id}>
                {buyer.name} {buyer.surname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Seller</InputLabel>
          <Select
            {...register('sellerId', { required: true })}
            label="Seller"
          >
            {sellers?.map((seller) => (
              <MenuItem key={seller.id} value={seller.id}>
                {seller.name} {seller.surname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Product</InputLabel>
          <Select
            {...register('productId', { required: true })}
            label="Product"
          >
            {products?.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          {...register('quantity', { required: true })}
          type="number"
          variant="outlined"
          placeholder="Quantity"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editSaleId ? 'Update' : 'Add'} Sale
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
          variant="outlined"
          value={reportFilters.startDate || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="endDate"
          label="End Date"
          type="date"
          variant="outlined"
          value={reportFilters.endDate || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Buyer</InputLabel>
          <Select
            name="buyerId"
            value={reportFilters.buyerId || ''}
            onChange={handleFilterChange}
           
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {buyers?.map((buyer) => (
              <MenuItem key={buyer.id} value={buyer.id}>
                {buyer.name} {buyer.surname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Seller</InputLabel>
          <Select
            name="sellerId"
            value={reportFilters.sellerId || ''}
            onChange={handleFilterChange}
            
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sellers?.map((seller) => (
              <MenuItem key={seller.id} value={seller.id}>
                {seller.name} {seller.surname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ marginRight: 2, minWidth: 120 }}>
          <InputLabel>Product</InputLabel>
          <Select
            name="productId"
            value={reportFilters.productId || ''}
            onChange={handleFilterChange}
            
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {products?.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
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
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={sales || []}
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

export default SalePage;
