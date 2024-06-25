import React, { useState, lazy, Suspense } from 'react';
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
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import useFilters from '@/hooks/useFilters';
import { ISupply, ISupplyFilters, ISuppliesResponse } from '@/types/Supply.types';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { getFormattedDate, getName } from '@/utils/utils';
const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));
const CustomFilters = lazy(() => import('@/components/shared/CustomFilters'));

const SupplyPage: React.FC = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: manufacturers } = useGetManufacturersQuery();
  const { data: suppliers } = useGetSuppliersQuery();
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery();
  const { data: suppliesData, isLoading } = useGetSuppliesQuery();
  const [addSupply] = useAddSupplyMutation();
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

  const { filters: reportFilters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISuppliesResponse, ISupplyFilters>(
    useLazyGetReportQuery,
    initialFilters
  );
  
  const supplies = reportData?.supplies || suppliesData?.supplies;
  const totalQuantity = reportData?.totalQuantity || suppliesData?.totalQuantity || 0;
  const totalAmount = reportData?.totalAmount || suppliesData?.totalAmount || 0;

  const textFields = [
    { name: 'amount', required: true, inputLabel: 'Стоимость поставки', placeholder: 'Стоимость поставки', type: 'number' },
    { name: 'quantity', required: true, inputLabel: 'Количество товара', placeholder: 'Количество товара', type: 'number' },
    { name: 'deliveredAt', required: true, inputLabel: 'Дата доставки', type: 'date' },
  ];

  const selectFields = [
    { name: 'supplierId', inputLabel: 'Поставщик', required: true, data: suppliers || [] },
  ];
  const virtualAutocompleteFields = [
    {
      name: 'productId',
      options: products || [],
      loading: loadingProducts,
      label: 'Товар',
      getOptionLabel: (option) => option.name,
    },
  ];

  const filterTextFields = [
    { name: 'startDate', inputLabel: 'Начальная дата', type: 'date' },
    { name: 'endDate', inputLabel: 'Конечная дата', type: 'date' },
  ];

  const filterSelectFields = [
    { name: 'categoryId', inputLabel: 'Категория', data: categories || [] },
    { name: 'manufacturerId', inputLabel: 'Производитель', data: manufacturers || [] },
    { name: 'supplierId', inputLabel: 'Поставщик', data: suppliers || [] },
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
      deliveredAt: new Date(supply.deliveredAt).toISOString().substring(0, 10), 
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSupply(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'productId',
      headerName: 'Товар',
      width: 300,
      valueGetter: getName(products),
    },
    {
      field: 'supplierId',
      headerName: 'Поставщик',
      width: 250,
      valueGetter: getName(suppliers),
    },
    { field: 'amount', headerName: 'Сумма поставки', width: 150, valueFormatter: (params) => `${params.value}₽` },
    { field: 'quantity', headerName: 'Количество товара', width: 150 },
    {
      field: 'deliveredAt',
      headerName: 'Дата поставки',
      width: 150,
      valueFormatter: getFormattedDate,
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление поставками
      </Typography>
      <Typography variant="h6">
        Поставленное количество: {totalQuantity} шт.
      </Typography>
      <Typography variant="h6">
        Поставлено на сумму: {totalAmount}₽
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Поставку"
            onSubmit={onSubmit}
            textFields={textFields}
            selectFields={selectFields}
            editId={editSupplyId}
            initialData={editSupplyData}
            virtualAutocompleteFields={virtualAutocompleteFields}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка фильтров...</div>}>
          <CustomFilters
            filters={reportFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            filterTextFields={filterTextFields}
            filterSelectFields={filterSelectFields}
            virtualAutocompleteFields={virtualAutocompleteFields}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading} 
            rows={supplies || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SupplyPage;
