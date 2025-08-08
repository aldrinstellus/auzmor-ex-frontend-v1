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

export const getRecentSearchTerms = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiService.get('/search/recent/terms', {
      ...params,
    });
    return convertKeysToCamelCase(data);
  } catch (error) {
    return { result: { data: [] } };
  }
};

export const clickSearchResult = async (payload: {
  sourceId: string;
  sourceType: string;
  additionalInfo?: any;
}) => {
  try {
    const { sourceId, sourceType, additionalInfo } = payload;
    const { data } = await apiService.post(`/search/results/clicked`, {
      source_id: sourceId,
      source_type: sourceType,
      additional_info: additionalInfo,
    });
    return data;
  } catch (error) {
    return { result: { data: [] } };
  }
};

export const getRecentClickedResults = async (params?: Record<string, any>) => {
  try {
    const { data } = await apiService.get('/search/recent/clicked', {
      ...params,
    });
    return convertKeysToCamelCase(data);
  } catch (error) {
    return { result: { data: [] } };
  }
};

export const deleteRecentSearchTerm = async (id: string) => {
  return await apiService.delete(`search/terms/${id}`);
};

export const deleteRecentClickedResult = async (id: string) => {
  return await apiService.delete(`search/results/clicked/${id}`);
};

// ------------------ React Query -----------------------

export const useSearchResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-search', params],
      queryFn: () => getSearchResults({ ...params, scope: 'ADMIN' }),
      staleTime: 0,
      ...options,
    }),
  };
};

export const useLearnerSearchResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-search-learner', params],
      queryFn: () => getSearchResults({ ...params, scope: 'LEARNER' }),
      staleTime: 0,
      ...options,
    }),
  };
};

export const useRecentSearchTerms = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-recent-search-terms', params],
      queryFn: () => getRecentSearchTerms(params),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
  };
};

export const useRecentClickedResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-recent-clicked-results', params],
      queryFn: () => getRecentClickedResults({ ...params, scope: 'ADMIN' }),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
  };
};

export const useLearnerRecentClickedResults = (
  params?: Record<string, any>,
  options?: Record<string, any>,
) => {
  return {
    ...useQuery({
      queryKey: ['global-recent-clicked-results-learner', params],
      queryFn: () => getRecentClickedResults({ ...params, scope: 'LEARNER' }),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
  };
};
