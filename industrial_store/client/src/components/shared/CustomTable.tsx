import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

interface CustomTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
}

const CustomTable = <T extends { id: number }>({
  rows,
  columns,
  onEdit,
  onDelete,
}: CustomTableProps<T>) => {
  const actionColumn: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(params.row as T)}
          className="mr-2"
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => onDelete(params.row.id)}
        >
          Delete
        </Button>
      </Box>
    ),
  };

  return (
    <div className="w-full h-auto">
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </div>
  );
};

export default CustomTable;