import React, { useState, useCallback } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { FixedSizeList } from 'react-window';

interface OptionType {
  id: number;
  name: string;
}

interface VirtualizedAutocompleteProps {
  options: OptionType[];
  loading: boolean;
  label: string;
  onChange: (event: any, newValue: OptionType | null) => void;
  value: OptionType | null;
  getOptionLabel: (option: OptionType) => string;
}

const LISTBOX_PADDING = 8; // px

function renderRow(props: any) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const VirtualizedAutocomplete = ({
  options,
  loading,
  label,
  onChange,
  value,
  getOptionLabel,
}: VirtualizedAutocompleteProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = useCallback((_event, newInputValue) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={value}
      className="min-w-44"
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          aria-label={label}
          placeholder={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
    />
  );
};


const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const ITEM_COUNT = itemData.length;
  const ITEM_SIZE = 36;

  const getHeight = () => {
    if (ITEM_COUNT > 8) {
      return 8 * ITEM_SIZE;
    }
    return ITEM_COUNT * ITEM_SIZE;
  };

  return (
    <div ref={ref} {...other}>
      <FixedSizeList
        height={getHeight() + 2 * LISTBOX_PADDING}
        itemCount={ITEM_COUNT}
        itemSize={ITEM_SIZE}
        overscanCount={5}
        itemData={itemData}
        width="100%"
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

export default VirtualizedAutocomplete;
