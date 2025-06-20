import { useEffect, useState } from 'react';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import useURLParams from './useURLParams';

export const useAppliedFilter = (initialFilters: Record<string, any>) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const store = useAppliedFiltersStore();
  const { filters, setFilters } = store;

  const {
    searchParams,
    updateParam,
    serializeFilter,
    deleteParam,
    parseParams,
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
    const sort = searchParams.get('sort') || undefined;
    const docOwners = parseParams('docOwners') || [];
    const docType = parseParams('docType') || [];
    const docModified = searchParams.get('docModified') || '';

    setFilters({ sort, docOwners, docType, docModified });

    const validSorts = [
      'name:asc',
      'name:desc',
      'external_updated_at',
      'size:desc',
    ];
    if (!validSorts.includes(sort)) deleteParam('sort');
    if (!docOwners.length) deleteParam('docOwners');
    if (!docType.length) deleteParam('docType');
    if (!docModified) deleteParam('docModified');

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    store.setFilters(initialFilters);
  }, []);

  return { ...store };
};
