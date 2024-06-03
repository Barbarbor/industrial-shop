import React, { useState } from 'react';
import {
  useGetBuyersQuery,
  useAddBuyerMutation,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} from '../../services/api';
import { IBuyer} from '../../types/Buyer.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

interface IFormInput {
  name: string;
  surname: string;
  ageGroup: string;
  gender: string;
}

const BuyerPage: React.FC = () => {
  const { data: buyers, isLoading, isError, error } = useGetBuyersQuery();
  const [addBuyer] = useAddBuyerMutation();
  const [updateBuyer] = useUpdateBuyerMutation();
  const [deleteBuyer] = useDeleteBuyerMutation();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editBuyerId, setEditBuyerId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editBuyerId !== null) {
      await updateBuyer({ id: editBuyerId, ...data }).unwrap();
      setEditBuyerId(null);
    } else {
      await addBuyer(data).unwrap();
    }
    reset();
  };

  const handleEdit = (buyer: IBuyer) => {
    setEditBuyerId(buyer.id);
    setValue('name', buyer.name);
    setValue('surname', buyer.surname);
    setValue('ageGroup', buyer.ageGroup);
    setValue('gender', buyer.gender);
  };

  const handleDelete = async (id: number) => {
    await deleteBuyer(id).unwrap();
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
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'surname', headerName: 'Surname', width: 200 },
    { field: 'ageGroup', headerName: 'Age Group', width: 150, valueGetter: (params) => params.row.ageGroup },
    { field: 'gender', headerName: 'Gender', width: 150, valueGetter: (params) => params.row.gender },
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
        Buyer Management
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          variant="outlined"
          placeholder='Buyer Name'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('surname', { required: true })}
          variant="outlined"
          placeholder='Surname'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('ageGroup', { required: true })}
          variant="outlined"
          placeholder='Age Group'
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('gender', { required: true })}
          variant="outlined"
          placeholder='Gender'
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editBuyerId ? 'Update' : 'Add'} Buyer
        </Button>
      </Box>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={buyers || []}
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

export default BuyerPage;
