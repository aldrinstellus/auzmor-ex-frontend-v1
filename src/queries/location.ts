import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ILocation {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllLocations = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    // return await apiService.get('/locations', queryKey[1]);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Successful',
          code: 200,
          result: {
            data: [
              { id: 'OP1', name: 'OP1' },
              { id: 'OP2', name: 'OP2' },
              { id: 'OP3', name: 'OP3' },
            ],
            paging: {
              prev: 'https://office-dev.api.auzmor.com/api/v1/locations',
              next: 'https://office-dev.api.auzmor.com/api/v1/locations',
              limit: 30,
            },
          },
        });
      }, 1000);
    });
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

export const getGooglePlaces = async (payload: { q: string }) => {
  const data = await apiService.get('/google-maps/places', payload);
  return data.data.result.data;
};
