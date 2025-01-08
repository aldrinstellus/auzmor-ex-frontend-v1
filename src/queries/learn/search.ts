import { useQuery } from '@tanstack/react-query';

import apiService from 'utils/apiService';
import { convertKeysToCamelCase } from 'utils/misc';

export const getSearchResults = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiService.get('/search/lookahead', { ...params });
    return convertKeysToCamelCase(data);
  } catch (error) {
    return { result: { data: [] } };
  }
};

export const getRecentSearchResults = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiService.get('/recentsearch', { ...params });
    return data;
  } catch (error) {
    return { result: { data: [] } };
  }
};

export const deleteRecentSearchResult = async (id: string) => {
  return await apiService.delete(`recentsearch/${id}`);
};

// ------------------ React Query -----------------------

export const useSearchResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-search', params],
      queryFn: () => getSearchResults(params),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
  };
};

export const useRecentSearchResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-recent-search', params],
      queryFn: () => getRecentSearchResults(params),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
  };
};
