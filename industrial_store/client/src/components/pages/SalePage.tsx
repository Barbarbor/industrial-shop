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
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import CustomFilters from '../shared/CustomFiltersForm';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import useFilters from '../../hooks/useFilters';
import { ISaleResponse, ISaleFilters, ISale } from '../../types/Sale.types';

const SalePage: React.FC = () => {
  const { data: salesData, isLoading, isError, error } = useGetSalesQuery();
  const { data: products ,isLoading:loadingProducts } = useGetProductsQuery();
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

  const { filters: reportFilters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISaleResponse, ISaleFilters>(
    useLazyGetSalesReportQuery,
    initialFilters
  );

  const sales = reportData?.sales || salesData?.sales || [];
  const totalRevenue = reportData?.totalRevenue || salesData?.totalRevenue || 0;
  const totalQuantity = reportData?.totalQuantity || salesData?.totalQuantity || 0;

  const textFields = [
    { name: 'saleDate', required: true, inputLabel: 'Sale Date', type: 'date' },
    { name: 'quantity', required: true, inputLabel: 'Quantity', placeholder:'Quantity', type: 'number'}
  ];

  const selectFields = [
    { name: 'buyerId', inputLabel: 'Buyer', required: true, data: buyers || [] },
    { name: 'sellerId', inputLabel: 'Seller', required: true, data: sellers || [] },
    
  ];

  const virtualAutocompleteFields= [
    {
      name: 'productId',
      options: products || [],
      loading: loadingProducts,
      label: 'Product',
      getOptionLabel: (option) => option.name,
    }]
  const filterTextFields = [
    { name: 'startDate', inputLabel: 'Start Date', type: 'date' },
    { name: 'endDate', inputLabel: 'End Date', type: 'date' }
  ];

  const filterSelectFields = [
    { name: 'buyerId', inputLabel: 'Buyer', data: buyers || [] },
    { name: 'sellerId', inputLabel: 'Seller', data: sellers || [] },
    
  ];

  const [editSaleId, setEditSaleId] = useState<number | null>(null);
  const [editSaleData, setEditSaleData] = useState<any | null>(null);

  const onSubmit = async (data) => {
    if (editSaleId !== null) {
      await updateSale({ id: editSaleId, ...data }).unwrap();
      setEditSaleId(null);
      setEditSaleData(null);
    } else {
      await addSale(data).unwrap();
      setEditSaleData(null);
    }
  };

  const handleEdit = (sale: any) => {
    setEditSaleId(sale.id);
    setEditSaleData({
      ...sale,
      saleDate: new Date(sale.saleDate).toISOString().substring(0, 10), // Ensure date is properly formatted
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id).unwrap();
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
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales Management
      </Typography>
      <Typography variant="h6">
        Total Revenue: {totalRevenue}
      </Typography>
      <Typography variant="h6">
        Total Quantity: {totalQuantity}
      </Typography>
      <CustomForm<ISale>
        formName="Sale"
        onSubmit={onSubmit}
        textFields={textFields}
        selectFields={selectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
        editId={editSaleId}
        initialData={editSaleData}

      />
      <CustomFilters
        filters={reportFilters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
      />
      <CustomTable<ISale>
        rows={sales}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SalePage;
