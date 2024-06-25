import React, { useState, lazy, Suspense} from 'react';
import { useGetSalariesQuery } from '@/services/api';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { Box, TextField, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { GridColDef } from '@mui/x-data-grid';

const CustomTable = lazy(() => import('@/components/shared/CustomTable'));

const SalaryPage: React.FC = () => {
  

  const [month, setMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const { data: salaries, isLoading, refetch } = useGetSalariesQuery(month);

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const handleApplyFilter = () => {
    refetch();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sellerId', headerName: 'Продавец', width: 150 },
   { field: 'month', headerName: 'Месяц', width: 150 },
    { field: 'salesAmount', headerName: 'Сумма продаж', width: 150, valueFormatter: (params) => `${params.value}₽`  },
    { field: 'workingHours', headerName: 'Отработанные часы', width: 150 },
    { field: 'salary', headerName: 'Зарплата', width: 150, valueFormatter: (params) => `${params.value}₽`  },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Зарплаты сотрудников за месяц
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Месяц"
          type="month"
          value={month}
          onChange={handleMonthChange}
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
          Применить фильтр
        </Button>
      </Box>
      <ErrorBoundary>
        <Suspense fallback={<div>Загрузка таблицы...</div>}>
          <CustomTable
            isLoading = {isLoading}
            rows={salaries || []}
            columns={columns}
            onEdit={() => {}}
            onDelete={() => {}}
            withoutActionButtons
          />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};

export default SalaryPage;
