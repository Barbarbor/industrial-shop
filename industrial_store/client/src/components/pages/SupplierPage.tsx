import React, { useState } from 'react';
import {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from '../../services/api';
import { ISupplier } from '../../types/Supplier.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

interface IFormInput {
  name: string;
}

const SupplierPage: React.FC = () => {
  const { data: suppliers, isLoading, isError, error } = useGetSuppliersQuery();
  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editSupplierId, setEditSupplierId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editSupplierId !== null) {
      await updateSupplier({ id: editSupplierId, name: data.name }).unwrap();
      setEditSupplierId(null);
    } else {
      await addSupplier(data).unwrap();
    }
    reset();
  };

  const handleEdit = (supplier: ISupplier) => {
    setEditSupplierId(supplier.id);
    setValue('name', supplier.name);
  };

  const handleDelete = async (id: number) => {
    await deleteSupplier(id).unwrap();
  };

  if (isLoading) return <div>Загрузка...</div>;

  if (isError) {
    if ('status' in error) {
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
      return (
        <div>
           <div>Произошла ошибка:</div>
          <div>{errMsg}</div>
        </div>
      );
    }
    return <div>{error.message}</div>;
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name',  headerName: 'Название', width: 200 },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: 8 }}
          >
             Изменить
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
              Удалить
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
      Управление поставщиками
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('name', { required: true })}
          placeholder="Поставщик"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
        {editSupplierId ? 'Обновить' : 'Добавить'} поставщика
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={suppliers || []}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default SupplierPage;
