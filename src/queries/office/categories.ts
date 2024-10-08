import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const getAllCategories = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/categories', queryKey[1]);
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
    staleTime: 0,
  });
};
