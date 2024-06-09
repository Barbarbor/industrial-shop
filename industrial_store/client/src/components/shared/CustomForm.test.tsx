import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomForm from './CustomForm';
import { describe, it, expect, vi } from 'vitest';

type Data = { id: number; name: string };

describe('CustomForm', () => {
  const mockOnSubmit = vi.fn()

  const textFields = [
    { name: 'name', required: true, inputLabel: 'Name', placeholder: 'Name' },
    { name: 'price', required: true, inputLabel: 'Price', placeholder: 'Price', type: 'number' },
  ];

  const selectFields = [
    { name: 'categoryId', label:'Category', inputLabel: 'Category', required: true, data: [{ id: 1, name: 'Category 1' }, {id:2, name: 'Category 2'}] },
  ];

  const virtualAutocompleteFields = [
    {
      name: 'productId',
      options: [{ id: 1, name: 'Product 1' }, {id:2, name: 'Product 2'}],
      loading: false,
      label: 'Product',
      getOptionLabel: (option: Data) => option.name,
    },
  ];

  const initialData = { name: 'Initial Name', price: 100, categoryId: 1, productId: 1 };

  it('renders text, select fields, and VirtualizedAutocomplete correctly', () => {
    render(
      <CustomForm
        formName="Product"
        onSubmit={mockOnSubmit}
        textFields={textFields}
        selectFields={selectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
        editId={null}
        initialData={initialData}
      />
    );

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Product 1')).toBeInTheDocument();
    
  });

  it('calls onSubmit when form is submitted', async () => {
    render(
      <CustomForm
        formName="Product"
        onSubmit={mockOnSubmit}
        textFields={textFields}
        selectFields={selectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
        editId={null}
        initialData={initialData}
      />
    );

    const submitButton = screen.getByText('Добавить Product');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('renders with initial data for editing', () => {
    render(
      <CustomForm
        formName="Product"
        onSubmit={mockOnSubmit}
        textFields={textFields}
        selectFields={selectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
        editId={1}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('Initial Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product')).toBeInTheDocument();
    expect(screen.getByText('Обновить Product')).toBeInTheDocument();
  });

  it('calls onSubmit with updated values', async () => {
    render(
      <CustomForm
        formName="Product"
        onSubmit={mockOnSubmit}
        textFields={textFields}
        selectFields={selectFields}
        virtualAutocompleteFields={virtualAutocompleteFields}
        editId={1}
        initialData={initialData}
      />
    );

    const nameInput = screen.getByPlaceholderText('Name');
    const priceInput = screen.getByPlaceholderText('Price');
    const categoryInput = screen.getByText('Category 1');
    const productInput = screen.getByPlaceholderText('Product');
    const submitButton = screen.getByText('Обновить Product');
   
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(priceInput, { target: { value: 200 } });
    
    fireEvent.mouseDown(categoryInput);
    await waitFor(() => screen.getByRole('option', { name: /category 2/i }));
    fireEvent.click(screen.getByRole('option', { name: /category 2/i }));

  
    fireEvent.mouseDown(productInput);
    await waitFor(() => screen.getByRole('option', { name: /product 2/i }));
    fireEvent.click(screen.getByRole('option', { name: /product 2/i }));
    await waitFor( () =>  fireEvent.click(submitButton) )
    
    expect(mockOnSubmit.mock.calls[1][0]).toEqual({
      name: 'Updated Name',
      price: 200,
      categoryId: 2,
      productId: 2,
    });
  });
});
