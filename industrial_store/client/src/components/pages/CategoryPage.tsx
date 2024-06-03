import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../services/api';
import { ICategory } from '../../types/Category.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

interface IFormInput {
  name: string;
}

const CategoryPage: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editCategoryId !== null) {
      await updateCategory({ id: editCategoryId, name: data.name }).unwrap();
      setEditCategoryId(null);
    } else {
      await addCategory(data).unwrap();
    }
    reset();
  };

  const handleEdit = (category: ICategory) => {
    setEditCategoryId(category.id);
    setValue('name', category.name);
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id).unwrap();
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
        Category Management
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          placeholder='Категория'
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editCategoryId ? 'Update' : 'Add'} Category
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={categories || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default CategoryPage;
