import { useEffect,memo} from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, Select, MenuItem, InputLabel, TextFieldProps, SelectProps, Button } from '@mui/material';
import VirtualizedAutocomplete from '@/components/shared/VirtualizedAutocomplete';

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

interface CustomFormProps {
  formName: string;
  onSubmit: SubmitHandler<IFormInput>;
  textFields?: TTextFields;
  editId: number | null;
  selectFields?: TSelectFields;
  initialData?: IFormInput | null;
  virtualAutocompleteFields?: TVirtualAutocompleteFields;
}

const CustomForm = ({
  formName,
  onSubmit,
  textFields,
  editId,
  selectFields,
  initialData,
  virtualAutocompleteFields,
}: CustomFormProps) => {
  const { register, handleSubmit, reset, setValue, control } = useForm<IFormInput>();

  useEffect(() => {
    if (initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        setValue(key, value);
      }
    } else {
      reset();
    }
  }, [initialData, reset, setValue]);

  const handleOnSubmit: SubmitHandler<IFormInput> = (data) => {
   
    const parsedData: IFormInput = { ...data };
    textFields?.forEach((field) => {
      if (field.type === 'number' && parsedData[field.name] !== undefined) {
        parsedData[field.name] = Number(parsedData[field.name]);
      }
    });
    onSubmit(parsedData);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-wrap items-center mb-4 space-x-2">
      {textFields?.map((field) => (
        <div className="flex flex-col mr-4 mb-4" key={field.name}>
          <InputLabel>{field?.inputLabel}</InputLabel>
          <TextField
            {...register(field.name, { required: field.required })}
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
            name={field.name}
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
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <VirtualizedAutocomplete
                options={field.options}
                loading={field.loading}
                label={field.label}
                value={field.options.find((option) => option.id === value) || null}
                onChange={(_event, newValue) => onChange(newValue ? newValue.id : null)}
                getOptionLabel={field.getOptionLabel}
              />
            )}
          />
        </div>
      ))}
      <div className="flex items-center">
        <Button type="submit" variant="contained" color="primary">
          {editId ? 'Обновить' : 'Добавить'} {formName}
        </Button>
      </div>
    </form>
  );
};

export default memo(CustomForm);
