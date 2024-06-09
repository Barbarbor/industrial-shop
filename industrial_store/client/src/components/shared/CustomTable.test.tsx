
import { render, screen,} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import CustomTable from './CustomTable';
import { GridColDef } from '@mui/x-data-grid';

interface TestRow {
  id: number;
  name: string;
}

describe('CustomTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
  ];

  const rows: TestRow[] = [
    { id: 1, name: 'Test Row 1' },
    { id: 2, name: 'Test Row 2' },
  ];

  it('renders with provided rows and columns', () => {
    render(
      <CustomTable
        isLoading={false}
        rows={rows}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Row 1')).toBeInTheDocument();
    expect(screen.getByText('Test Row 2')).toBeInTheDocument();
  });

 
});
