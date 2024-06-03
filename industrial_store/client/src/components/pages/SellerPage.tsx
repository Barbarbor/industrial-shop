import React, { useState } from 'react';
import {
  useGetSellersQuery,
  useAddSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} from '../../services/api';
import { ISeller } from '../../types/Seller.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

interface IFormInput {
  name: string;
  surname: string;
  profitPercentage: number;
  role: string;
}

const SellerPage: React.FC = () => {
  const { data: sellers, isLoading, isError, error } = useGetSellersQuery();
  const [addSeller] = useAddSellerMutation();
  const [updateSeller] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editSellerId, setEditSellerId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editSellerId !== null) {
      await updateSeller({ id: editSellerId, ...data }).unwrap();
      setEditSellerId(null);
    } else {
      await addSeller(data).unwrap();
    }
    reset();
  };

  const handleEdit = (seller: ISeller) => {
    setEditSellerId(seller.id);
    setValue('name', seller.name);
    setValue('surname', seller.surname);
    setValue('profitPercentage', seller.profitPercentage);
    setValue('role', seller.role);
  };

  const handleDelete = async (id: number) => {
    await deleteSeller(id).unwrap();
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
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 },
    { field: 'profitPercentage', headerName: 'Profit Percentage', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
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
        Seller Management
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          variant="outlined"
          placeholder='Seller Name'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('surname', { required: true })}
          variant="outlined"
          placeholder='Surname'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('profitPercentage', { required: true })}
          type="number"
          variant="outlined"
          placeholder='Profit Percentage'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('role', { required: true })}
          variant="outlined"
          placeholder='Role'
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editSellerId ? 'Update' : 'Add'} Seller
        </Button>
      </Box>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={sellers || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 9,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SellerPage;
