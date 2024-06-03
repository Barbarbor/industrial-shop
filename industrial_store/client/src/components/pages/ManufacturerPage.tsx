import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  useGetManufacturersQuery, 
  useAddManufacturerMutation, 
  useUpdateManufacturerMutation, 
  useDeleteManufacturerMutation 
} from '../../services/api'; // Adjust the import path as needed
import { IManufacturer } from '../../types/Manufacturer.types';
import { Box, Button, TextField, Typography } from '@mui/material';

interface IFormInput {
  name: string;
}

const ManufacturerPage: React.FC = () => {
  const { data: manufacturers, error, isLoading } = useGetManufacturersQuery();
  const [addManufacturer] = useAddManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editManufacturerId, setEditManufacturerId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editManufacturerId !== null) {
      await updateManufacturer({ id: editManufacturerId, name: data.name }).unwrap();
      setEditManufacturerId(null);
    } else {
      await addManufacturer(data).unwrap();
    }
    reset();
  };

  const handleEdit = (manufacturer: IManufacturer) => {
    setEditManufacturerId(manufacturer.id);
    setValue('name', manufacturer.name);
  };

  const handleDelete = async (id: number) => {
    await deleteManufacturer(id).unwrap();
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) {
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
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manufacturer Management
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          placeholder='Производитель'
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editManufacturerId ? 'Update' : 'Add'} Manufacturer
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={manufacturers || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default ManufacturerPage;
