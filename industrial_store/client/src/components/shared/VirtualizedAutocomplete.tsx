import React, { useState, useMemo, useCallback } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { debounce } from 'lodash';

interface VirtualizedAutocompleteProps {
  options: any[];
  loading: boolean;
  label: string;
  onChange: (event: any, newValue: any) => void;
  value: any;
  getOptionLabel: (option: any) => string;
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

const VirtualizedAutocomplete: React.FC<VirtualizedAutocompleteProps> = ({
  options,
  loading,
  label,
  onChange,
  value,
  getOptionLabel,
}) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedOnChange = useMemo(
    () =>
      debounce((event, newValue) => {
        onChange(event, newValue);
      }, 300),
    [onChange]
  );

  const handleInputChange = useCallback((event, newInputValue) => {
    setInputValue(newInputValue);
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={debouncedOnChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
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

// Adapter for react-window
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
