import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomFilters from './CustomFilters';
import { FilterChangeEvent } from '@/hooks/useFilters';
import { describe, it, expect, vi } from 'vitest';

describe('CustomFilters', () => {
  const mockOnFilterChange = vi.fn((e: FilterChangeEvent) => {});
  const mockOnApplyFilters = vi.fn();
  const mockOnClearFilters = vi.fn();

  const filters = { name: '', categoryId: '' };
  const filterTextFields = [
    {id: "textField", name: 'name', label: 'Name', placeholder: 'Name' },
  ];
  const filterSelectFields = [
    {id: 'selectField', name: 'categoryId', label:"Category", placeholder:"Category", data: [{ id: 1, name: 'Category 1' }] },
  ];
  const virtualAutocompleteFields = [
    {
      name: 'productId',
      options: [{ id: 1, name: 'Product 1' }],
      loading: false,
      label: 'Product',
      getOptionLabel: (option: { id: number; name: string }) => option.name,
    },
  ];
  it('renders text, virtualAutocomplete and select fields correctly', () => {
    render(
      <CustomFilters
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onApplyFilters={mockOnApplyFilters}
        onClearFilters={mockOnClearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
      />
    );

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product')).toBeInTheDocument();
  });

  it('calls onFilterChange when input is changed', () => {
    render(
      <CustomFilters
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onApplyFilters={mockOnApplyFilters}
        onClearFilters={mockOnClearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
      />
    );

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('calls onApplyFilters when Apply Filters button is clicked', () => {
    render(
      <CustomFilters
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onApplyFilters={mockOnApplyFilters}
        onClearFilters={mockOnClearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
      />
    );

    const applyButton = screen.getByText('Применить фильтры');
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalled();
  });

  it('calls onClearFilters when Clear Filters button is clicked', () => {
    render(
      <CustomFilters
        filters={filters}
        onFilterChange={mockOnFilterChange}
        onApplyFilters={mockOnApplyFilters}
        onClearFilters={mockOnClearFilters}
        filterTextFields={filterTextFields}
        filterSelectFields={filterSelectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
      />
    );

    const clearButton = screen.getByText('Очистить фильтры');
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });
});
