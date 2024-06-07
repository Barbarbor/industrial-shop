import React, { useState } from 'react';
import {
  useGetManufacturersQuery,
  useAddManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation
} from '../../services/api';
import { IManufacturer } from '../../types/Manufacturer.types';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const ManufacturerPage: React.FC = () => {
  const { data: manufacturers, isLoading, isError, error } = useGetManufacturersQuery();
  const [addManufacturer] = useAddManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Name', placeholder:'Name' }
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
        Manufacturer Management
      </Typography>
      <CustomForm<IManufacturer>
        formName="Manufacturer"
        onSubmit={onSubmit}
        textFields={textFields}
        editId={editManufacturerId}
        initialData={editManufacturerData}
      />
      <CustomTable<IManufacturer>
        rows={manufacturers || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ManufacturerPage;
