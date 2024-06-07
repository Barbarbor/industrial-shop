import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller, FieldValues, Path } from 'react-hook-form';
import { TextField, Select, MenuItem, InputLabel, TextFieldProps, SelectProps, Button } from '@mui/material';
import VirtualizedAutocomplete from '../shared/VirtualizedAutocomplete';
interface IFormInput {
  [key: string]: any;
}
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

interface CustomFormProps<T extends FieldValues> {
  formName: string;
  onSubmit: SubmitHandler<T>;
  textFields?: TTextFields;
  editId: number | null;
  selectFields?: TSelectFields;
  initialData?: T | null;
  virtualAutocompleteFields?: TVirtualAutocompleteFields;
}

const CustomForm = <T extends FieldValues>({
  formName,
  onSubmit,
  textFields,
  editId,
  selectFields,
  initialData,
  virtualAutocompleteFields,
}: CustomFormProps<T>) => {
  const { register, handleSubmit, reset, setValue, control } = useForm<T>();

  useEffect(() => {
    if (initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        setValue(key as Path<T>, value);
      }
    } else {
      reset();
    }
  }, [initialData, reset, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center mb-4 space-x-2">
      {textFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field?.inputLabel}</InputLabel>
          <TextField
            {...register(field.name as Path<T>, { required: field.required })}
            type={field.type || 'text'}
            variant="outlined"
            className="mr-2"
            {...field}
          />
        </div>
      ))}
      {selectFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field?.inputLabel}</InputLabel>
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                className="min-w-32"
                displayEmpty
                value={controllerField.value ?? ""}
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
            )}
          />
        </div>
      ))}
      {virtualAutocompleteFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field.label}</InputLabel>
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: { onChange, value } }) => (
              <VirtualizedAutocomplete
                options={field.options}
                loading={field.loading}
                label={field.label}
                value={field.options.find(option => option.id === value) || null}
                onChange={(event, newValue) => onChange(newValue ? newValue.id : null)}
                getOptionLabel={field.getOptionLabel}
              />
            )}
          />
        </div>
      ))}
      <div className="flex items-center">
        <Button type="submit" variant="contained" color="primary">
          {editId ? 'Update' : 'Add'} {formName}
        </Button>
      </div>
    </form>
  );
};

export default CustomForm;