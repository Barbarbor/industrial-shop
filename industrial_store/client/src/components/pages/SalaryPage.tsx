import React, { useState } from 'react';
import { useGetSalariesQuery } from '../../services/api';
import CustomTable from '../shared/CustomTable';
import { Box, TextField, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { GridColDef } from '@mui/x-data-grid';
import { ISalary } from '../../types/Salary.types';

const SalaryPage: React.FC = () => {
  const [month, setMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const { data: salaries, isLoading, isError, refetch } = useGetSalariesQuery(month);
  
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const handleApplyFilter = () => {
    refetch();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sellerId', headerName: 'Seller ID', width: 150 },
    { field: 'month', headerName: 'Month', width: 150 },
    { field: 'salesAmount', headerName: 'Sales Amount', width: 150 },
    { field: 'workingHours', headerName: 'Working Hours', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 150 },
  ];

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error loading data</div>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Salaries
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Month"
          type="month"
          value={month}
          onChange={handleMonthChange}
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
          Apply Filter
        </Button>
      </Box>
      <CustomTable<ISalary>
        rows={salaries || []}
        columns={columns}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </Box>
  );
};

export default SalaryPage;
