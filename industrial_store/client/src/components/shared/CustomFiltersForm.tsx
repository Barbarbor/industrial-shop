import React, { memo } from 'react';
import { Box, TextField, FormControl, Select, MenuItem, Button, InputLabel, TextFieldProps, SelectProps } from '@mui/material';
import VirtualizedAutocomplete from '../shared/VirtualizedAutocomplete';
import { FilterChangeEvent } from '../../hooks/useFilters';

type Data = { id: number; name: string };
type TSelectFields = (SelectProps & { name: string; data: Data[]; inputLabel?: string })[];
type TTextFields = (TextFieldProps & { name: string; inputLabel?: string })[];
type TVirtualAutocompleteFields = {
  name: string;
  options: Data[];
  loading: boolean;
  label: string;
  getOptionLabel: (option: Data) => string;
}[];

interface CustomFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (e: FilterChangeEvent) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  filterTextFields?: TTextFields;
  filterSelectFields?: TSelectFields;
  virtualAutocompleteFields?: TVirtualAutocompleteFields;
}

const CustomFilters: React.FC<CustomFiltersProps> = ({ filters, onFilterChange, onApplyFilters, onClearFilters, filterTextFields, filterSelectFields, virtualAutocompleteFields }) => {
  return (
    <div className="flex flex-wrap mb-4">
      {filterTextFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field?.inputLabel} </InputLabel>
          <TextField
            variant="outlined"
            type={field.type || 'text'}
            value={filters[field.name] || ''}
            onChange={onFilterChange}
            {...field}
          />
        </div>
      ))}
      {filterSelectFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field?.inputLabel} </InputLabel>
          <Select
            value={filters[field.name] || ''}
            onChange={onFilterChange}
            className="min-w-32"
            displayEmpty
            {...field}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {field.data.map((item) => (
              <MenuItem key={`${field.name}${item.id}`} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      ))}
      {virtualAutocompleteFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field.label}</InputLabel>
          <VirtualizedAutocomplete
            options={field.options}
            loading={field.loading}
            label={field.label}
            value={field.options.find(option => option.id === filters[field.name]) || null}
            onChange={(event, newValue) => onFilterChange({
              target: { name: field.name, value: newValue ? newValue.id : '' }
            } as unknown as React.ChangeEvent<HTMLInputElement>)}
            getOptionLabel={field.getOptionLabel}
          />
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={onApplyFilters} className="mr-4">
        Apply Filters
      </Button>
      <Button variant="contained" color="secondary" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default memo(CustomFilters);
