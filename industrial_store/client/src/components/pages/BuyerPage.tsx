import React, { useState } from 'react';
import {
  useGetBuyersQuery,
  useAddBuyerMutation,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} from '../../services/api';
import { IBuyer } from '../../types/Buyer.types';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

const BuyerPage: React.FC = () => {
  const { data: buyers, isLoading, isError, error } = useGetBuyersQuery();
  const [addBuyer] = useAddBuyerMutation();
  const [updateBuyer] = useUpdateBuyerMutation();
  const [deleteBuyer] = useDeleteBuyerMutation();

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Name', placeholder:'Name' },
    { name: 'surname', required: true, inputLabel: 'Surname', placeholder:'Surname' },
    { name: 'ageGroup', required: true, inputLabel: 'Age Group', placeholder:'Age group' },
    { name: 'gender', required: true, inputLabel: 'Gender',  placeholder:'Gender' },
  ];

  const [editBuyerId, setEditBuyerId] = useState<number | null>(null);
  const [editBuyerData, setEditBuyerData] = useState<IBuyer | null>(null);

  const onSubmit = async (data) => {
    if (editBuyerId !== null) {
      await updateBuyer({ id: editBuyerId, ...data }).unwrap();
      setEditBuyerId(null);
      setEditBuyerData(null);
    } else {
      await addBuyer(data).unwrap();
      setEditBuyerData(null);
    }
  };

  const handleEdit = (buyer: IBuyer) => {
    setEditBuyerId(buyer.id);
    setEditBuyerData(buyer);
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
    { field: 'ageGroup', headerName: 'Age Group', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 150 },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Management
      </Typography>
      <CustomForm<IBuyer>
        formName="Buyer"
        onSubmit={onSubmit}
        textFields={textFields}
        editId={editBuyerId}
        initialData={editBuyerData}
      />
      <CustomTable<IBuyer>
        rows={buyers || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default BuyerPage;
