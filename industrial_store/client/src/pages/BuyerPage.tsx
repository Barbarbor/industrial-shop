// src/pages/BuyerPage.tsx

import React, { useState, lazy, Suspense, } from 'react';
import {
  useGetBuyersQuery,
  useAddBuyerMutation,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IBuyer } from '@/types/Buyer.types';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const BuyerPage: React.FC = () => {
  const { data: buyers, isLoading,  } = useGetBuyersQuery();
  const [addBuyer] = useAddBuyerMutation();
  const [updateBuyer] = useUpdateBuyerMutation();
  const [deleteBuyer] = useDeleteBuyerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Имя', placeholder:'Имя' },
    { name: 'surname', required: true, inputLabel: 'Фамилия', placeholder:'Фамилия' },
    { name: 'ageGroup', required: true, inputLabel: 'Возрастная группа', placeholder:'Возрастная группа' },
    { name: 'gender', required: true, inputLabel: 'Пол',  placeholder:'Пол' },
  ];

  const [editBuyerId, setEditBuyerId] = useState<number | null>(null);
  const [editBuyerData, setEditBuyerData] = useState<IBuyer | null>(null);

  const onSubmit = async (data) => {
    if (editBuyerId !== null) {
      await updateBuyer({ id: editBuyerId, ...data }).unwrap();
      setEditBuyerId(null);
      setEditBuyerData(null);
    } else {
      await addBuyer(data).unwrap();
      setEditBuyerData(null);
    }
  };

  const handleEdit = (buyer: IBuyer) => {
    setEditBuyerId(buyer.id);
    setEditBuyerData(buyer);
  };

  const handleDelete = async (id: number) => {
    await deleteBuyer(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'name', headerName: 'Имя', width: 160 },
    { field: 'surname', headerName: 'Фамилия', width: 160 },
    { field: 'ageGroup', headerName: 'Возрастная группа', width: 150 },
    { field: 'gender', headerName: 'Пол', width: 150 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Management
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Покупателя"
            onSubmit={onSubmit}
            textFields={textFields}
            editId={editBuyerId}
            initialData={editBuyerData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={buyers || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default BuyerPage;
