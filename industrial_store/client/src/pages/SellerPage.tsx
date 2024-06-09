// src/pages/SellerPage.tsx

import React, { useState, lazy, Suspense } from 'react';
import {
  useGetSellersQuery,
  useAddSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ISeller } from '@/types/Seller.types';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const SellerPage: React.FC = () => {
  const { data: sellers, isLoading } = useGetSellersQuery();
  const [addSeller] = useAddSellerMutation();
  const [updateSeller] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel:'Имя',placeholder: 'Имя' },
    { name: 'surname', required: true, inputLabel:'Фамилия',placeholder: 'Фамилия' },
    { name: 'profitPercentage', required: true, inputLabel:'Процент от продаж',placeholder: 'Процент от продаж', type: 'number' },
    { name: 'role', required: true, inputLabel:'Должность',placeholder: 'Role' },
  ];

  const [editSellerId, setEditSellerId] = useState<number | null>(null);
  const [editSellerData, setEditSellerData] = useState<ISeller | null>(null);

  const onSubmit = async (data) => {
    if (editSellerId !== null) {
      await updateSeller({ id: editSellerId, ...data }).unwrap();
      setEditSellerId(null);
      setEditSellerData(null);
    } else {
      await addSeller(data).unwrap();
      setEditSellerData(null);
    }
  };

  const handleEdit = (seller: ISeller) => {
    setEditSellerId(seller.id);
    setEditSellerData(seller);
  };

  const handleDelete = async (id: number) => {
    await deleteSeller(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Имя', width: 150 },
    { field: 'surname', headerName: 'Фамилия', width: 150 },
    { field: 'profitPercentage', headerName: 'Процент от продаж', width: 150 },
    { field: 'role', headerName: 'Должность', width: 150 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление продавцами
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Продавца"
            onSubmit={onSubmit}
            textFields={textFields}
            editId={editSellerId}
            initialData={editSellerData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading} 
            rows={sellers || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SellerPage;
