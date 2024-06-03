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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import useFilters from '../../hooks/useFilters';

interface IFormInput {
  day: string;
  startTime: string;
  endTime: string;
  sellerId: number;
}

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

  const { register, handleSubmit, reset, setValue } = useForm<IFormInput>();
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);

  const schedules = reportData || schedulesData;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (editScheduleId !== null) {
      await updateSchedule({ id: editScheduleId, ...data }).unwrap();
      setEditScheduleId(null);
    } else {
      await addSchedule(data).unwrap();
    }
    reset();
  };

  const handleEdit = (schedule: ISchedule) => {
    setEditScheduleId(schedule.id);
    setValue('day', new Date(schedule.day).toISOString().substring(0, 10));
    setValue('startTime', schedule.startTime);
    setValue('endTime', schedule.endTime);
    setValue('sellerId', schedule.sellerId);
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
        Schedule Management
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <TextField
          {...register('day', { required: true })}
          type="date"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('startTime', { required: true })}
          type="time"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <TextField
          {...register('endTime', { required: true })}
          type="time"
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Seller</InputLabel>
          <Select
            {...register('sellerId', { required: true })}
            label="Seller"
          >
            {sellers &&
              sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {`${seller.name} ${seller.surname}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {editScheduleId ? 'Update' : 'Add'} Schedule
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Filters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4 }}>
        <FormControl variant="outlined" sx={{ marginRight: 2, minWidth: 150 }}>
          <InputLabel>Seller</InputLabel>
          <Select
            name="sellerId"
            value={filters.sellerId || ''}
            onChange={handleFilterChange}
            label="Seller"
          >
            {sellers &&
              sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {`${seller.name} ${seller.surname}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          name="startTime"
          label="Start Time"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={filters.startTime || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <TextField
          name="endTime"
          label="End Time"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={filters.endTime || ''}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
          sx={{ marginRight: 2 }}
        >
          Apply Filters
        </Button>
        <Button variant="contained" color="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={schedules || []}
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

export default SchedulePage;
