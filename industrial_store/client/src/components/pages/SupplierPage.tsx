import React, { useState } from 'react';
import {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from '../../services/api';
import { ISupplier } from '../../types/Supplier.types';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const SupplierPage: React.FC = () => {
  const { data: suppliers, isLoading, isError, error } = useGetSuppliersQuery();
  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Name', placeholder:'Name' }
  ];

  const [editSupplierId, setEditSupplierId] = useState<number | null>(null);
  const [editSupplierData, setEditSupplierData] = useState<ISupplier | null>(null);

  const onSubmit = async (data) => {
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
    { field: 'name', headerName: 'Name', width: 200 }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Management
      </Typography>
      <CustomForm<ISupplier>
        formName="Supplier"
        onSubmit={onSubmit}
        textFields={textFields}
        editId={editSupplierId}
        initialData={editSupplierData}
      />
      <CustomTable<ISupplier>
        rows={suppliers || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SupplierPage;
