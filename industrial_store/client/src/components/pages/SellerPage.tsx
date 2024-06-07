import React, { useState } from 'react';
import {
  useGetSellersQuery,
  useAddSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} from '../../services/api';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ISeller } from '../../types/Seller.types';

const SellerPage: React.FC = () => {
  const { data: sellers, isLoading, isError, error } = useGetSellersQuery();
  const [addSeller] = useAddSellerMutation();
  const [updateSeller] = useUpdateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel:'Name',placeholder: 'Name' },
    { name: 'surname', required: true, inputLabel:'Surname',placeholder: 'Surname' },
    { name: 'profitPercentage', required: true, inputLabel:'Profit Percentage',placeholder: 'Profit Percentage', type: 'number' },
    { name: 'role', required: true, inputLabel:'Role',placeholder: 'Role' },
  ];

  const [editSellerId, setEditSellerId] = useState<number | null>(null);
  const [editSellerData, setEditSellerData] = useState<any | null>(null);

  const onSubmit = async (data) => {
    if (editSellerId !== null) {
      await updateSeller({ id: editSellerId, ...data }).unwrap();
      setEditSellerId(null);
      setEditSellerData(null);
    } else {
      await addSeller(data).unwrap();
      setEditSellerData(null);
    }
  };

  const handleEdit = (seller: any) => {
    setEditSellerId(seller.id);
    setEditSellerData(seller);
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
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Management
      </Typography>
      <CustomForm<ISeller>
        formName="Seller"
        onSubmit={onSubmit}
        textFields={textFields}
        editId={editSellerId}
        initialData={editSellerData}
      />
      <CustomTable<ISeller>
        rows={sellers || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SellerPage;
