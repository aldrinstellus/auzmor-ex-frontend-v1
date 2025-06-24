import { useCallback, useEffect, useState } from 'react';
import { FilterKey, useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import useURLParams from './useURLParams';
import Icon from 'components/Icon';
import moment from 'moment';
import { parseNumber } from 'react-advanced-cropper';
import { useTranslation } from 'react-i18next';

export const useAppliedFilter = (initialFilters: Record<string, any>) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const store = useAppliedFiltersStore();
  const { filters, setFilters } = store;
  const { t: ts } = useTranslation('components', { keyPrefix: 'Sort' });

  const {
    searchParams,
    updateParam,
    serializeFilter,
    deleteParam,
    parseParams,
    deleteAllParms,
  } = useURLParams();

  // Sync filters to URL
  useEffect(() => {
    if (!isInitialized || !filters) return;
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        deleteParam(key);
      } else {
        updateParam(
          key,
          typeof value === 'object' ? serializeFilter(value) : value,
        );
      }
    });
  }, [filters, isInitialized]);

  // Load filters from URL on mount
  useEffect(() => {
    const keys = Array.from(searchParams.keys()) as string[];
    const restoredFilters: Record<string, any> = {};

    for (const key of keys) {
      const parsedValue = parseParams(key);
      restoredFilters[key] = parsedValue;
    }

    setFilters(restoredFilters);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    store.setFilters(initialFilters);
  }, []);

  useEffect(() => {
    if (!filters) {
      setIsFilterApplied(false);
      return;
    }
    const applied = Object.entries(filters).some(([key, value]) => {
      const initialValue = initialFilters[key];

      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null)
        return JSON.stringify(value) !== JSON.stringify(initialValue);
      return value !== undefined && value !== '' && value !== initialValue;
    });

    setIsFilterApplied(applied);
  }, [filters, initialFilters]);

  // Util: Format modified date
  const parseModifiedOn = useCallback((value: string) => {
    if (value.includes('custom')) {
      const [start, end] = value.replace('custom:', '').split('-');
      return `${moment(parseNumber(start)).format('DD MMM YYYY')} - ${moment(
        parseNumber(end),
      ).format('DD MMM YYYY')}`;
    }
    return value;
  }, []);

  const FilterChips = ({
    filterKeys = [],
    sortOptions = [
      {
        icon: 'sortByAcs',
        label: ts('aToZ'),
        key: 'name:asc',
        dataTestId: 'sortBy-asc',
      },
      {
        icon: 'sortByDesc',
        label: ts('zToA'),
        key: 'name:desc',
        dataTestId: 'sortBy-desc',
      },
      {
        icon: 'calendar',
        label: ts('dateModified'),
        key: 'external_updated_at',
        dataTestId: 'sortby-dateadded',
      },
    ],
  }: {
    filterKeys: FilterKey[];
    sortOptions?: {
      icon: string;
      label: string;
      key: string;
      dataTestId: string;
    }[];
  }) => {
    const { deleteParam } = useURLParams();
    return isFilterApplied ? (
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <span className="text-neutral-500">Filter by</span>
          {isFilterApplied &&
            filters &&
            Object.entries(filters).map(([key, value]) => {
              if (key === 'modifiedOn' || key === 'sort') return <></>;
              if (
                !value ||
                (Array.isArray(value) && value.length === 0) ||
                !filterKeys.map((eachFilter) => eachFilter.key).includes(key)
              )
                return null;

              const displayLabel =
                filterKeys.find((eachFilter) => eachFilter.key === key)
                  ?.label || key;
              const displayValues = Array.isArray(value)
                ? value.map((v) =>
                    typeof v === 'string'
                      ? v
                      : v?.data?.label || v?.data?.name || JSON.stringify(v),
                  )
                : [typeof value === 'string' ? value : JSON.stringify(value)];

              return (
                <FilterChip
                  key={key}
                  label={displayLabel}
                  values={displayValues}
                  onClear={() => {
                    setFilters({
                      ...filters,
                      [key]: Array.isArray(value) ? [] : '',
                    });
                    deleteParam(key);
                  }}
                />
              );
            })}
          {isFilterApplied && filters && !!filters.modifiedOn && (
            <FilterChip
              label="Modified on"
              values={[parseModifiedOn(filters.modifiedOn)]}
              onClear={() => setFilters({ ...filters, modifiedOn: '' })}
            />
          )}
          {isFilterApplied && filters && !!filters.sort && (
            <FilterChip
              label="Sort by"
              values={[
                sortOptions?.find((s) => s.key === filters.sort)?.label || '',
              ]}
              onClear={() => setFilters({ ...filters, sort: undefined })}
            />
          )}
        </div>
        <div
          className="text-neutral-500 border px-3 py-[3px] rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
          onClick={clearFilters}
          data-testid="people-clear-filters"
        >
          Clear all
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const FilterChip = ({
    label,
    values,
    onClear,
  }: {
    label: string;
    values: string[];
    onClear: () => void;
  }) => (
    <div
      onClick={onClear}
      className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
    >
      <span className="text-neutral-500 font-medium">
        {label}{' '}
        <span className="text-primary-500 font-bold">
          {values.slice(0, 2).join(', ')}
          {values.length > 2 && ` and + ${values.length - 2} more`}
        </span>
      </span>
      <Icon name="close" size={16} />
    </div>
  );

  const clearFilters = () => {
    store.clearFilters();
    deleteAllParms();
  };

  return { ...store, isFilterApplied, FilterChips, clearFilters };
};
