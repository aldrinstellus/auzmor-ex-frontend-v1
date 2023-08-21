import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getAllCategories = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    // return await apiService.get('/categories', queryKey[1]);
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
              prev: 'https://office-dev.api.auzmor.com/api/v1/categories',
              next: 'https://office-dev.api.auzmor.com/api/v1/categories',
              limit: 30,
            },
          },
        });
      }, 1000);
    });
  } else return await apiService.get(pageParam);
};

export const useInfiniteCategories = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['categories', q],
    queryFn: getAllCategories,
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
