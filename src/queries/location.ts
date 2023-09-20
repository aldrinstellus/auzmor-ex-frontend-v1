import {
  // QueryFunction,
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ILocation {
  id: string;
  name: string;
}

export const getAllLocations = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/locations', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteLocations = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['locations', q],
    queryFn: getAllLocations,
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const getGooglePlaces = async (payload: { q: string }) => {
  const data = await apiService.get('/google-maps/places', payload);
  return data.data.result.data;
};

export const useGooglePlaces = (payload: { q: string }) => {
  return useQuery({
    queryKey: ['google-maps-places', payload],
    queryFn: () => getGooglePlaces(payload),
  });
};
