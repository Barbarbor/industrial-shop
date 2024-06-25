import React, { useState, lazy, Suspense } from 'react';
import {
  useLazyGetSalesReportQuery,
  useGetSalesQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useGetProductsQuery,
  useGetBuyersQuery,
  useGetSellersQuery,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import useFilters from '@/hooks/useFilters';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ISaleResponse, ISaleFilters, ISale } from '@/types/Sale.types';
import {getFormattedDate, getFullBuyerName, getFullSellerName, getProductName } from '@/utils/utils';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));
const CustomFilters = lazy(() => import('@/components/shared/CustomFilters'));

const SalePage: React.FC = () => {
  const { data: salesData, isLoading } = useGetSalesQuery();
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
    { name: 'saleDate', required: true, inputLabel: 'Дата продажи', type: 'date' },
    { name: 'quantity', required: true, inputLabel: 'Количество', placeholder:'Количество', type: 'number'}
  ];

  const selectFields = [
    { name: 'buyerId', inputLabel: 'Покупатель', required: true, data: buyers || [] },
    { name: 'sellerId', inputLabel: 'Продавец', required: true, data: sellers || [] },
  ];

  const virtualAutocompleteFields= [
    {
      name: 'productId',
      options: products || [],
      loading: loadingProducts,
      label: 'Товар',
      getOptionLabel: (option) => option.name,
    }
  ];

  const filterTextFields = [
    { name: 'startDate', inputLabel: 'Начальная дата', type: 'date' },
    { name: 'endDate', inputLabel: 'Конечная дата', type: 'date' }
  ];

  const filterSelectFields = [
    { name: 'buyerId', inputLabel: 'Покупатель', data: buyers || [] },
    { name: 'sellerId', inputLabel: 'Продавец', data: sellers || [] },
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

  const handleEdit = (sale: ISale) => {
    setEditSaleId(sale.id);
    setEditSaleData({
      ...sale,
      saleDate: new Date(sale.saleDate).toISOString().substring(0, 10),
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id).unwrap();
  };

 

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'totalAmount', 
      headerName: 'Сумма продажи', 
      width: 150,
      valueFormatter: (params) => `${params.value}₽` 
    },
    {
      field: 'saleDate',
      headerName: 'Дата продажи',
      width: 200,
      valueFormatter: getFormattedDate,
    },
    {
      field: 'buyer',
      headerName: 'Покупатель',
      width: 200,
      valueGetter: getFullBuyerName(),
    },
    {
      field: 'seller',
      headerName: 'Продавец',
      width: 200,
      valueGetter: getFullSellerName(),
    },
    {
      field: 'quantity',
      headerName: 'Количество',
      width: 100,
    },
    {
      field: 'item',
      headerName: 'Товар',
      width: 300,
      valueGetter: getProductName(),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление продажами
      </Typography>
      <Typography variant="h6">
        Общая сумма продаж: {totalRevenue}₽
      </Typography>
      <Typography variant="h6">
        Общее проданное количество: {totalQuantity} шт.
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Продажу"
            onSubmit={onSubmit}
            textFields={textFields}
            selectFields={selectFields}
            virtualAutocompleteFields={virtualAutocompleteFields}
            editId={editSaleId}
            initialData={editSaleData}
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
            rows={sales}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SalePage;
