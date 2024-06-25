import React, { useState, lazy, Suspense } from 'react';
import {
  useGetManufacturersQuery,
  useAddManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IManufacturer } from '@/types/Manufacturer.types';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const ManufacturerPage: React.FC = () => {
  const { data: manufacturers, isLoading,  } = useGetManufacturersQuery();
  const [addManufacturer] = useAddManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Название', placeholder: 'Название' }
  ];

  const [editManufacturerId, setEditManufacturerId] = useState<number | null>(null);
  const [editManufacturerData, setEditManufacturerData] = useState<IManufacturer | null>(null);

  const onSubmit = async (data) => {
    if (editManufacturerId !== null) {
      await updateManufacturer({ id: editManufacturerId, ...data }).unwrap();
      setEditManufacturerId(null);
      setEditManufacturerData(null);
    } else {
      await addManufacturer(data).unwrap();
      setEditManufacturerData(null);
    }
  };

  const handleEdit = (manufacturer: IManufacturer) => {
    setEditManufacturerId(manufacturer.id);
    setEditManufacturerData(manufacturer);
  };

  const handleDelete = async (id: number) => {
    await deleteManufacturer(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 200 }
  ];

 
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление производителями
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Производителя"
            onSubmit={onSubmit}
            textFields={textFields}
            editId={editManufacturerId}
            initialData={editManufacturerData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={manufacturers || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default ManufacturerPage;
