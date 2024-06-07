import React, { useState } from 'react';
import {
  useGetSchedulesQuery,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useLazyGetSchedulesFilteredQuery,
  useGetSellersQuery,
} from '../../services/api';
import { ISchedule, IScheduleFilters } from '../../types/Schedule.types';
import CustomForm from '../shared/CustomForm';
import CustomTable from '../shared/CustomTable';
import CustomFilters from '../shared/CustomFiltersForm';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import useFilters from '../../hooks/useFilters';

const SchedulePage: React.FC = () => {
  const { data: schedulesData, isLoading, isError, error } = useGetSchedulesQuery();
  const { data: sellers } = useGetSellersQuery();

  const [addSchedule] = useAddScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const initialFilters: IScheduleFilters = {
    startTime: undefined,
    endTime: undefined,
    sellerId: undefined,
  };

  const { filters, reportData, applyFilters, clearFilters, handleFilterChange } = useFilters<ISchedule[], IScheduleFilters>(
    useLazyGetSchedulesFilteredQuery,
    initialFilters
  );

  const textFields = [
    { name: 'day', required: true, inputLabel: 'Day', type: 'date' },
    { name: 'startTime', required: true, inputLabel: 'Start Time', type: 'time' },
    { name: 'endTime', required: true, inputLabel: 'End Time', type: 'time' },
  ];

  const selectFields = [
    { name: 'sellerId', inputLabel: 'Seller', required: true, data: sellers || [] }
  ];

  const filterTextFields = [
    { name: 'startTime', inputLabel: 'Start Time', type: 'date' },
    { name: 'endTime', inputLabel: 'End Time', type: 'date' },
  ];

  const filterSelectFields = [
    { name: 'sellerId', inputLabel: 'Seller', data: sellers || [] }
  ];

  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);
  const [editScheduleData, setEditScheduleData] = useState<ISchedule | null>(null);

  const onSubmit = async (data) => {
    if (editScheduleId !== null) {
      await updateSchedule({ id: editScheduleId, ...data }).unwrap();
      setEditScheduleId(null);
      setEditScheduleData(null);
    } else {
      await addSchedule(data).unwrap();
      setEditScheduleData(null);
    }
  };

  const handleEdit = (schedule: ISchedule) => {
    setEditScheduleId(schedule.id);
    setEditScheduleData({
      ...schedule,
      day: new Date(schedule.day).toISOString().substring(0, 10),
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSchedule(id).unwrap();
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
    { field: 'sellerName', headerName: 'Seller Name', width: 200, valueGetter: (params) => `${params.row.seller.name} ${params.row.seller.surname}` },
    { field: 'startTime', headerName: 'Start Time', width: 100, valueFormatter: (params) => params.value.slice(0, 5) },
    { field: 'endTime', headerName: 'End Time', width: 100, valueFormatter: (params) => params.value.slice(0, 5) },
    { field: 'day', headerName: 'Day', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Schedule Management
      </Typography>
      <CustomForm
        formName="Schedule"
        onSubmit={onSubmit}
        textFields={textFields}
        selectFields={selectFields}
        editId={editScheduleId}
        initialData={editScheduleData}
      />
      <CustomFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
      />
      <CustomTable
        rows={reportData || schedulesData || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SchedulePage;
