import {memo} from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

interface RowData {
  id: number;
  [key: string]: any;
}

interface CustomTableProps {
  rows: RowData[];
  columns: GridColDef[];
  onEdit: (row: RowData) => void;
  onDelete: (id: number) => void;
  isLoading: boolean,
  withoutActionButtons?: boolean
}

const CustomTable = ({
  rows,
  columns,
  onEdit,
  onDelete,
  isLoading,
  withoutActionButtons
}: CustomTableProps) => {
  const actionColumn: GridColDef = {
    field: 'actions',
    headerName: 'Действия',
    width: 210,
    
    renderCell: (params) => {
     if(!withoutActionButtons)
     return(
      <Box>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onEdit(params.row as RowData)}
          className="mr-2"
          title='Edit'
        >
          Изменить
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => onDelete(params.row.id)}
          title='Delete'
        >
          Удалить
        </Button>
      </Box>
     )
    },
  };

  return (
    
      <DataGrid
        sx={{height:'632px'}}
        loading={isLoading}
        rows={rows}
        columns={[...columns, actionColumn]}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
   
  );
};

export default memo(CustomTable);
