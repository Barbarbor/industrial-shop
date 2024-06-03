import React, { useState } from 'react';
import { useGetSalariesQuery } from '../../services/api'; // Assuming you have a custom hook for fetching data
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, TextField, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';

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
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={salaries || []}
          columns={columns}
          pageSizeOptions={[5, 10, 15]}
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

export default SalaryPage;
