import React, { useState, lazy, Suspense } from 'react';
import { useGetSuppliersQuery, useAddSupplierMutation, useUpdateSupplierMutation, useDeleteSupplierMutation } from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { ISupplier } from '@/types/Supplier.types';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const SupplierPage: React.FC = () => {
  const { data: suppliers, isLoading } = useGetSuppliersQuery();
  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Название', placeholder: 'Название' },
  ];

  const [editSupplierId, setEditSupplierId] = useState<number | null>(null);
  const [editSupplierData, setEditSupplierData] = useState<ISupplier | null>(null);

  const onSubmit = async (data: ISupplier) => {
    if (editSupplierId !== null) {
      await updateSupplier({ id: editSupplierId, ...data }).unwrap();
      setEditSupplierId(null);
      setEditSupplierData(null);
    } else {
      await addSupplier(data).unwrap();
      setEditSupplierData(null);
    }
  };

  const handleEdit = (supplier: ISupplier) => {
    setEditSupplierId(supplier.id);
    setEditSupplierData(supplier);
  };

  const handleDelete = async (id: number) => {
    await deleteSupplier(id).unwrap();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 200 }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление поставщиками
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Поставщика"
            onSubmit={onSubmit}
            textFields={textFields}
            editId={editSupplierId}
            initialData={editSupplierData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading} 
            rows={suppliers || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SupplierPage;
