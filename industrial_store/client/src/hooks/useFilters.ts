import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { TypedLazyQueryTrigger, TypedUseQueryStateResult } from '@reduxjs/toolkit/dist/query/react';
import { QueryDefinition, BaseQueryFn } from '@reduxjs/toolkit/query';

export type FilterChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>;

interface UseFiltersHook<T, K> {
  reportData: T | undefined;
  applyFilters: () => void;
  clearFilters: () => void;
  handleFilterChange: (e: FilterChangeEvent) => void;
  filters: K;
}

function useFilters<T, K>(
  useLazyQuery: () => [TypedLazyQueryTrigger<T, K, BaseQueryFn>, TypedUseQueryStateResult<T, K, BaseQueryFn>, any],
  initialFilters: K
): UseFiltersHook<T, K> {
  const [filters, setFilters] = useState<K>(initialFilters);
  const [trigger, result] = useLazyQuery();
  const { data } = result;

  const applyFilters = () => {
    trigger(filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    trigger(initialFilters);
  };

  const handleFilterChange = (e: FilterChangeEvent) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { reportData: data, applyFilters, clearFilters, handleFilterChange, filters };
}

export default useFilters;
