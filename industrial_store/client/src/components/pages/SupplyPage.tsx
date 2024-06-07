import React, { useState } from 'react';
import {
  useLazyGetReportQuery,
  useGetCategoriesQuery,
  useGetManufacturersQuery,
  useGetSuppliersQuery,
  useGetProductsQuery,
  useAddSupplyMutation,
  useDeleteSupplyMutation,
  useUpdateSupplyMutation,
  useGetSuppliesQuery,
  
} from '../../services/api';

import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import CustomFilters from '../shared/CustomFiltersForm';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import useFilters from '../../hooks/useFilters';
import { ISupply, ISupplyFilters, ISuppliesResponse } from '../../types/Supply.types';

const SupplyPage: React.FC = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: manufacturers } = useGetManufacturersQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const { data: products,isLoading: loadingProducts } = useGetProductsQuery();
  const { data: suppliesData} = useGetSuppliesQuery();
  const [addSupply] = useAddSupplyMutation()
  const [updateSupply] = useUpdateSupplyMutation();
  const [deleteSupply] = useDeleteSupplyMutation();
  const initialFilters: ISupplyFilters = {
    startDate: undefined,
    endDate: undefined,
    productId: undefined,
    categoryId: undefined,
    manufacturerId: undefined,
    supplierId: undefined,
  };

  const { filters:reportFilters,reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISuppliesResponse,ISupplyFilters>(
    useLazyGetReportQuery,
    initialFilters
  );
  const supplies = reportData?.supplies || suppliesData?.supplies;
  const totalQuantity = reportData?.totalQuantity || 0;
  const totalAmount = reportData?.totalAmount || 0;

  const textFields = [
    { name: 'amount', required: true, inputLabel:'Amount',placeholder: 'Amount', type: 'number' },
    { name: 'quantity', required: true, inputLabel:'Quantity', placeholder: 'Quantity', type: 'number' },
    { name: 'deliveredAt', required: true, inputLabel:'Delivered at',  type: 'date' }
  ];

  const selectFields = [
    { name: 'supplierId', inputLabel: 'Supplier', required: true, data: suppliers || [] }
  ];
  const virtualAutocompleteFields = [
    {
      name: 'productId',
      options: products || [],
      loading: loadingProducts,
      label: 'Product',
      getOptionLabel: (option) => option.name,
    }
  ];
  const filterTextFields = [
    { name: 'startDate', inputLabel: 'Start Date', type: 'date' },
    { name: 'endDate', inputLabel: 'End Date', type: 'date' }
  ];

  const filterSelectFields = [
    { name: 'categoryId', inputLabel: 'Category', data: categories || [] },
    { name: 'manufacturerId',inputLabel: 'Manufacturer', data: manufacturers || [] },
    { name: 'supplierId', inputLabel: 'Supplier', data: suppliers || [] }
  ];

  const [editSupplyId, setEditSupplyId] = useState<number | null>(null);
  const [editSupplyData, setEditSupplyData] = useState<ISupply | null>(null);

  const onSubmit = async (data) => {
    if (editSupplyId !== null) {
      await updateSupply({ id: editSupplyId, ...data }).unwrap();
      setEditSupplyId(null);
      setEditSupplyData(null);
    } else {
      await addSupply(data).unwrap();
      setEditSupplyData(null);
    }
  };

  const handleEdit = (supply: ISupply) => {
    setEditSupplyId(supply.id);
    setEditSupplyData({
      ...supply,
      deliveredAt: new Date(supply.deliveredAt).toISOString().substring(0, 10), // Ensure date is properly formatted
    });
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
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supply Management
      </Typography>
      <Typography variant="h6">
        Total Quantity: {totalQuantity}
      </Typography>
      <Typography variant="h6">
        Total Amount: {totalAmount}
      </Typography>
      <CustomForm<ISupply>
        formName="Supply"
        onSubmit={onSubmit}
        textFields={textFields}
        selectFields={selectFields}
        editId={editSupplyId}
        initialData={editSupplyData}
        virtualAutocompleteFields={virtualAutocompleteFields}
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
      <CustomTable<ISupply>
        rows={supplies || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SupplyPage;
