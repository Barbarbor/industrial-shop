import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../services/api';
import { ICategory } from '../../types/Category.types';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const CategoryPage: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Name', placeholder:'Name' }
  ];

  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<ICategory | null>(null);

  const onSubmit = async (data) => {
    if (editCategoryId !== null) {
      await updateCategory({ id: editCategoryId, ...data }).unwrap();
      setEditCategoryId(null);
      setEditCategoryData(null);
    } else {
      await addCategory(data).unwrap();
      setEditCategoryData(null);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditCategoryId(category.id);
    setEditCategoryData(category);
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
    { field: 'name', headerName: 'Name', width: 200 }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>
      <CustomForm<ICategory>
        formName="Category"
        onSubmit={onSubmit}
        textFields={textFields}
        editId={editCategoryId}
        initialData={editCategoryData}
      />
      <CustomTable<ICategory>
        rows={categories || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default CategoryPage;
