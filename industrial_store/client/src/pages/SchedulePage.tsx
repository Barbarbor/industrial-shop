import React, { useState, lazy, Suspense } from 'react';
import {
  useGetSchedulesQuery,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useLazyGetSchedulesFilteredQuery,
  useGetSellersQuery,
} from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import useFilters from '@/hooks/useFilters';
import { ISchedule, IScheduleFilters } from '@/types/Schedule.types';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { getFormattedDate, getFormattedTime, getFullSellerName } from '@/utils/utils';

const CustomForm = lazy(() => import('@/components/shared/CustomForm'));
const CustomTable = lazy(() => import('@/components/shared/CustomTable'));
const CustomFilters = lazy(() => import('@/components/shared/CustomFilters'));

const SchedulePage: React.FC = () => {
  const { data: schedulesData, isLoading} = useGetSchedulesQuery();
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
    { name: 'day', required: true, inputLabel: 'День', type: 'date' },
    { name: 'startTime', required: true, inputLabel: 'Начало смены', type: 'time' },
    { name: 'endTime', required: true, inputLabel: 'Конец смены', type: 'time' },
  ];

  const selectFields = [
    { name: 'sellerId', inputLabel: 'Продавец', required: true, data: sellers || [] }
  ];

  const filterTextFields = [
    { name: 'startTime', inputLabel: 'Начальная дата', type: 'date' },
    { name: 'endTime', inputLabel: 'Конечная дата', type: 'date' },
  ];

  const filterSelectFields = [
    { name: 'sellerId', inputLabel: 'Продавец', data: sellers || [] }
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sellerName', headerName: 'Seller Name', width: 200, valueGetter: getFullSellerName() },
    { field: 'startTime', headerName: 'Start Time', width: 100, valueFormatter: getFormattedTime },
    { field: 'endTime', headerName: 'End Time', width: 100, valueFormatter: getFormattedTime },
    { field: 'day', headerName: 'Day', width: 150, valueFormatter: getFormattedDate },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Управление графиком смен
      </Typography>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка формы...</div>}>
          <CustomForm
            formName="Смену"
            onSubmit={onSubmit}
            textFields={textFields}
            selectFields={selectFields}
            editId={editScheduleId}
            initialData={editScheduleData}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка фильтров...</div>}>
          <CustomFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            filterTextFields={filterTextFields}
            filterSelectFields={filterSelectFields}
          />
        </Suspense>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={reportData || schedulesData || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SchedulePage;
