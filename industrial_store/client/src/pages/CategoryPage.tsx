import React, { useState, lazy, Suspense } from 'react';
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { ICategory } from '@/types/Category.types';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const CategoryPage: React.FC = () => {
  const { data: categories, isLoading,} = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Название', placeholder: 'Название' }
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 350 }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление категориями
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Категорию"
            onSubmit={onSubmit}
            textFields={textFields}
            editId={editCategoryId}
            initialData={editCategoryData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={categories || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default CategoryPage;
